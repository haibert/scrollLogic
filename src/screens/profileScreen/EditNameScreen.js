import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Pressable,
    Alert,
    Linking,
    TouchableOpacity,
} from 'react-native'

//custom components
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'
import CustomInput from '../../components/CustomInput'
import Counter from '../../components/Counter'
import Button from '../../components/Button'

//colors
import colors from '../../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//dimensions
const { width, height } = Dimensions.get('window')

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//redux
import { editProfile } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//formik
import { Formik } from 'formik'
import * as yup from 'yup'

const EditNameScreen = ({ route, ...props }) => {
    const { namNavPassed } = route.params

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    // validation schema
    const validationSchema = yup.object().shape({
        fullName: yup
            .string()
            .matches(
                /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/,
                'Please enter your full name.'
            )
            .max(30)
            .required('Your full name is required.'),
    })

    const [showErrors, setShowErrors] = useState(false)

    //----------------------------------------------------------------X PRESSED----------------------------------------------------------------
    const xPressed = useCallback((resetForm) => {
        resetForm()
    }, [])

    //----------------------------------------------------------------X PRESSED----------------------------------------------------------------

    return (
        <ScreenWrapper style={{ paddingBottom: insets.bottom }}>
            <HeaderBasic
                iconName="chevron-back-outline"
                goBack={() => {
                    props.navigation.goBack()
                }}
                header="Name"
                headerColor={{ color: colors.darkestColorP1 }}
            />
            <View>
                <Formik
                    initialValues={{ fullName: namNavPassed }}
                    onSubmit={async (values) => {
                        const enteredName = values.fullName.split(' ')
                        const firstName = enteredName[0].trim()
                        const lastName =
                            enteredName[enteredName.length - 1].trim()
                        await dispatch(
                            editProfile(firstName, lastName, null, null, null)
                        )
                        props.navigation.goBack()
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
                            <CustomInput
                                viewStyle={styles.inputView}
                                onChangeText={handleChange('fullName')}
                                onBlur={handleBlur('fullName')}
                                value={values.fullName}
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor={'rgba(124,124,124,1)'}
                                selectionColor={'rgba(124,124,124,1)'}
                                underlineColorAndroid="rgba(255,255,255,0)"
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                                keyboardType="default"
                                autoFocus
                                autoCapitalize="words"
                                maxLength={30}
                                onXPressed={() => {
                                    xPressed(resetForm)
                                }}
                            />

                            <Counter
                                viewStyle={styles.counterStyle}
                                count={
                                    values.fullName ? values.fullName.length : 0
                                }
                                max={30}
                            />

                            <Text style={styles.errorText}>
                                {showErrors ? errors.fullName : ' '}
                            </Text>

                            <Button
                                style={styles.button}
                                onPress={() => {
                                    setShowErrors(true)
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

export default EditNameScreen
