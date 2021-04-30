import React from 'react'
import { enableScreens } from 'react-native-screens'

//redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

//redux-thunk
import ReduxThunk from 'redux-thunk'

// navigation
import AppNavigator from './src/navigation/navigation'

//enableScreens
enableScreens()

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
