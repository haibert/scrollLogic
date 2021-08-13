import React, { useEffect, useRef, useCallback } from 'react'
import 'expo-dev-client'
//redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import AppLoading from 'expo-app-loading'
import {
    useFonts,
    Poppins_400Regular,
    Poppins_600SemiBold,
} from '@expo-google-fonts/poppins'
//redux-thunk
import ReduxThunk from 'redux-thunk'

// navigation
import AppNavigator from './src/navigation/navigation'

//expo notifications
import * as Notifications from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'
import Constants from 'expo-constants'

//navigation functions
import { CommonActions, useNavigation } from '@react-navigation/native'

// init()
//     .then(() => {
//         console.log('Initialized DB')
//     })
//     .catch((err) => {
//         console.log(`Initializing DB failed. Error: ${err}`)
//     })

import signupReducer from './src/store/signup-auth/reducer'
import cameraReducer from './src/store/camera/reducer'
import permissionsReducer from './src/store/permissions/reducer'
import galleryReducer from './src/store/event/reducer'

const rootReducer = combineReducers({
    signupReducer: signupReducer,
    cameraReducer: cameraReducer,
    permissionsReducer: permissionsReducer,
    galleryReducer: galleryReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

//-------------------------------------------------------------------NOTIFICATIONS LOGIC-------------------------------------------------------------------
const hasNotificationPermission = async () => {
    if (Constants.isDevice) {
        try {
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

            if (finalStatus === 'granted') return true

            if (finalStatus !== 'granted') {
                // Alert.alert(
                //     'Warning',
                //     'You will not receive notifications if you do not enable push notifications. If you would like to stay up to date with your account activity, please enable push notifications for EventShare in your settings.',
                //     [
                //         { text: 'Cancel' },
                //         {
                //             text: 'Enable Notifications',
                //             onPress: () =>
                //                 Platform.OS === 'ios'
                //                     ? Linking.openURL('app-settings:')
                //                     : Linking.openSettings(),
                //         },
                //     ]
                // )
                return false
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'Something went wrong while check your notification permissions, please try again later.'
            )
            return false
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            })
        }
    } else {
        alert('Must use physical device for Push Notifications')
    }
}

const getPushToken = async () => {
    const token = await Notifications.getExpoPushTokenAsync({
        experienceId: '@haibert/EventShare',
    })
    return token
}

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'
TaskManager.defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    ({ data, error, executionInfo }) => {
        console.log('Received a notification in the background!')
        console.log(data)
        // Do something with the notification data
    }
)
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)

const doNotificationLogic = async () => {
    const hasPermission = await hasNotificationPermission()
    if (hasPermission) {
        const token = await getPushToken()
        console.log(
            '🚀 ~ file: App.js ~ line 122 ~ doNotificationLogic ~ token',
            token
        )
        // dispatch(updatePushToken(token))
        return
    }
}

//-------------------------------------------------------------------NOTIFICATIONS LOGIC-------------------------------------------------------------------

const App = () => {
    //----------------------------------------------------------------GET NOTIFICATION AND UPLOAD------------------------------------------------------------
    const notificationListener = useRef()
    const responseListener = useRef()

    useEffect(() => {
        doNotificationLogic()
    }, [])

    // useEffect(() => {
    //     const getRegisteredTasks = async () => {
    //         const tasks = await TaskManager.getRegisteredTasksAsync()
    //         console.log(tasks)
    //     }
    //     getRegisteredTasks()
    // }, [])

    const navigateToNotifications = () => {
        Notifications.setBadgeCountAsync(0)
        props.navigation.dispatch(
            CommonActions.navigate({
                name: 'ProfileScreen',
            })
        )
        props.navigation.dispatch(
            CommonActions.navigate({
                name: 'NotificationsScreen',
            })
        )
    }

    useEffect(() => {
        notificationListener.current =
            Notifications.addNotificationReceivedListener(
                async (notification) => {
                    // notification received in the foreground
                    const currentBadgeCount =
                        await Notifications.getBadgeCountAsync()
                    Notifications.setBadgeCountAsync(currentBadgeCount + 1)
                }
            )

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    // console.log(response)
                    navigateToNotifications()
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
    //----------------------------------------------------------------GET NOTIFICATION AND UPLOAD------------------------------------------------------------
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
    })

    if (!fontsLoaded) {
        return <AppLoading />
    }
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    )
}

export default App
