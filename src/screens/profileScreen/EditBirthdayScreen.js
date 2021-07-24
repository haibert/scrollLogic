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

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//colors
import colors from '../../constants/colors'

//custom button
import Button from '../../components/Button'
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'

//date picker
import DatePicker from 'react-native-date-picker'

//redux
import { editProfile } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//dimensions
const { width, height } = Dimensions.get('window')

//moment
import moment from 'moment'

const EditBirthdayScreen = ({ route, ...props }) => {
    //date passed from nav
    const { birthdayNavPassed } = route.params

    //dispatch
    const dispatch = useDispatch()

    //----------------------------------------------------------------DATE CHANGE LOGIC----------------------------------------------------------------
    const [dateError, setDateError] = useState(null)
    const dateNavPassedFormatted = new Date(birthdayNavPassed)
    const [date, setDate] = useState(
        Platform.OS === 'android' ? new Date() : dateNavPassedFormatted
    )

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
    //----------------------------------------------------------------DATE CHANGE LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------SAVE HANDLER----------------------------------------------------------------
    const savePressedHandler = useCallback(async () => {
        var todayDate = new Date()
        const momentDate = moment(date).format('YYYY-MM-DD')

        if (todayDate < date) {
            setDateError('Please select a valid date.')
            return
        }

        await dispatch(editProfile(null, null, momentDate, null, null))
        props.navigation.goBack()
    }, [dateError, date])
    //----------------------------------------------------------------SAVE HANDLER----------------------------------------------------------------

    return (
        <ScreenWrapper paddingBottom>
            <HeaderBasic
                goBack={() => {
                    props.navigation.goBack()
                }}
                iconName="chevron-back-outline"
                header="Birthday"
                headerColor={{ color: colors.darkestColorP1 }}
            />
            <View style={styles.midCont}>
                <View>
                    <View style={styles.textInputCont}>
                        <Text
                            style={styles.input}
                            selectionColor={colors.lightTint}
                            underlineColorAndroid="rgba(255,255,255,0)"
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            {formattedDate}
                        </Text>
                    </View>
                    <Text style={styles.errorText}>{dateError}</Text>
                </View>

                <View>
                    <Button
                        style={styles.button}
                        onPress={savePressedHandler}
                        text="Save"
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
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    midCont: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    datePicker: {
        width: width,
        height: 200,
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
