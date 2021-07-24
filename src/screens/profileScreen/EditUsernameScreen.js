import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'

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

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//redux
import {
    editProfile,
    checkUserExistence,
} from '../../store/signup-auth/actions'
import { useDispatch } from 'react-redux'

const EditUsernameScreen = ({ route, ...props }) => {
    const { usernameNavPassed } = route.params

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    //----------------------------------------------------------------X PRESSED----------------------------------------------------------------
    const xPressed = useCallback((resetForm) => {
        resetForm()
    }, [])
    //----------------------------------------------------------------X PRESSED----------------------------------------------------------------
    // function that makes user username only has A-Z 9-0 and periods
    const usernameFilter = (text) => {
        const regEx = /^[a-zA-Z0-9\.]+$/
    }
    const [usernameValidError, setUsernameValidError] = useState()
    const [userTxtChange, setUserTextChange] = useState(usernameNavPassed)
    const [httpError, setHttpError] = useState()

    const userNameChangeHandler = (enteredText) => {
        setUserTextChange(enteredText.replaceAll(' ', ''))
        setHttpError('')

        const regEx = /^[a-zA-Z0-9\.]+$/

        if (enteredText.trim().length >= 4) {
            setUsernameValidError(null)
        }
        enteredText.trim().length <= 4 && enteredText.trim().length > 0
            ? setUsernameValidError('Username must be at least 4 characters.')
            : null
        if (!regEx.test(enteredText)) {
            setUsernameValidError(
                'Usernames can only contain alphanumeric characters (A–Z, 0–9) and periods (".")'
            )
        }
        enteredText.trim().length === 26
            ? setUsernameValidError(
                  'Username cannot be longer than 25 characters.'
              )
            : null
        enteredText.trim().length === 0
            ? setUsernameValidError('Please enter a valid username.')
            : null
    }

    const savePressedHandler = useCallback(async () => {
        if (usernameValidError) return
        setHttpError('')
        try {
            await dispatch(checkUserExistence(userTxtChange))
            await dispatch(editProfile(null, null, null, null, userTxtChange))
            props.navigation.goBack()
        } catch (error) {
            setHttpError(error.message)
            return
        }
    }, [userTxtChange, usernameValidError])

    return (
        <ScreenWrapper style={{ paddingBottom: insets.bottom }}>
            <HeaderBasic
                iconName="chevron-down-outline"
                goBack={() => {
                    props.navigation.goBack()
                }}
                header="Username"
                headerColor={{ color: colors.darkestColorP1 }}
            />
            <View>
                <CustomInput
                    viewStyle={styles.inputView}
                    onChangeText={(text) => userNameChangeHandler(text)}
                    value={userTxtChange}
                    // onBlur={handleBlur('username')}
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={'rgba(124,124,124,1)'}
                    selectionColor={'rgba(124,124,124,1)'}
                    underlineColorAndroid="rgba(255,255,255,0)"
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    keyboardType="default"
                    autoFocus
                    autoCapitalize="none"
                    maxLength={26}
                    onXPressed={() => {
                        setUserTextChange('')
                    }}
                />

                <Counter
                    viewStyle={styles.counterStyle}
                    count={userTxtChange ? userTxtChange.length : 0}
                    max={25}
                />

                <Text
                    style={{
                        marginHorizontal: 15,
                        flexWrap: 'wrap',
                    }}
                >
                    <Text style={styles.errorText} numberOfLines={3}>
                        {httpError ? httpError : usernameValidError}
                    </Text>
                </Text>

                <Button
                    style={styles.button}
                    onPress={savePressedHandler}
                    text="Save"
                />
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
        // flexWrap: 'wrap',
    },
    button: {
        marginTop: 30,
        marginHorizontal: 15,
    },
})

export default EditUsernameScreen
