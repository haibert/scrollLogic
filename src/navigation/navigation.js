import React, { useEffect, useCallback } from 'react'
import { Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { enableScreens } from 'react-native-screens'

//enableScreens
enableScreens()

//shared element
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'

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
import GalleryView from '../screens/GalleryView'
import GalleryDetailScreen from '../screens/GalleryDetailScreen'
import ButtonScreen from '../components/CameraButton'

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

//redux
import {
    savePermissionsStatus,
    loadPermissions,
} from '../store/permissions/actions'
import { useDispatch } from 'react-redux'

//expo camera
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'

const MainStack = createStackNavigator()
const Drawer = createDrawerNavigator()

const SignUpNavigation = () => {
    return (
        <MainStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            detachInactiveScreens={true}
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

const DashStackShared = createSharedElementStackNavigator()
const DashModalStack = () => {
    return (
        <DashStackShared.Navigator
            mode="modal"
            initialRouteName="DashboardScreen"
            screenOptions={{
                gestureResponseDistance: {
                    vertical: 1000,
                },
                gestureDirection: 'vertical',
            }}
            detachInactiveScreens={true}
        >
            <DashStackShared.Screen
                name="DashboardScreen"
                component={DashboardScreen}
                options={{
                    headerShown: false,
                }}
            />

            <DashStackShared.Screen
                name="GalleryView"
                component={GalleryView}
                options={() => ({
                    headerShown: false,
                    useNativeDriver: true,
                    gestureEnabled: true,
                    cardStyleInterpolator: ({ current: { progress } }) => {
                        return {
                            cardStyle: {
                                opacity: progress,
                            },
                        }
                    },
                    cardStyle: {
                        backgroundColor: 'transparent',
                    },
                })}
                sharedElementsConfig={(route) => {
                    const { image } = route.params
                    return [
                        {
                            id: image.id,
                            animation:
                                Platform.OS === 'android' ? 'fade-out' : null,
                            // resize: 'none',
                            // align: 'left-top',
                        },
                    ]
                }}
            />
            <DashStackShared.Screen
                name="GalleryDetailScreen"
                component={GalleryDetailScreen}
                options={{
                    headerShown: false,
                }}
            />
        </DashStackShared.Navigator>
    )
}

const MainInnerNavigation = () => {
    return (
        <MainStack.Navigator>
            {/* 
            this used to be the dash screen before shared elements 
            was implemented.
            <MainStack.Screen
                name="DashboardScreen"
                component={DashboardScreen}
                options={{
                    headerShown: false,
                }}
            /> */}
            <MainStack.Screen
                name="DashModalStack"
                component={DashModalStack}
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
                activeTintColor: colors.textColor,
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

const AppNavigator = () => {
    const dispatch = useDispatch()
    const checkPermission = useCallback(async () => {
        const { status } = await Camera.getPermissionsAsync()
        const audioStatus = await Audio.getPermissionsAsync()

        if (status && audioStatus.status === 'granted') {
            dispatch(loadPermissions('granted'))
        } else if (status === 'undetermined') {
            dispatch(loadPermissions('undetermined'))
        } else if (status === 'denied') {
            dispatch(loadPermissions('denied'))
        }
    }, [])
    useEffect(() => {
        checkPermission()
    }, [dispatch])

    return (
        <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                    }}
                    detachInactiveScreens={true}
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

                <MainStack.Screen
                    name="ButtonScreen"
                    component={ButtonScreen}
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
