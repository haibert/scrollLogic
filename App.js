import React from 'react'
import { enableScreens } from 'react-native-screens'

//enableScreens
enableScreens()
// navigation
import AppNavigator from './src/navigation/navigation'

export default function App() {
    return <AppNavigator />
}
