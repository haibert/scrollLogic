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

const App = () => {
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
