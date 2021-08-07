import React, { useState, useCallback, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    Platform,
    Dimensions,
} from 'react-native'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'

//colors
import colors from '../../constants/colors'

//custom button
import Button from '../../components/Button'
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'

//picker
import DateTimePicker from '@react-native-community/datetimepicker'
import DatePicker from 'react-native-date-picker'

//redux
import { addBirthday } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//moment
import moment from 'moment'

//dimensions
const { width, height } = Dimensions.get('window')

const DAddYourBirthday = (props) => {
    //dispatch
    const dispatch = useDispatch()

    const [dateError, setDateError] = useState(' ')

    const [date, setDate] = useState(new Date())

    //formatted date
    const formattedDate = useMemo(
        () =>
            date.toLocaleDateString('en-EN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        [date]
    )

    const onDateChange = useCallback(
        (selectedDate) => {
            var todayDate = new Date()

            if (todayDate < selectedDate) {
                setDate(todayDate)
                setDateError('Please select a valid date.')
                return
            }

            setDate(selectedDate)
            setDateError(null)
        },
        [date]
    )

    console.log('rerender')

    const nextPressedHandler = useCallback(() => {
        const momentDate = moment(date).format('YYYY-MM-DD')
        dispatch(addBirthday(momentDate))
        props.navigation.navigate('FUserName')
    }, [date])

    return (
        <ScreenWrapper paddingBottom>
            <HeaderBasic
                goBack={() => {
                    props.navigation.goBack()
                }}
                iconName="chevron-back-outline"
            />
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 0,
                }}
            >
                <View>
                    <View style={styles.titleCont}>
                        <Text
                            style={styles.title}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            Add Your Birthday
                        </Text>
                        <Text
                            style={styles.underTitle}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            This won't be part of your public profile.
                        </Text>
                    </View>
                </View>
                <View style={styles.midCont}>
                    <View>
                        <View style={styles.textInputCont}>
                            <Text
                                style={styles.input}
                                selectionColor={colors.lightTint}
                                underlineColorAndroid="rgba(255,255,255,0)"
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                            >
                                {formattedDate}
                            </Text>
                        </View>
                        <Text style={styles.errorText}>{dateError}</Text>
                    </View>

                    <View>
                        <Button
                            style={styles.button}
                            onPress={nextPressedHandler}
                            text="Next"
                        />
                        <DatePicker
                            date={date}
                            onDateChange={(date) => {
                                onDateChange(date)
                            }}
                            mode="date"
                            fadeToColor={'none'}
                            style={styles.datePicker}
                        />
                    </View>
                </View>
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
    midCont: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    datePicker: {
        width: width,
        height: 200,
    },
    textInputCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.lightTint,
        width: '96%',
    },
    errorText: {
        marginHorizontal: 5,
        marginTop: 10,
        color: colors.lightTint,
        fontSize: 15,
    },
    input: {
        marginTop: 30,
        width: '92%',
        height: 50,
        borderRadius: 5,
        padding: 10,
        color: colors.textColor,
        fontSize: 17,
    },
    button: {
        marginBottom: Platform.OS === 'android' ? 30 : 10,
        marginHorizontal: 15,
    },
})

export default DAddYourBirthday
