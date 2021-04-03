import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    Dimensions,
} from 'react-native'
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
import colors from '../constants/colors'

import { color, event, set } from 'react-native-reanimated'

function hideKeyboard() {
    Keyboard.dismiss()
}

const { height, width } = Dimensions.get('window')

const SignupScreen = (props) => {
    const insets = useSafeAreaInsets()

    const [emailSelected, setEmailSelected] = useState(true)
    const [phoneSelected, setPhoneSelected] = useState(false)

    const [topDimensions, setTopDimensions] = useState({ height: 0, width: 0 })

    function togglePhone() {
        setPhoneSelected(true)
        setEmailSelected(false)
    }

    function toggleEmail() {
        setPhoneSelected(false)
        setEmailSelected(true)
    }

    return (
        <LinearGradient
            colors={['rgba(255, 237, 187, 1)', 'rgba(255, 227, 255, 1)']}
            style={{ flex: 1, paddingHorizontal: 20 }}
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
                <TouchableWithoutFeedback onPress={hideKeyboard}>
                    <View
                        onLayout={(event) => {
                            setTopDimensions({
                                width: event.nativeEvent.layout.width,
                                height: event.nativeEvent.layout.height,
                            })
                        }}
                    >
                        <View style={styles.xCont}>
                            <TouchableOpacity
                                onPress={() => {
                                    props.closeSignUpSheet()
                                }}
                            >
                                <Ionicons
                                    name="close-outline"
                                    size={45}
                                    color={colors.mediumTint}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.titleCont}>
                            <Text style={styles.title}>
                                Enter Phone or Email
                            </Text>
                        </View>
                        <View style={styles.topBottomCont}>
                            <TouchableOpacity onPress={togglePhone}>
                                <Text style={styles.buttonText}>Phone</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleEmail}>
                                <Text style={styles.buttonText}>Email</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomLineCont}>
                            {phoneSelected ? (
                                <View style={styles.selectedLine}></View>
                            ) : (
                                <View style={styles.noneSelectedLine}></View>
                            )}
                            {emailSelected ? (
                                <View style={styles.selectedLine}></View>
                            ) : (
                                <View style={styles.noneSelectedLine}></View>
                            )}
                        </View>
                    </View>
                    <View
                        style={[
                            styles.midCont,
                            { height: height - topDimensions.height - 110 },
                        ]}
                    >
                        {emailSelected ? (
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={colors.placeHolder}
                                selectionColor={colors.lightTint}
                                underlineColorAndroid="rgba(255,255,255,0)"
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                                keyboardType="email-address"
                            />
                        ) : (
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor={colors.placeHolder}
                                selectionColor={colors.lightTint}
                                underlineColorAndroid="rgba(255,255,255,0)"
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                                keyboardType="phone-pad"
                            />
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    xCont: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    titleCont: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 25,
        color: colors.placeHolder,
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
        borderWidth: 2,
        borderColor: 'black',
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
        marginTop: 30,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        height: 50,
        borderColor: colors.lightTint,
        borderRadius: 5,
        padding: 10,
        color: colors.textColor,
        fontSize: 17,
    },
})

export default SignupScreen
