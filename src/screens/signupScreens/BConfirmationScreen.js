import React, { useState, useRef } from 'react'
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
import colors from '../../constants/colors'

//custom button
import Button from '../../components/Button'
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'

//redux
import { useDispatch, useSelector } from 'react-redux'

//formik
import { Formik } from 'formik'
import * as yup from 'yup'
import 'yup-phone'

function hideKeyboard() {
    Keyboard.dismiss()
}

const { height, width } = Dimensions.get('window')

const AConfirmationScreen = (props) => {
    const insets = useSafeAreaInsets()

    const phoneConfirm = props.route.params?.phoneConfirm
    console.log(
        '🚀 ~ file: BConfirmationScreen.js ~ line 50 ~ AConfirmationScreen ~ phoneConfirm',
        phoneConfirm
    )

    const [topDimensions, setTopDimensions] = useState({ height: 0, width: 0 })
    const [useableScreenDimensions, setUseableScreenDimensions] = useState({
        height: 0,
        width: 0,
    })

    const [enteredNumber, setEnteredNumber] = useState()
    const [confirmLengthValid, setConfirmLengthValid] = useState()
    const [confirmationErrorMessage, setConfirmationErrorMessage] =
        useState(' ')

    const dispatch = useDispatch()

    function inputChangeHandler(number) {
        if (phoneConfirm && number.trim() == textCode) {
            setConfirmationErrorMessage(' ')
            setConfirmLengthValid(true)
        } else {
            setConfirmLengthValid(false)
        }

        if (!phoneConfirm && number.trim() == emailCode) {
            setConfirmationErrorMessage(' ')
            setConfirmLengthValid(true)
        } else {
            setConfirmLengthValid(false)
        }
        setEnteredNumber(number.replace(/[^0-9]/g, ''))
    }

    function nextPressedHandler() {
        if (confirmLengthValid) {
            props.navigation.navigate('CAddYourName')
        } else {
            setConfirmationErrorMessage('Incorrect confirmation code.')
        }
    }
    //----------------------------------------------------------------CONFIRMATION CODES----------------------------------------------------------------

    const emailCode = useSelector(
        (state) => state.signupReducer.confirmationEmail
    )

    const textCode = useSelector(
        (state) => state.signupReducer.confirmationText
    )

    //----------------------------------------------------------------Validation Schema----------------------------------------------------------------
    const [showErrors, setShowErrors] = useState(false)

    const validationSchema = yup.object().shape({
        Code: yup
            .string()
            .matches(/^\d+$/, 'The field should have digits only')
            .max(6)
            .required('Confirmation code is required.')
            .min(6),
        // .matches(emailCode || textCode, 'Incorrect validation code.'),
    })
    //----------------------------------------------------------------Validation Schema----------------------------------------------------------------

    //----------------------------------------------------------------
    return (
        <ScreenWrapper>
            <HeaderBasic
                goBack={() => {
                    props.navigation.goBack()
                }}
                iconName="chevron-back-outline"
            />
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
                                Enter Confirmation Code
                            </Text>
                            <Text
                                style={styles.underTitle}
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                            >
                                {/* Enter the confirmation code we sent to
                                haibertbarfian@gmail.com. */}
                                Enter the confirmation code we sent you.
                                <TouchableOpacity
                                    onPress={() => {}}
                                    style={{ bottom: -3 }}
                                >
                                    <Text
                                        style={styles.underTitleBold}
                                        maxFontSizeMultiplier={
                                            colors.maxFontSizeMultiplier
                                        }
                                    >
                                        {'  Resend Code.'}
                                    </Text>
                                </TouchableOpacity>
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
                            <Formik
                                initialValues={{ Code: '' }}
                                onSubmit={(values, { setErrors }) => {
                                    console.log(values.Code)
                                    console.log(textCode)
                                    console.log(phoneConfirm)
                                    if (
                                        phoneConfirm &&
                                        values.Code.trim() == textCode
                                    ) {
                                        console.log('got here')
                                        props.navigation.navigate(
                                            'CAddYourName'
                                        )
                                    } else {
                                        setErrors({
                                            Code: 'Confirmation code is incorrect.',
                                        })
                                    }

                                    if (
                                        !phoneConfirm &&
                                        values.Code.trim() == emailCode
                                    ) {
                                        props.navigation.navigate(
                                            'CAddYourName'
                                        )
                                    } else {
                                        setErrors({
                                            Code: 'Confirmation code is incorrect.',
                                        })
                                    }
                                }}
                                validationSchema={validationSchema}
                            >
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors,
                                    resetForm,
                                }) => (
                                    <View>
                                        <View
                                            style={{
                                                paddingHorizontal: 8,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View style={styles.textInputCont}>
                                                <TextInput
                                                    onChangeText={handleChange(
                                                        'Code'
                                                    )}
                                                    onBlur={handleBlur('Code')}
                                                    value={values.Code}
                                                    style={styles.input}
                                                    placeholder="Confirmation Code"
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
                                                    keyboardType="numeric"
                                                    autoFocus
                                                    maxLength={6}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        resetForm()
                                                    }}
                                                >
                                                    <Ionicons
                                                        name="close-circle"
                                                        size={20}
                                                        color={
                                                            colors.mediumTint
                                                        }
                                                        style={{
                                                            marginTop: 30,
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <Text style={styles.errorText}>
                                            {showErrors ? errors.Code : ' '}
                                        </Text>

                                        <Button
                                            style={styles.button}
                                            onPress={() => {
                                                setShowErrors(true)
                                                handleSubmit()
                                            }}
                                            text="Next"
                                        />
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </ScreenWrapper>
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
    textInputCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.lightTint,
        paddingHorizontal: 1,
    },
    midCont: {
        alignItems: 'center',
    },
    input: {
        marginTop: 30,
        width: '95%',
        height: 50,
        borderRadius: 5,
        padding: 5,
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

export default AConfirmationScreen
