import React, { useEffect, useRef } from 'react'
import 'expo-dev-client'
//redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import AppLoading from 'expo-app-loading'
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter'
//redux-thunk
import ReduxThunk from 'redux-thunk'

// navigation
import AppNavigator from './src/navigation/navigation'

//expo status_bar
import { StatusBar } from 'expo-status-bar'

import * as Notifications from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'

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

// if (Platform.OS === 'android') {
//     // StatusBar.setBackgroundColor('black')
//     StatusBar.setBarStyle('light-content')
// }

const rootReducer = combineReducers({
    signupReducer: signupReducer,
    cameraReducer: cameraReducer,
    permissionsReducer: permissionsReducer,
    galleryReducer: galleryReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'

export default function App() {
    // useEffect(() => {
    //     cleanupCache({ size: 200 })
    // }, [])

    // const isHermes = () => !!global.HermesInternal
    // console.log('🚀 ~ file: App.js ~ line 28 ~ isHermes', isHermes())

    TaskManager.defineTask(
        BACKGROUND_NOTIFICATION_TASK,
        ({ data, error, executionInfo }) => {
            console.log('Received a notification in the background!')
            console.log(data)
            // Do something with the notification data
        }
    )

    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)

    let [fontsLoaded] = useFonts({
        Inter_900Black,
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
