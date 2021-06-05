import React, { useEffect } from 'react'

//redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

//redux-thunk
import ReduxThunk from 'redux-thunk'

// navigation
import AppNavigator from './src/navigation/navigation'
import { init } from './src/sql/database'

//expo status_bar
import { StatusBar } from 'expo-status-bar'

init()
    .then(() => {
        console.log('Initialized DB')
    })
    .catch((err) => {
        console.log(`Initializing DB failed. Error: ${err}`)
    })

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

export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    )
}
