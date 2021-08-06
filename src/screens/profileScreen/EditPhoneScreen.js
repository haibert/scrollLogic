import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

//custom components
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'
import CustomInput from '../../components/CustomInput'
import Button from '../../components/Button'

//colors
import colors from '../../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//redux
import { editProfile } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//formik
import { Formik } from 'formik'
import * as yup from 'yup'

const EditPhoneScreen = ({ route, ...props }) => {
    const { phoneNavPassed } = route.params
    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    // validation schema
    const validationSchemaPhone = yup.string().phone('US', true).required()

    const [showErrors, setShowErrors] = useState(false)
    const [phoneError, setPhoneError] = useState(' ')

    //----------------------------------------------------------------X PRESSED----------------------------------------------------------------
    const xPressed = useCallback((setFieldValue) => {
        setFieldValue('phone', '')
    }, [])
    //----------------------------------------------------------------X PRESSED----------------------------------------------------------------

    return (
        <ScreenWrapper style={{ paddingBottom: insets.bottom }}>
            <HeaderBasic
                iconName="chevron-down-outline"
                goBack={() => {
                    props.navigation.goBack()
                }}
                header="Phone Number"
                headerColor={{ color: colors.darkestColorP1 }}
            />
            <View>
                <Formik
                    initialValues={{ phone: phoneNavPassed }}
                    onSubmit={async (values) => {
                        if (!validationSchemaPhone.isValidSync(values.phone))
                            return
                        await dispatch(
                            editProfile(
                                null,
                                null,
                                null,
                                values.phone.replace(/[^0-9]/g, ''),
                                null
                            )
                        )
                        props.navigation.goBack()
                    }}
                    validationSchema={validationSchemaPhone}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        setFieldValue,
                    }) => (
                        <View>
                            <CustomInput
                                viewStyle={styles.inputView}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone.replace(/[^0-9]/g, '')}
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor={'rgba(124,124,124,1)'}
                                selectionColor={'rgba(124,124,124,1)'}
                                underlineColorAndroid="rgba(255,255,255,0)"
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                                keyboardType="number-pad"
                                autoFocus
                                maxLength={30}
                                onXPressed={xPressed.bind(this, setFieldValue)}
                            />

                            {showErrors ? (
                                <Text style={styles.errorText}>
                                    {!validationSchemaPhone.isValidSync(
                                        values.phone
                                    )
                                        ? phoneError
                                        : ' '}
                                </Text>
                            ) : (
                                <Text style={styles.errorText}> </Text>
                            )}

                            <Button
                                style={styles.button}
                                onPress={() => {
                                    setShowErrors(true)
                                    !validationSchemaPhone.isValidSync(
                                        values.phone
                                    )
                                        ? setPhoneError(
                                              'Please provide a valid phone number.'
                                          )
                                        : setPhoneError('')
                                    handleSubmit()
                                }}
                                text="Save"
                            />
                        </View>
                    )}
                </Formik>
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    inputView: {
        paddingHorizontal: 15,
    },
    counterStyle: {
        left: 15,
        marginTop: 10,
    },
    errorText: {
        marginHorizontal: 15,
        marginTop: 10,
        color: 'red',
        fontSize: 15,
        height: 20,
    },
    button: {
        marginTop: 30,
        marginHorizontal: 15,
    },
})

export default EditPhoneScreen
