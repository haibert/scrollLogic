import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

// signup screens
import ASignupScreen from '../screens/signupScreens/ASignupScreen'
import BConfirmationScreen from '../screens/signupScreens/BConfirmationScreen'
import CAddYourName from '../screens/signupScreens/CAddYourName'
import DCreatePassword from '../screens/signupScreens/DCreatePassword'
import EAddYourBirthday from '../screens/signupScreens/EAddYourBirthday'
import FUserName from '../screens/signupScreens/FUserName'

//screens
import LoginScreen from '../screens/LoginScreen'
import DashboardScreen from '../screens/DashboardScreen'
import CameraScreen from '../screens/CameraScreen'

//event creation
import CreateEventScreen from '../screens/eventCreation/CreateEventScreen'
import QrCodeScreen from '../screens/eventCreation/QrCodeScreen'
import JoinEventScreen from '../screens/eventCreation/JoinEventScreen'

//custom drawer content
import DrawerContent from '../screens/drawerContent/DrawerContent'

//colors
import colors from '../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

const MainStack = createStackNavigator()
const Drawer = createDrawerNavigator()

const SignUpNavigation = () => {
    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <MainStack.Screen name="ASignupScreen" component={ASignupScreen} />
            <MainStack.Screen
                name="BConfirmationScreen"
                component={BConfirmationScreen}
            />
            <MainStack.Screen name="CAddYourName" component={CAddYourName} />
            <MainStack.Screen
                name="DCreatePassword"
                component={DCreatePassword}
            />
            <MainStack.Screen
                name="EAddYourBirthday"
                component={EAddYourBirthday}
            />
            <MainStack.Screen name="FUserName" component={FUserName} />
        </MainStack.Navigator>
    )
}

const MainInnerNavigation = () => {
    return (
        <MainStack.Navigator>
            <MainStack.Screen
                name="DashboardScreen"
                component={DashboardScreen}
                options={{
                    headerShown: false,
                }}
            />
            <MainStack.Screen
                name="CreateEventScreen"
                component={CreateEventScreen}
                options={{
                    headerShown: false,
                }}
            />
            <MainStack.Screen
                name="QrCodeScreen"
                component={QrCodeScreen}
                options={{
                    headerShown: false,
                }}
            />
            <MainStack.Screen
                name="JoinEventScreen"
                component={JoinEventScreen}
                options={{
                    headerShown: false,
                }}
            />
            <MainStack.Screen
                name="CameraScreen"
                component={CameraScreen}
                options={{
                    headerShown: false,
                }}
            />
        </MainStack.Navigator>
    )
}

function DrawerNav() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            drawerStyle={{
                width: '60%',
            }}
            initialRouteName="DashboardScreen"
            drawerContentOptions={{
                activeTintColor: colors.lightTint,
                activeBackgroundColor: colors.buttonPinkTransparent,
            }}
            detachInactiveScreens
        >
            <Drawer.Screen
                name="DashboardScreen"
                component={MainInnerNavigation}
                options={{
                    drawerLabel: 'Home',
                    drawerIcon: (config) => (
                        <Ionicons
                            name="home-outline"
                            color={config.color}
                            size={config.size}
                        />
                    ),
                }}
            />
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
                        gestureEnabled: false,
                        animationEnabled: false,
                    }}
                />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator
