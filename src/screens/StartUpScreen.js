import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

//redux
import { login, setUserID } from '../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//Custom components
import ScreenWrapper from '../components/ScreenWrapper'

//async AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

//status bar
import { StatusBar } from 'expo-status-bar'

//colors
import colors from '../constants/colors'

const StartUpScreen = (props) => {
    // useEffect(() => {
    //     const tryLogin = async () => {
    //         const userData = await AsyncStorage.getItem('userData')
    //         if (!userData) {
    //             props.navigation.navigate('Auth')
    //             return
    //         }
    //         const transformedData = JSON.parse(userData)
    //         const { token, userId, expiryDate } = transformedData
    //         const expirationDate = new Date(expiryDate)

    //         if (expirationDate <= new Date() || !token || !userId) {
    //             props.navigation.navigate('Auth')
    //             return
    //         }

    //         const expirationTime =
    //             expirationDate.getTime() - new Date().getTime()

    //         props.navigation.navigate('Shop')
    //         dispatch(authActions.authenticate(userId, token, expirationTime))
    //     }

    //     tryLogin()
    // }, [dispatch])

    //----------------------------------------------------------------AUTOMATIC LOGIN----------------------------------------------------------------
    const dispatch = useDispatch()
    useEffect(() => {
        const checkUserID = async () => {
            const userLoggedIn = await AsyncStorage.getItem('userID')
            console.log(
                '🚀 ~ file: StartUpScreen.js ~ line 52 ~ checkUserID ~ userLoggedIn',
                userLoggedIn
            )
            if (userLoggedIn) {
                await dispatch(setUserID(userLoggedIn))
                props.navigation.navigate('DrawerNav')
            } else {
                props.navigation.navigate('LoginScreen')
            }
        }

        checkUserID()
    }, [])
    //----------------------------------------------------------------AUTOMATIC LOGIN----------------------------------------------------------------

    return (
        <ScreenWrapper style={styles.screen}>
            <StatusBar
                style="light"
                translucent
                backgroundColor="rgba(255,255,255,0)"
                animated
            />
            <ActivityIndicator size="large" color={colors.mediumTint} />
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default StartUpScreen
