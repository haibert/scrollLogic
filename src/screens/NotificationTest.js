import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Text, View, Button, Platform, Linking } from 'react-native'

import { CommonActions, useNavigation } from '@react-navigation/native'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
})

export default function NotificationTest() {
    const [expoPushToken, setExpoPushToken] = useState('')
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef()
    const responseListener = useRef()
    const navigation = useNavigation()

    const navigateToNotifications = useCallback(() => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    {
                        name: 'DashboardScreen',
                    },
                    {
                        name: 'ProfileScreen',
                    },
                    {
                        name: 'NotificationsScreen',
                    },
                ],
            })
        )
        navigation.navigate('NotificationsScreen', {})
    }, [])

    useEffect(() => {
        // getPermission()
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token.data)
            console.log(token.data)
        })

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification)
            })

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    // console.log(response)
                    // navigateToNotifications()
                }
            )

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            )
            Notifications.removeNotificationSubscription(
                responseListener.current
            )
        }
    }, [])

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-around',
            }}
        >
            <Text>Your expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>
                    Title: {notification && notification.request.content.title}{' '}
                </Text>
                <Text>
                    Body: {notification && notification.request.content.body}
                </Text>
                <Text>
                    Data:{' '}
                    {notification &&
                        JSON.stringify(notification.request.content.data)}
                </Text>
            </View>
            <Button
                title="Press to Send Notification"
                onPress={async () => {
                    await sendPushNotification(expoPushToken)
                }}
            />
        </View>
    )
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
    const message = {
        to: `${expoPushToken}`,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',

        data: { someData: 'goes here' },
    }

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })

    const data = await response.json()
    console.log(
        '🚀 ~ file: NotificationTest.js ~ line 111 ~ sendPushNotification ~ data',
        data
    )
}

async function registerForPushNotificationsAsync() {
    let token
    if (Constants.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowAnnouncements: true,
                },
            })
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            Alert.alert(
                'Warning',
                'You will not receive reminders if you do not enable push notifications. If you would like to receive reminders, please enable push notifications for Fin in your settings.',
                [
                    { text: 'Cancel' },
                    // If they said no initially and want to change their mind,
                    // we can automatically open our app in their settings
                    // so there's less friction in turning notifications on
                    {
                        text: 'Enable Notifications',
                        onPress: () =>
                            Platform.OS === 'ios'
                                ? Linking.openURL('app-settings:')
                                : Linking.openSettings(),
                    },
                ]
            )
            return
        }
        token = await Notifications.getExpoPushTokenAsync({
            experienceId: '@haibert/EventShare',
        })
    } else {
        alert('Must use physical device for Push Notifications')
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    return token
}

// const hasNotificationPermission = useCallback(async () => {
//     try {
//         const { status: existingStatus } =
//             await Notifications.requestPermissionsAsync()
//         let finalStatus = existingStatus

//         if (existingStatus !== 'granted') {
//             const { status } = await Notifications.requestPermissionsAsync()
//             finalStatus = status
//         }

//         if (finalStatus === 'granted') return true

//         if (finalStatus !== 'granted') {
//             Alert.alert(
//                 'Warning',
//                 'You will not receive reminders if you do not enable push notifications. If you would like to receive reminders, please enable push notifications for Fin in your settings.',
//                 [
//                     { text: 'Cancel' },
//                     {
//                         text: 'Enable Notifications',
//                         onPress: () =>
//                             Platform.OS === 'ios'
//                                 ? Linking.openURL('app-settings:')
//                                 : Linking.openSettings(),
//                     },
//                 ]
//             )
//             return false
//         }
//     } catch (error) {
//         Alert.alert(
//             'Error',
//             'Something went wrong while check your notification permissions, please try again later.'
//         )
//         return false
//     }
// }, [])

// const doNotificationLogic = useCallback(async () => {
//     const hasPermission = await hasNotificationPermission()
//     if (hasPermission) {
//         const token = await getPushToken()
//         dispatch(updatePushToken(firebaseUser, token))
//         return
//     }
// }, [])

// useEffect(() => {
//     doNotificationLogic()
// }, [])
