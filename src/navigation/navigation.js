import React, { useEffect, useCallback, useRef } from 'react'
import { Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { enableScreens } from 'react-native-screens'

//MARK ROUSAVY
import { TransitionPresets } from '@react-navigation/stack'

//custom screen options
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
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
import StartUpScreen from '../screens/StartUpScreen'
import SearchScreen from '../screens/SearchScreen'
import OtherProfileScreen from '../screens/OtherProfileScreen'

// Profile / edit profile
import ProfileScreen from '../screens/ProfileScreen'
import ProfileScreenTwo from '../screens/ProfileScreenTwo'
import PhotoEditScreen from '../screens/profileScreen/PhotoEditScreen'
import ProfileEditScreen from '../screens/profileScreen/ProfileEditScreen'

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

//async AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'
const MainStack = createStackNavigator()
const Drawer = createDrawerNavigator()

//----------------------------------------------------------------CUSTOM DRAWER BEHAVIORS----------------------------------------------------------------
function getDrawerState(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'DashboardScreen'
    console.log(routeName)

    switch (routeName) {
        case 'GalleryView':
            return false
        case 'GalleryDetailScreen':
            return false
    }
}
//----------------------------------------------------------------CUSTOM DRAWER BEHAVIORS----------------------------------------------------------------

//----------------------------------------------------------------TRANSITION SPEC----------------------------------------------------------------
const iosTransitionSpec = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 1000,
        mass: 1.5,
        overshootClamping: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
    },
}
//----------------------------------------------------------------TRANSITION SPEC----------------------------------------------------------------

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
                useNativeDriver: true,
                gestureResponseDistance: {
                    vertical: 1000,
                },
                gestureDirection: 'vertical',
                ...TransitionPresets.ModalSlideFromBottomIOS,
                transitionSpec: {
                    open: iosTransitionSpec,
                    close: iosTransitionSpec,
                },
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
                    gestureEnabled: false,
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
                    const { gallery } = route.params

                    return [
                        {
                            id: gallery?.galleryID,
                            animation: 'move',
                            resize: 'auto',
                            // align: 'left-top',
                        },
                        // {
                        //     id: picID,
                        //     animation:
                        //         Platform.OS === 'android' ? 'fade-out' : 'move',
                        //     resize: 'auto',
                        //     // align: 'left-top',
                        // },
                    ]
                }}
            />
            <DashStackShared.Screen
                name="GalleryDetailScreen"
                component={GalleryDetailScreen}
                options={() => ({
                    headerShown: false,
                    gestureEnabled: true,
                    // cardStyleInterpolator: ({ current: { progress } }) => {
                    //     return {
                    //         cardStyle: {
                    //             opacity: progress,
                    //         },
                    //     }
                    // },
                    cardStyle: {
                        backgroundColor: 'transparent',
                    },
                })}
                sharedElementsConfig={(route) => {
                    const { picID } = route.params
                    return [
                        {
                            id: Platform.OS === 'android' ? picID : picID,
                            animation: 'move',
                            resize: 'stretch',
                        },
                    ]
                }}
            />
        </DashStackShared.Navigator>
    )
}

const ProfileNav = createSharedElementStackNavigator()

const ProfileNavigator = () => {
    return (
        <ProfileNav.Navigator
            mode="modal"
            initialRouteName="ProfileScreenTwo"
            screenOptions={{
                gestureResponseDistance: {
                    vertical: 1000,
                },
                gestureDirection: 'vertical',
                useNativeDriver: true,
                ...TransitionPresets.ModalSlideFromBottomIOS,
                transitionSpec: {
                    open: iosTransitionSpec,
                    close: iosTransitionSpec,
                },
            }}
            detachInactiveScreens={true}
        >
            <ProfileNav.Screen
                name="ProfileScreenTwo"
                component={ProfileScreenTwo}
                options={() => ({
                    headerShown: false,
                    gestureEnabled: true,

                    cardStyle: {
                        backgroundColor: 'transparent',
                    },
                    cardStyleInterpolator: ({ current: { progress } }) => {
                        return {
                            cardStyle: {
                                opacity: progress,
                            },
                        }
                    },
                })}
                sharedElementsConfig={(route) => {
                    return [
                        {
                            id: 1,
                            animation:
                                Platform.OS === 'android' ? 'fade-out' : null,
                            resize: 'auto',
                        },
                    ]
                }}
            />
            <ProfileNav.Screen
                name="PhotoEditScreen"
                component={PhotoEditScreen}
                options={{
                    headerShown: false,
                    useNativeDriver: true,
                    gestureEnabled: true,
                }}
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
                })}
                sharedElementsConfig={(route) => {
                    return [
                        {
                            id: 1,
                            animation:
                                Platform.OS === 'android' ? 'fade-out' : null,
                            resize: 'auto',
                        },
                    ]
                }}
            />

            {/* <ProfileNav.Screen
                name="ProfileEditScreen"
                component={ProfileEditScreen}
                options={{
                    headerShown: false,
                }}
                sharedElementsConfig={(route) => {
                    return [{}]
                }}
            /> */}
        </ProfileNav.Navigator>
    )
}

const MainInnerNavigation = () => {
    return (
        <MainStack.Navigator
            screenOptions={{
                gestureResponseDistance: {
                    // vertical: 1000,
                    horizontal: 1000,
                },
            }}
        >
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

function DrawerNav({ navigation, route }) {
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
            detachInactiveScreens={true}
        >
            <Drawer.Screen
                name="DashboardScreen"
                component={MainInnerNavigation}
                options={({ route }) => ({
                    drawerLabel: 'Home',
                    drawerIcon: (config) => (
                        <Ionicons
                            name="home-outline"
                            color={config.color}
                            size={config.size}
                        />
                    ),
                    // swipeEnabled: getDrawerState(route),
                })}
            />
            <Drawer.Screen
                name="ProfileNavigator"
                component={ProfileNavigator}
                options={({ route }) => ({
                    drawerLabel: 'Profile',
                    drawerIcon: (config) => (
                        <Ionicons
                            name="person-outline"
                            color={config.color}
                            size={config.size}
                        />
                    ),
                })}
            />
        </Drawer.Navigator>
    )
}

const AppNavigator = () => {
    //----------------------------------------------------------------PERMISSION CHECKER----------------------------------------------------------------
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
    //----------------------------------------------------------------PERMISSION CHECKER----------------------------------------------------------------
    const navigationRef = useRef()
    const routeNameRef = useRef()
    return (
        <NavigationContainer
        // onStateChange={async () => {
        //     const previousRouteName = routeNameRef.current
        //     const currentRouteName =
        //         navigationRef.current.getCurrentRoute().name

        //     if (previousRouteName !== currentRouteName) {
        //         // The line below uses the expo-firebase-analytics tracker
        //         // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
        //         // Change this line to use another Mobile analytics SDK
        //         await Analytics.setCurrentScreen(currentRouteName)
        //     }

        //     // Save the current route name for later comparison
        //     routeNameRef.current = currentRouteName
        // }}
        >
            <MainStack.Navigator
                screenOptions={{
                    transitionSpec: {
                        open: iosTransitionSpec,
                        close: iosTransitionSpec,
                    },
                }}
            >
                <MainStack.Screen
                    name="StartUpScreen"
                    component={StartUpScreen}
                    options={{
                        headerShown: false,
                        animationEnabled: false,
                    }}
                    detachInactiveScreens={true}
                />
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
                    name="ProfileEditScreen"
                    component={ProfileEditScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <MainStack.Screen
                    name="SearchScreen"
                    component={SearchScreen}
                    options={{
                        headerShown: false,
                        // animationEnabled: false,
                    }}
                />
                <MainStack.Screen
                    name="OtherProfileScreen"
                    component={OtherProfileScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator
