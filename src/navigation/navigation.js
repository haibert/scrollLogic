import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

//screens
import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen'

const MainStack = createStackNavigator()

const AppNavigator = (props) => {
    return (
        <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <MainStack.Screen
                    name="SignupScreen"
                    component={SignupScreen}
                />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator
