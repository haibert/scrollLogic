import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    Keyboard,
    Modal,
} from 'react-native'

import {
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

// custom button
import Button from '../components/Button'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { height } = Dimensions.get('screen')

function hideKeyboard() {
    Keyboard.dismiss()
}

const LoginScreen = (props) => {
    const [signUpShown, setSignUpShown] = useState(false)

    function closeSignup() {
        setSignUpShown(false)
    }

    const insets = useSafeAreaInsets()
    return (
        <View style={styles.screen}>
            <LinearGradient
                colors={['rgba(255, 237, 187, 1)', 'rgba(150, 227, 255, 1)']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <TouchableWithoutFeedback
                    style={styles.screen}
                    onPress={hideKeyboard}
                >
                    <View
                        style={{
                            paddingBottom: insets.bottom,
                            flex: 1,
                        }}
                    >
                        <View style={styles.upperBox}>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor={colors.placeHolder}
                                selectionColor={colors.lightTint}
                                underlineColorAndroid="rgba(255,255,255,0)"
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={colors.placeHolder}
                                selectionColor={colors.lightTint}
                                underlineColorAndroid="rgba(255,255,255,0)"
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                            />
                            <Button
                                style={styles.button}
                                onPress={() => {
                                    props.navigation.navigate('DrawerNav')
                                }}
                                text="Login"
                            />
                            <TouchableOpacity
                                onPress={() => {}}
                                style={styles.forgot}
                            >
                                <Text
                                    style={styles.forgotText}
                                    maxFontSizeMultiplier={
                                        colors.maxFontSizeMultiplier
                                    }
                                >
                                    Forgot your login details?
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.lowerBox}>
                            <View style={styles.signUpCont}>
                                <Text
                                    style={styles.signUp}
                                    maxFontSizeMultiplier={
                                        colors.maxFontSizeMultiplier
                                    }
                                >
                                    Don't have an account yet?
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        props.navigation.navigate(
                                            'SignUpNavigation'
                                        )
                                    }}
                                >
                                    <Text
                                        style={styles.signUpTouchable}
                                        maxFontSizeMultiplier={
                                            colors.maxFontSizeMultiplier
                                        }
                                    >
                                        {'  Sign Up.'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </LinearGradient>
            {/* <Modal
                visible={signUpShown}
                animationType="slide"
                statusBarTranslucent={true}
            >
                <SignupScreen
                    closeSignUpSheet={closeSignup}
                    navigation={props.navigation}
                />
            </Modal> */}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: height,
        width: '100%',
    },
    upperBox: {
        flex: 1,
        height: '60%',
        maxHeight: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        width: '80%',
        borderBottomColor: '#e896be',
        borderBottomWidth: 1,
        color: colors.textColor,
        fontSize: 17,
    },
    button: {
        width: '80%',
        marginTop: 50,
    },
    forgot: {
        marginTop: 20,
    },
    forgotText: {
        color: colors.mediumTint,
        fontSize: 15,
    },
    lowerBox: {
        width: '100%',
        height: Platform.OS === 'android' ? '30%' : '40%',
        maxHeight: Platform.OS === 'android' ? '30%' : '40%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    signUpCont: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    signUp: {
        color: colors.mediumTint,
        fontSize: 15,
    },
    signUpTouchable: {
        color: colors.mediumTint,
        fontWeight: 'bold',
        fontSize: 15,
    },
})

export default LoginScreen
