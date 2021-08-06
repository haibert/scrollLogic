import React, { useEffect, useCallback, useState, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    Keyboard,
    Image,
    BackHandler,
    ActivityIndicator,
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

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//redux
import { login, setUserID } from '../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//formik
import { Formik } from 'formik'
import * as yup from 'yup'
import { color } from 'react-native-reanimated'

//status bar
import { StatusBar } from 'expo-status-bar'

//async AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

const { height, width } = Dimensions.get('screen')

function hideKeyboard() {
    Keyboard.dismiss()
}

const LoginScreen = (props) => {
    const [signUpShown, setSignUpShown] = useState(false)

    let dispatch = useDispatch()

    console.log('rerender')

    //http request
    const [isLoading, setIsLoading] = useState(false)
    const [httpError, setHttpError] = useState()

    // input validation
    const [opacity, setOpacity] = useState(1)
    const [usernameText, setUsername] = useState('')
    const [passwordText, setPassword] = useState('')
    const [userTouched, setUserTouched] = useState(false)
    const [passTouched, setPassTouched] = useState(false)
    const userValid = usernameText.trim() !== ''
    const passValid = passwordText.trim() !== ''
    // let shouldShowError =
    //     (!userValid && userTouched) || (!passValid && passTouched) || httpError

    // const userInputChangeHandler = (text) => {
    //     setUsername(text)
    //     if (shouldShowError) {
    //         setOpacity(1)
    //     }
    // }
    // const passInputChangeHandler = (text) => {
    //     setPassword(text)
    //     if (shouldShowError) {
    //         setOpacity(1)
    //     }
    // }
    // const userInputBlurHandler = (event) => {
    //     setUserTouched(true)
    //     if (shouldShowError) {
    //         setOpacity(1)
    //     }
    // }
    // const passInputBlurHandler = (event) => {
    //     setPassTouched(true)
    //     if (shouldShowError) {
    //         setOpacity(1)
    //     }
    // }
    // const loginPressedHandler = async () => {
    //     setHttpError(null)
    //     setIsLoading(true)
    //     setTimeout(() => {
    //         authenticate()
    //     }, 500)
    //     async function authenticate() {
    //         try {
    //             await dispatch(login(usernameText.trim(), passwordText.trim()))
    //             setIsLoading(false)
    //             props.navigation.navigate('DrawerNav')
    //         } catch (error) {
    //             setHttpError(error.message)
    //             setIsLoading(false)
    //         }
    //     }
    // }

    //Formik
    const validationSchema = yup.object().shape({
        username: yup
            .string()
            // .matches(
            //     /^[a-zA-Z]{2,40}([a-zA-Z]{2,40})+$/,
            //     'Please enter your full name.'
            // )
            .max(40)
            // .min(4, 'Username Is Too Short')
            .required('Please Enter Your Credentials.'),
        password: yup
            .string()
            // .matches(
            //     /^[a-zA-Z]{2,40}([a-zA-Z]{2,40})+$/,
            //     'Please enter your full name.'
            // )
            .max(40)
            // .min(3, 'Password Is Too Short')
            .required('Please Enter Your Credentials.'),
    })

    function closeSignup() {
        setSignUpShown(false)
    }

    const userXButton = useRef()
    const passXButton = useRef()
    const setUserXOpacity = useCallback((value) => {
        // Redacted: animation related code
        userXButton.current.setNativeProps({
            style: {
                opacity: value,
            },
        })
    }, [])
    const setPassXOpacity = useCallback((value) => {
        // Redacted: animation related code
        passXButton.current.setNativeProps({
            style: {
                opacity: value,
            },
        })
    }, [])

    useEffect(() => {
        const disable = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true
        )
        return () => {
            disable.remove()
        }
    }, [])

    //----------------------------------------------------------------AUTOMATIC LOGIN----------------------------------------------------------------
    // useEffect(() => {
    //     const checkUserID = async () => {
    //         const userLoggedIn = await AsyncStorage.getItem('userID')
    //         if (userLoggedIn) {
    //             await dispatch(setUserID(userLoggedIn))
    //             props.navigation.navigate('DrawerNav')
    //         }
    //     }

    //     checkUserID()
    // }, [])
    //----------------------------------------------------------------AUTOMATIC LOGIN----------------------------------------------------------------

    const insets = useSafeAreaInsets()
    return (
        // <View
        //     style={{
        //         paddingTop: Platform.OS === 'android' ? insets.top : null,
        //         height: height,
        //     }}
        // >
        <LinearGradient
            // colors={[
            //     'rgba(255, 237, 187, 1)',
            //     'rgba(255, 237, 187, 1)',
            //     'rgba(255, 237, 187, 1)',
            //     'rgba(150, 227, 255, 1)',
            //     'rgba(150, 227, 255, 1)',
            // ]}
            // colors={[f
            //     'rgba(255, 237, 187, 1)',
            //     'rgba(255, 237, 187, 1)',
            //     'rgba(255, 237, 187, 1)',
            //     colors.buttonPurple,
            // ]}
            // colors={[
            //     'rgba(150, 227, 255, 1)',
            //     'rgba(150, 227, 255, 1)',
            //     // colors.buttonPurple,
            // ]}
            // colors={[
            //     'rgba(150, 227, 255, 1)',
            //     'rgba(150, 227, 255, 1)',
            //     'rgba(150, 227, 255, 1)',
            //     colors.blue2,
            //     colors.blue3,
            // ]}
            // colors={[
            //     'rgba(252,140,250,1)',
            //     'rgba(252,140,250,1)',
            //     'rgba(255, 237, 187, 1)',
            // ]}
            colors={[
                'rgba(252,140,250,1)',
                'rgba(252,140,250,1)',
                colors.lightTint,
            ]}
            style={{
                // flex: 1,
                paddingTop: Platform.OS === 'android' ? insets.top : null,
                height: height,
            }}
            // start={{ x: 0.1, y: 0.3 }}
            // end={{ x: 0.1, y: 0.2 }}
        >
            {/* <Image
                source={require('../../assets/A.png')}
                // source={require('../../assets/B.png')}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 300,
                    width: width,
                }}
                resizeMode="stretch"
            /> */}
            {Platform.OS === 'android' ? null : (
                <BlurView
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 300,
                        width: width,
                    }}
                    intensity={30}
                ></BlurView>
            )}
            <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(252,140,250,1)']}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 300,
                    width: width,
                    alignItems: 'center',
                }}
            >
                <Ionicons
                    name="images-outline"
                    size={65}
                    color="white"
                    style={{ marginTop: '20%' }}
                />
            </LinearGradient>
            <StatusBar
                style="light"
                translucent
                backgroundColor="rgba(255,255,255,0)"
                animated
            />

            <TouchableWithoutFeedback
                style={styles.touchable}
                onPress={hideKeyboard}
            >
                <View
                    style={{
                        marginTop: 20,
                        paddingBottom: insets.bottom,
                        flex: 1,
                    }}
                >
                    <View style={styles.upperBox}>
                        <View style={styles.formikCont}>
                            <Formik
                                validationSchema={validationSchema}
                                initialValues={{
                                    username: '',
                                    password: '',
                                }}
                                initialTouched={{
                                    username: false,
                                    password: false,
                                }}
                                initialErrors={{
                                    username: undefined,
                                    password: undefined,
                                }}
                                onSubmit={(values) => {
                                    setHttpError(null)
                                    setIsLoading(true)
                                    setTimeout(() => {
                                        authenticate()
                                    }, 500)
                                    async function authenticate() {
                                        try {
                                            await dispatch(
                                                login(
                                                    values.username,
                                                    values.password
                                                )
                                            )
                                            setIsLoading(false)
                                            props.navigation.navigate(
                                                'DashModalStack',
                                                { screen: 'DashboardScreen' }
                                            )
                                            console.log('pressed ')
                                        } catch (error) {
                                            setHttpError(error.message)
                                            setIsLoading(false)
                                        }
                                    }
                                }}
                            >
                                {({
                                    handleChange,
                                    handleBlur,
                                    values,
                                    errors,
                                    setFieldValue,
                                    touched,
                                    handleSubmit,
                                    resetForm,
                                }) => (
                                    <View style={styles.formikInnerCont}>
                                        <View style={styles.textInputCont}>
                                            <TextInput
                                                onChangeText={handleChange(
                                                    'username'
                                                )}
                                                onBlur={handleBlur('username')}
                                                placeholder="Username"
                                                value={values.username}
                                                style={styles.input}
                                                placeholderTextColor={
                                                    colors.placeHolder
                                                }
                                                selectionColor={
                                                    colors.lightTint
                                                }
                                                // underlineColorAndroid="rgba(255,255,255,0)"
                                                maxFontSizeMultiplier={
                                                    colors.maxFontSizeMultiplier
                                                }
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                onFocus={() => {
                                                    setUserXOpacity(1)
                                                }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (
                                                        values.password === ''
                                                    ) {
                                                        resetForm()
                                                        httpError
                                                            ? setHttpError(null)
                                                            : null
                                                    }

                                                    setFieldValue(
                                                        'username',
                                                        ''
                                                    )
                                                }}
                                            >
                                                <Ionicons
                                                    ref={userXButton}
                                                    name="close-circle"
                                                    size={20}
                                                    color={colors.mediumTint}
                                                    style={{
                                                        opacity: 0,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.textInputCont}>
                                            <TextInput
                                                onChangeText={handleChange(
                                                    'password'
                                                )}
                                                onBlur={handleBlur('password')}
                                                placeholder="Password"
                                                value={values.password}
                                                style={styles.input}
                                                placeholderTextColor={
                                                    colors.placeHolder
                                                }
                                                selectionColor={
                                                    colors.lightTint
                                                }
                                                underlineColorAndroid="rgba(255,255,255,0)"
                                                maxFontSizeMultiplier={
                                                    colors.maxFontSizeMultiplier
                                                }
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                secureTextEntry={true}
                                                onFocus={() => {
                                                    setPassXOpacity(1)
                                                }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (
                                                        values.username === ''
                                                    ) {
                                                        resetForm()
                                                        httpError
                                                            ? setHttpError(null)
                                                            : null
                                                    }
                                                    setFieldValue(
                                                        'password',
                                                        ''
                                                    )
                                                }}
                                            >
                                                <Ionicons
                                                    ref={passXButton}
                                                    name="close-circle"
                                                    size={20}
                                                    color={colors.mediumTint}
                                                    style={{ opacity: 0 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text
                                            style={{
                                                ...styles.errorMessage,
                                                opacity:
                                                    (errors.username &&
                                                        touched.username) ||
                                                    (errors.password &&
                                                        touched.password) ||
                                                    httpError
                                                        ? 1
                                                        : 0,
                                            }}
                                            underlineColorAndroid="rgba(255,255,255,0)"
                                            maxFontSizeMultiplier={
                                                colors.maxFontSizeMultiplier
                                            }
                                        >
                                            {httpError
                                                ? httpError
                                                : 'Please Enter Your Credentials'}
                                        </Text>

                                        <Button
                                            style={styles.button}
                                            onPress={() => {
                                                Keyboard.dismiss()
                                                httpError
                                                    ? setHttpError(null)
                                                    : null
                                                handleSubmit()
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
                                )}
                            </Formik>
                        </View>
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
            {isLoading && (
                <View style={[StyleSheet.absoluteFill, styles.loadingView]}>
                    <ActivityIndicator color="rgba(207,207,207,0.84)" />
                </View>
            )}
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    touchable: {
        height: '100%',
        width: '100%',
    },
    upperBox: {
        flex: 1,
        height: '50%',
        maxHeight: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '30%',
    },
    formikCont: {
        width: '100%',
        paddingHorizontal: '10%',
    },
    input: {
        height: 50,
        flex: 1,
        color: colors.textColor,
        fontSize: 17,
    },
    formikInnerCont: {
        alignItems: 'center',
    },
    textInputCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.lightTint,
    },
    errorMessage: {
        marginTop: 30,
        color: 'white',
        fontSize: 17,
        textAlign: 'center',
        backgroundColor: 'red',
        borderRadius: 4,
        padding: 2,
        paddingHorizontal: 5,
        overflow: 'hidden',
    },
    button: {
        marginTop: 30,
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
        height: Platform.OS === 'android' ? '45%' : '50%',
        maxHeight: Platform.OS === 'android' ? '45%' : '50%',
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
    loadingView: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default LoginScreen

// <View
// style={{
//     flex: 1,
//     paddingTop: Platform.OS === 'android' ? insets.top : null,
// }}
// >
// <LinearGradient
//     // colors={[
//     //     'rgba(255, 237, 187, 1)',
//     //     'rgba(255, 237, 187, 1)',
//     //     'rgba(255, 237, 187, 1)',
//     //     'rgba(150, 227, 255, 1)',
//     //     'rgba(150, 227, 255, 1)',
//     // ]}
//     // colors={[
//     //     'rgba(255, 237, 187, 1)',
//     //     'rgba(255, 237, 187, 1)',
//     //     'rgba(255, 237, 187, 1)',
//     //     colors.buttonPurple,
//     // ]}
//     // colors={[
//     //     'rgba(150, 227, 255, 1)',
//     //     'rgba(150, 227, 255, 1)',
//     //     // colors.buttonPurple,
//     // ]}
//     // colors={[
//     //     'rgba(150, 227, 255, 1)',
//     //     'rgba(150, 227, 255, 1)',
//     //     'rgba(150, 227, 255, 1)',
//     //     colors.blue2,
//     //     colors.blue3,
//     // ]}
//     // colors={[
//     //     'rgba(252,140,250,1)',
//     //     'rgba(252,140,250,1)',
//     //     'rgba(255, 237, 187, 1)',
//     // ]}
//     colors={[
//         'rgba(252,140,250,1)',
//         'rgba(252,140,250,1)',
//         colors.lightTint,
//     ]}
//     style={{ flex: 1 }}
//     // start={{ x: 0.1, y: 0.3 }}
//     // end={{ x: 0.1, y: 0.2 }}
// >
//     <Image
//         source={require('../../assets/A.png')}
//         // source={require('../../assets/B.png')}
//         style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: 300,
//             width: width,
//         }}
//         resizeMode="stretch"
//     />
//     {Platform.OS === 'android' ? null : (
//         <BlurView
//             style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 height: 300,
//                 width: width,
//             }}
//             intensity={30}
//         ></BlurView>
//     )}
//     <LinearGradient
//         colors={['rgba(255,255,255,0)', 'rgba(252,140,250,1)']}
//         style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: 300,
//             width: width,
//             alignItems: 'center',
//         }}
//         // start={{ x: 0, y: 0 }}
//         // end={{ x: 1, y: 0 }}
//     >
//         <Ionicons
//             name="images-outline"
//             size={65}
//             color="white"
//             style={{ marginTop: '20%' }}
//         />
//     </LinearGradient>
//     <TouchableWithoutFeedback
//         style={styles.touchable}
//         onPress={hideKeyboard}
//     >
//         <View
//             style={{
//                 // paddingTop: insets.top,
//                 paddingBottom: insets.bottom,
//                 flex: 1,
//             }}
//         >
//             <View style={styles.upperBox}>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Username"
//                     placeholderTextColor={colors.yellow}
//                     placeholderTextColor="white"
//                     // placeholderTextColor={colors.evenLighterTint}
//                     selectionColor={colors.lightTint}
//                     underlineColorAndroid="rgba(255,255,255,0)"
//                     maxFontSizeMultiplier={
//                         colors.maxFontSizeMultiplier
//                     }
//                     onChangeText={userInputChangeHandler}
//                     value={usernameText}
//                     onBlur={userInputBlurHandler}
//                     autoCapitalize="none"
//                 />
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Password"
//                     placeholderTextColor={colors.yellow}
//                     placeholderTextColor="white"
//                     // placeholderTextColor={colors.evenLighterTint}
//                     selectionColor={colors.lightTint}
//                     underlineColorAndroid="rgba(255,255,255,0)"
//                     maxFontSizeMultiplier={
//                         colors.maxFontSizeMultiplier
//                     }
//                     onChangeText={passInputChangeHandler}
//                     value={passwordText}
//                     onBlur={passInputBlurHandler}
//                     autoCapitalize="none"
//                     secureTextEntry
//                     // textContentType="password"
//                 />

//                 <Text
//                     style={{ ...styles.errorMessage, opacity }}
//                     underlineColorAndroid="rgba(255,255,255,0)"
//                     maxFontSizeMultiplier={
//                         colors.maxFontSizeMultiplier
//                     }
//                 >
//                     {httpError
//                         ? httpError
//                         : 'Please Enter Your Credentials'}
//                 </Text>
//                 <Button
//                     style={styles.button}
//                     onPress={loginPressedHandler}
//                     text="Login"
//                 />
//                 <TouchableOpacity
//                     onPress={() => {}}
//                     style={styles.forgot}
//                 >
//                     <Text
//                         style={styles.forgotText}
//                         maxFontSizeMultiplier={
//                             colors.maxFontSizeMultiplier
//                         }
//                     >
//                         Forgot your login details?
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.lowerBox}>
//                 <View style={styles.signUpCont}>
//                     <Text
//                         style={styles.signUp}
//                         maxFontSizeMultiplier={
//                             colors.maxFontSizeMultiplier
//                         }
//                     >
//                         Don't have an account yet?
//                     </Text>
//                     <TouchableOpacity
//                         onPress={() => {
//                             props.navigation.navigate(
//                                 'SignUpNavigation'
//                             )
//                         }}
//                     >
//                         <Text
//                             style={styles.signUpTouchable}
//                             maxFontSizeMultiplier={
//                                 colors.maxFontSizeMultiplier
//                             }
//                         >
//                             {'  Sign Up.'}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     </TouchableWithoutFeedback>
// </LinearGradient>
// {isLoading && (
//     <View style={[StyleSheet.absoluteFill, styles.loadingView]}>
//         <ActivityIndicator color="rgba(207,207,207,0.84)" />
//     </View>
// )}
// {/* <Modal
//     visible={signUpShown}
//     animationType="slide"
//     statusBarTranslucent={true}
// >
//     <SignupScreen
//         closeSignUpSheet={closeSignup}
//         navigation={props.navigation}
//     />
// </Modal> */}
// </View>
