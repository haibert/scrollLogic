import React, { useState } from 'react'
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
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'

//formik
import { Formik } from 'formik'
import * as yup from 'yup'
import 'yup-phone'

//redux
import { addPassword } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

function hideKeyboard() {
    Keyboard.dismiss()
}

const CCreatePassword = (props) => {
    const insets = useSafeAreaInsets()

    const [topDimensions, setTopDimensions] = useState({ height: 0, width: 0 })
    const [useableScreenDimensions, setUseableScreenDimensions] = useState({
        height: 0,
        width: 0,
    })

    const dispatch = useDispatch()

    const [showErrors, setShowErrors] = useState(false)

    const validationSchema = yup.object().shape({
        password: yup
            .string()
            .required('A password is required.')
            .min(8, 'This password is too short'),
    })

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
                                Create a Password
                            </Text>
                            <Text
                                style={styles.underTitle}
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                            >
                                Your password should be at least 8 characters
                                long.
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
                                initialValues={{ email: '' }}
                                onSubmit={(values) => {
                                    dispatch(addPassword(values.password))
                                    props.navigation.navigate(
                                        'EAddYourBirthday'
                                    )
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
                                                        'password'
                                                    )}
                                                    onBlur={handleBlur(
                                                        'password'
                                                    )}
                                                    value={values.password}
                                                    style={styles.input}
                                                    placeholder=""
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
                                                    secureTextEntry={true}
                                                    placeholder="Create Password"
                                                    autoFocus
                                                    autoCapitalize="none"
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
                                            {showErrors
                                                ? errors.password
                                                : null}
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

{
    /* <TextInput
                                    style={styles.input}
                                    placeholder=""
                                    placeholderTextColor={colors.placeHolder}
                                    selectionColor={colors.lightTint}
                                    underlineColorAndroid="rgba(255,255,255,0)"
                                    maxFontSizeMultiplier={
                                        colors.maxFontSizeMultiplier
                                    }
                                    secureTextEntry={true}
                                />
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color={colors.mediumTint}
                                    onPress={() => {}}
                                    style={{ marginTop: 30 }}
                                /> */
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

export default CCreatePassword
