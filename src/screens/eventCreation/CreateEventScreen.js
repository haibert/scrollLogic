import React, { useRef, useCallback, useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
} from 'react-native'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../../constants/colors'

//custom components
import Button from '../../components/Button'
import CustomHeaderBasic from '../../components/HeaderBasic'
import ScreenWrapper from '../../components/ScreenWrapper'

const { height, width } = Dimensions.get('screen')

//redux
import { addGallery } from '../../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

//formik
import { Formik } from 'formik'
import * as yup from 'yup'

const CreateEventScreen = (props) => {
    const dispatch = useDispatch()
    const inputRef = useRef()

    useEffect(() => {
        setTimeout(() => {
            inputRef.current.focus()
        }, 500)
        // inputRef.current.focus()
    }, [])

    //http request
    const [isLoading, setIsLoading] = useState(false)
    const [httpError, setHttpError] = useState()

    function hideKeyboard() {
        Keyboard.dismiss()
    }

    //Formik
    const validationSchema = yup.object().shape({
        eventName: yup
            .string()
            // .matches(
            //     /^[a-zA-Z]{2,40}([a-zA-Z]{2,40})+$/,
            //     'Please enter your full name.'
            // )
            .max(40, 'Gallery Name must be at 40 characters at most')
            // .min(4, 'Username Is Too Short')
            .required('Please Enter A Gallery Name.'),
    })
    const userXButton = useRef()
    const setUserXOpacity = useCallback((value) => {
        userXButton.current.setNativeProps({
            style: {
                opacity: value,
            },
        })
    }, [])
    const errorRef = useRef()
    const setErrorTextString = useCallback((value) => {
        errorRef.current.setNativeProps({ text: value.toString() })
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ScreenWrapper>
                <CustomHeaderBasic
                    // iconName="chevron-back-outline"
                    goBack={() => {
                        props.navigation.goBack()
                    }}
                />
                <View style={styles.titleCont}>
                    <Text
                        style={styles.title}
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    >
                        Add Gallery Name
                    </Text>
                </View>
                <TouchableWithoutFeedback onPress={hideKeyboard}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.formikCont}>
                            <Formik
                                validationSchema={validationSchema}
                                initialValues={{
                                    eventName: '',
                                }}
                                initialTouched={{
                                    eventName: false,
                                }}
                                initialErrors={{
                                    eventName: undefined,
                                }}
                                onSubmit={(values) => {
                                    setHttpError(null)
                                    setIsLoading(true)
                                    setTimeout(() => {
                                        createEvent()
                                    }, 500)
                                    const noSpaceString =
                                        values.eventName.replace(/ /g, '')
                                    async function createEvent() {
                                        try {
                                            await dispatch(
                                                addGallery(
                                                    values.eventName,
                                                    'public',
                                                    'none',
                                                    ['123']
                                                )
                                            )
                                            setIsLoading(false)
                                            props.navigation.navigate(
                                                'QrCodeScreen',
                                                {
                                                    qrCodePortion:
                                                        noSpaceString,
                                                }
                                            )
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
                                                ref={inputRef}
                                                placeholder="Event Name"
                                                underlineColorAndroid="rgba(255,255,255,0)"
                                                maxFontSizeMultiplier={
                                                    colors.maxFontSizeMultiplier
                                                }
                                                onChangeText={handleChange(
                                                    'eventName'
                                                )}
                                                onBlur={handleBlur('eventName')}
                                                value={values.eventName}
                                                style={styles.input}
                                                selectionColor={
                                                    colors.lightTint
                                                }
                                                placeholderTextColor={
                                                    colors.placeHolder
                                                }
                                                keyboardType="default"
                                                autoCapitalize="words"
                                                onFocus={() => {
                                                    setUserXOpacity(1)
                                                }}
                                                maxLength={40}
                                            />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setErrorTextString('')
                                                    setFieldValue(
                                                        'eventName',
                                                        ''
                                                    )
                                                    resetForm()
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
                                        <View style={styles.errorCont}>
                                            <TextInput
                                                ref={errorRef}
                                                editable={false}
                                                style={{
                                                    ...styles.errorText,
                                                    opacity:
                                                        (errors.eventName &&
                                                            touched.eventName) ||
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
                                                    : errors.eventName}
                                            </TextInput>
                                        </View>

                                        <View style={styles.bottomCont}>
                                            <Button
                                                text="Create Gallery"
                                                style={styles.button}
                                                onPress={() => {
                                                    Keyboard.dismiss()
                                                    httpError
                                                        ? setHttpError(null)
                                                        : null
                                                    handleSubmit()
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScreenWrapper>
            {isLoading && (
                <View style={[StyleSheet.absoluteFill, styles.loadingView]}>
                    <ActivityIndicator color="rgba(207,207,207,0.84)" />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: height,
        width: '100%',
    },
    xCont: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleCont: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
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
    bottomCont: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 80,
    },
    button: {
        marginTop: 40,
        width: '100%',
    },
    formikCont: {
        width: '100%',
        paddingHorizontal: '5%',
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
    errorCont: { width: '100%' },
    errorText: {
        marginTop: 10,
        color: colors.lightTint,
        fontSize: 15,
    },
    loadingView: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default CreateEventScreen
