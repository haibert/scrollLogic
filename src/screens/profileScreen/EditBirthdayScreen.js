import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, Keyboard, Platform } from 'react-native'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// to calculate safe area dimensions
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets'

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

//picker
import DateTimePicker from '@react-native-community/datetimepicker'

//redux
import { addBirthday } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

function hideKeyboard() {
    Keyboard.dismiss()
}

const EditBirthdayScreen = ({ route, ...props }) => {
    const insets = useSafeAreaInsets()

    const dispatch = useDispatch()

    const [dateError, setDateError] = useState(' ')

    const [date, setDate] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [openAndroidDate, setOpenAndroidDate] = useState(false)

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        // event.type === 'set' ? setOpenAndroidDate(false) : null
        var todayDate = new Date()

        if (todayDate < selectedDate) {
            setDate(todayDate)
            setDateError('Please select a valid date.')
            return
        }

        setDate(currentDate)
        Platform.OS === 'android' ? setOpenAndroidDate(false) : null
        // setDateError(' ')
    }

    console.log('rerender')
    console.log(openAndroidDate)

    function nextPressedHandler() {
        // console.log(dateError)
        // if (dateError !== ' ') {
        //     return
        // }
        dispatch(addBirthday(date))
        props.navigation.navigate('FUserName')
    }
    //----------------------------------------------------------------ANDROID DATE COMPONENT----------------------------------------------------------------
    const AndroidDatePicker = useCallback(() => {
        return openAndroidDate ? (
            <View
                style={{
                    backgroundColor: 'rgba(0,0,0,0.54)',
                }}
            >
                <DateTimePicker
                    style={{
                        minWidth: '100%',
                        height: 200,
                    }}
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    // is24Hour={true}
                    display="spinner"
                    onChange={onDateChange}
                />
            </View>
        ) : null
    }, [setOpenAndroidDate, openAndroidDate])
    //----------------------------------------------------------------ANDROID DATE COMPONENT----------------------------------------------------------------

    //----------------------------------------------------------------IOS DATE COMPONENT----------------------------------------------------------------
    const IOSDatePicker = () => {
        return (
            <View
                style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                }}
            >
                <DateTimePicker
                    style={{
                        minWidth: '100%',
                        height: 200,
                    }}
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    // is24Hour={true}
                    display="spinner"
                    onChange={onDateChange}
                />
            </View>
        )
    }
    //----------------------------------------------------------------IOS DATE COMPONENT----------------------------------------------------------------

    const androidDatePressedHandler = useCallback(() => {
        Platform.OS === 'android' ? setOpenAndroidDate(true) : null
    }, [setOpenAndroidDate, openAndroidDate])

    return (
        <ScreenWrapper paddingBottom>
            <HeaderBasic
                goBack={() => {
                    props.navigation.goBack()
                }}
                iconName="chevron-back-outline"
            />
            <View style={styles.midCont}>
                <View>
                    <View style={styles.textInputCont}>
                        <Text
                            style={styles.input}
                            selectionColor={colors.lightTint}
                            underlineColorAndroid="rgba(255,255,255,0)"
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                            onPress={androidDatePressedHandler}
                        >
                            {`${date.toLocaleDateString('en-EN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}`}
                        </Text>
                    </View>
                    <Text style={styles.errorText}>{dateError}</Text>
                </View>

                <View style={styles.dateCont}>
                    <Button
                        style={styles.button}
                        onPress={nextPressedHandler}
                        text="Next"
                    />
                    {Platform.OS === 'android' ? (
                        <AndroidDatePicker />
                    ) : (
                        <IOSDatePicker />
                    )}
                </View>
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    midCont: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    dateCont: {
        // alignItems: 'center',
    },
    textInputCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(124,124,124,1)',
        paddingHorizontal: 15,
    },
    errorText: {
        marginHorizontal: 5,
        marginTop: 10,
        color: colors.lightTint,
        fontSize: 15,
    },
    input: {
        width: '92%',
        height: 50,
        borderRadius: 5,
        padding: 10,
        color: 'black',
        fontSize: 17,
    },
    button: {
        marginBottom: Platform.OS === 'android' ? 30 : 10,
        marginHorizontal: 15,
    },
})

export default EditBirthdayScreen
