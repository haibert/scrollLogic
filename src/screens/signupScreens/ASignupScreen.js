import React, { useState, useCallback } from 'react'
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
import { Icon } from 'react-native-elements'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../../constants/colors'

//custom button
import Button from '../../components/Button'

//formik
import { Formik } from 'formik'
import * as yup from 'yup'
import 'yup-phone'

//redux
import { addEmail } from '../../store/signup/actions'
import { useDispatch, useSelector } from 'react-redux'

function hideKeyboard() {
    Keyboard.dismiss()
}

const validationSchemaEmail = yup.object().shape({
    email: yup
        .string()
        .label('email')
        .required('Email is a required field.')
        .email('The entered email must be a valid.'),
})

const validationSchemaPhone = yup.string().phone('US', true).required()

const SignupScreen = (props) => {
    const insets = useSafeAreaInsets()

    const [emailSelected, setEmailSelected] = useState(true)
    const [phoneSelected, setPhoneSelected] = useState(false)

    const [phoneError, setPhoneError] = useState(' ')

    const [showErrors, setShowErrors] = useState(false)
    const [showErrors2, setShowErrors2] = useState(false)

    const [topDimensions, setTopDimensions] = useState({ height: 0, width: 0 })
    const [useableScreenDimensions, setUseableScreenDimensions] = useState({
        height: 0,
        width: 0,
    })

    const dispatch = useDispatch()

    function togglePhone() {
        setPhoneSelected(true)
        setEmailSelected(false)
    }

    function toggleEmail() {
        setPhoneSelected(false)
        setEmailSelected(true)
    }

    const addEmailToStore = useCallback((email) => {
        dispatch(addEmail(email))
    }, [])

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
                                    <View
                                        style={styles.noneSelectedLine}
                                    ></View>
                                )}
                                {emailSelected ? (
                                    <View style={styles.selectedLine}></View>
                                ) : (
                                    <View
                                        style={styles.noneSelectedLine}
                                    ></View>
                                )}
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
                            {emailSelected ? (
                                <Formik
                                    initialValues={{ email: '' }}
                                    onSubmit={(values) => {
                                        addEmailToStore(values.email)
                                        props.navigation.navigate(
                                            'BConfirmationScreen'
                                        )
                                    }}
                                    validationSchema={validationSchemaEmail}
                                >
                                    {({
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        values,
                                        errors,
                                        resetForm,
                                        initialErrors,
                                    }) => (
                                        <View>
                                            <View
                                                style={{
                                                    paddingHorizontal: 8,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View
                                                    style={styles.textInputCont}
                                                >
                                                    <TextInput
                                                        onChangeText={handleChange(
                                                            'email'
                                                        )}
                                                        onBlur={handleBlur(
                                                            'email'
                                                        )}
                                                        value={values.email}
                                                        style={styles.input}
                                                        placeholder="Email"
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
                                                        keyboardType="email-address"
                                                        autoFocus
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            resetForm()
                                                            setShowErrors(false)
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

                                            {showErrors ? (
                                                <Text style={styles.errorText}>
                                                    {errors.email}
                                                </Text>
                                            ) : (
                                                <Text
                                                    style={[styles.errorText]}
                                                >
                                                    {' '}
                                                </Text>
                                            )}

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
                            ) : (
                                <Formik
                                    initialValues={{ phone: '' }}
                                    onSubmit={(values) => {
                                        console.log(values)
                                        !validationSchemaPhone.isValidSync(
                                            values.phone
                                        )
                                            ? null
                                            : props.navigation.navigate(
                                                  'BConfirmationScreen'
                                              )
                                    }}
                                    validationSchema={validationSchemaPhone}
                                >
                                    {({
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        values,
                                        resetForm,
                                        initialErrors,
                                    }) => (
                                        <View>
                                            <View
                                                style={{
                                                    paddingHorizontal: 8,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View
                                                    style={styles.textInputCont}
                                                >
                                                    <TextInput
                                                        onChangeText={handleChange(
                                                            'phone'
                                                        )}
                                                        onBlur={handleBlur(
                                                            'phone'
                                                        )}
                                                        value={values.phone}
                                                        style={styles.input}
                                                        placeholder="Phone Number"
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
                                                        keyboardType="number-pad"
                                                        autoFocus
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            resetForm()
                                                            setShowErrors2(
                                                                false
                                                            )
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

                                            {showErrors2 ? (
                                                <Text style={styles.errorText}>
                                                    {!validationSchemaPhone.isValidSync(
                                                        values.phone
                                                    )
                                                        ? phoneError
                                                        : ' '}
                                                </Text>
                                            ) : (
                                                <Text style={styles.errorText}>
                                                    {' '}
                                                </Text>
                                            )}

                                            <Button
                                                style={styles.button}
                                                onPress={() => {
                                                    setShowErrors2(true)
                                                    !validationSchemaPhone.isValidSync(
                                                        values.phone
                                                    )
                                                        ? setPhoneError(
                                                              'Please provide a valid phone number.'
                                                          )
                                                        : setPhoneError('')
                                                    handleSubmit()
                                                }}
                                                text="Next"
                                            />
                                        </View>
                                    )}
                                </Formik>
                            )}
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

export default SignupScreen