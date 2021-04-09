import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

//screens
import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen'
import DashboardScreen from '../screens/DashboardScreen'
// signup screens
import AConfirmationScreen from '../screens/signupScreens/AConfirmationScreen'
import BAddYourName from '../screens/signupScreens/BAddYourName'
import CCreatePassword from '../screens/signupScreens/CCreatePassword'
import DAddYourBirthday from '../screens/signupScreens/DAddYourBirthday'
import FUserNameFork from '../screens/signupScreens/FUserNameFork'

const MainStack = createStackNavigator()
const Drawer = createDrawerNavigator()

const SignUpNavigation = () => {
    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <MainStack.Screen name="SignupScreen" component={SignupScreen} />
            <MainStack.Screen
                name="AConfirmationScreen"
                component={AConfirmationScreen}
            />
            <MainStack.Screen name="BAddYourName" component={BAddYourName} />
            <MainStack.Screen
                name="CCreatePassword"
                component={CCreatePassword}
            />
            <MainStack.Screen
                name="DAddYourBirthday"
                component={DAddYourBirthday}
            />
            <MainStack.Screen name="FUserNameFork" component={FUserNameFork} />
        </MainStack.Navigator>
    )
}

function DrawerNav() {
    return (
        <Drawer.Navigator
        // drawerStyle={{
        //     backgroundColor: '',
        //     width: 240,
        // }}
        >
            <Drawer.Screen name="DashboardScreen" component={DashboardScreen} />
        </Drawer.Navigator>
    )
}

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
                    name="SignUpNavigation"
                    component={SignUpNavigation}
                    options={{
                        headerShown: false,
                    }}
                />

                <MainStack.Screen
                    name="DrawerNav"
                    component={DrawerNav}
                    options={{
                        headerShown: false,
                    }}
                />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator
