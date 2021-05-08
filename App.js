import React, { useEffect } from 'react'
import { enableScreens } from 'react-native-screens'

//redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

//redux-thunk
import ReduxThunk from 'redux-thunk'

// navigation
import AppNavigator from './src/navigation/navigation'
import { init } from './src/sql/database'

//enableScreens
enableScreens()

init()
    .then(() => {
        console.log('Initialized DB')
    })
    .catch((err) => {
        console.log(`Initializing DB failed. Error: ${err}`)
    })

import signupReducer from './src/store/signup/reducer'
import cameraReducer from './src/store/camera/reducer'

const rootReducer = combineReducers({
    signupReducer: signupReducer,
    cameraReducer: cameraReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    )
}
