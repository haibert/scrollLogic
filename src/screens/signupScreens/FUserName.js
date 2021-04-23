import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Keyboard } from 'react-native'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../../constants/colors'

//custom button
import Button from '../../components/Button'

//redux
import { addUsername, signupUser } from '../../store/signup/actions'
import { useDispatch, useSelector } from 'react-redux'

function hideKeyboard() {
    Keyboard.dismiss()
}

const FUserNameFork = (props) => {
    const insets = useSafeAreaInsets()

    const [topDimensions, setTopDimensions] = useState({ height: 0, width: 0 })
    const [useableScreenDimensions, setUseableScreenDimensions] = useState({
        height: 0,
        width: 0,
    })

    const dispatch = useDispatch()

    const [usernameValidError, setUsernameValidError] = useState()
    const [userTxtChange, setUserTextChange] = useState()

    function userNameChangeHandler(enteredText) {
        setUserTextChange(enteredText)
        if (enteredText.trim().length >= 4) {
            setUsernameValidError(null)
            return
        }
        setUsernameValidError('Please enter a valid username.')
    }

    const nextPressedHandler = useCallback(async () => {
        if (usernameValidError) {
            return
        }
        dispatch(addUsername(userTxtChange))
        await dispatch(signupUser())
        props.navigation.navigate('DrawerNav', {
            screen: 'DashboardScreen',
        })
    }, [userTxtChange])

    return (
        <LinearGradient
            // colors={['rgba(255, 237, 187, 1)', 'rgba(255, 227, 255, 1)']}
            colors={['rgba(255, 237, 187, 1)', 'rgba(150, 227, 255, 1)']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            <View
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    flex: 1,
                }}
            >
                <View style={styles.xCont}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.goBack()
                        }}
                    >
                        <Ionicons
                            name="chevron-back-outline"
                            size={40}
                            color={colors.mediumTint}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 20,
                    }}
                    onLayout={(event) => {
                        setUseableScreenDimensions({
                            width: event.nativeEvent.layout.width,
                            height: event.nativeEvent.layout.height,
                        })
                    }}
                >
                    <TouchableWithoutFeedback onPress={hideKeyboard}>
                        <View
                            onLayout={(event) => {
                                setTopDimensions({
                                    width: event.nativeEvent.layout.width,
                                    height: event.nativeEvent.layout.height,
                                })
                            }}
                        >
                            <View style={styles.titleCont}>
                                <Text
                                    style={styles.title}
                                    maxFontSizeMultiplier={
                                        colors.maxFontSizeMultiplier
                                    }
                                >
                                    Choose Your Username
                                </Text>
                                <Text
                                    style={styles.underTitle}
                                    maxFontSizeMultiplier={
                                        colors.maxFontSizeMultiplier
                                    }
                                >
                                    You may change your username later.
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.midCont,
                                {
                                    height:
                                        useableScreenDimensions.height -
                                        topDimensions.height,
                                },
                            ]}
                        >
                            <View>
                                <View style={styles.textInputCont}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Username"
                                        placeholderTextColor={
                                            colors.placeHolder
                                        }
                                        selectionColor={colors.lightTint}
                                        underlineColorAndroid="rgba(255,255,255,0)"
                                        maxFontSizeMultiplier={
                                            colors.maxFontSizeMultiplier
                                        }
                                        onChangeText={(text) =>
                                            userNameChangeHandler(text)
                                        }
                                        value={userTxtChange}
                                        autoFocus
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            setUserTextChange('')
                                        }}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={20}
                                            color={colors.mediumTint}
                                            style={{ marginTop: 30 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.errorText}>
                                    {usernameValidError}
                                </Text>
                            </View>
                            <Button
                                style={styles.button}
                                onPress={nextPressedHandler}
                                text="Next"
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    xCont: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleCont: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        color: colors.placeHolder,
    },

    underTitle: {
        color: colors.mediumTint,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 15,
    },
    underTitleBold: {
        color: colors.mediumTint,
        fontWeight: 'bold',
        fontSize: 15,
    },
    topBottomCont: {
        borderBottomColor: colors.mediumTint,
        borderBottomWidth: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    buttonText: {
        color: colors.mediumTint,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        minWidth: '50%',
        textAlign: 'center',
        marginBottom: 10,
    },
    bottomLineCont: {
        flexDirection: 'row',
    },
    selectedLine: {
        borderBottomColor: colors.mediumTint,
        borderBottomWidth: 6,
        width: '50%',
        marginTop: -1,
    },
    noneSelectedLine: {
        borderBottomColor: 'rgba(255,255,255,0)',
        borderBottomWidth: 6,
        width: '50%',
        marginTop: -1,
    },
    midCont: {
        alignItems: 'center',
    },
    textInputCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.lightTint,
    },

    input: {
        marginTop: 30,
        width: '92%',
        height: 50,
        borderRadius: 5,
        padding: 10,
        color: colors.textColor,
        fontSize: 17,
    },
    errorText: {
        marginHorizontal: 5,
        marginTop: 10,
        color: colors.lightTint,
        fontSize: 15,
        height: 20,
    },
    button: {
        marginTop: 30,
    },
})

export default FUserNameFork
