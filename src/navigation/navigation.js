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
import OtherProfilePhotoScreen from '../screens/OtherProfilePhotoScreen'
import OtherGalleryView from '../screens/OtherGalleryView'
import FollowersScreen from '../screens/FollowersScreen'
import CommentsScreen from '../screens/CommentsScreen'
import DesignTest from '../screens/DesignTest'

// Profile / edit profile
import ProfileScreen from '../screens/ProfileScreen'
import PhotoEditScreen from '../screens/profileScreen/PhotoEditScreen'
import ProfileEditScreen from '../screens/profileScreen/ProfileEditScreen'
import EditNameScreen from '../screens/profileScreen/EditNameScreen'
import EditBirthdayScreen from '../screens/profileScreen/EditBirthdayScreen'
import EditPhoneScreen from '../screens/profileScreen/EditPhoneScreen'
import EditUsernameScreen from '../screens/profileScreen/EditUsernameScreen'

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

//----------------------------------------------------------------CUSTOM DRAWER BEHAVIORS----------------------------------------------------------------
function getDrawerState(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'DashboardScreen'
    console.log(routeName)

    switch (routeName) {
        case 'GalleryView':
            return false
        case 'GalleryDetailScreen':
            return false
        case 'OtherProfileScreen':
            return false
        case 'CameraScreen':
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
        mass: Platform.OS === 'android' ? 3 : 1.9,
        overshootClamping: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
    },
}
//----------------------------------------------------------------TRANSITION SPEC----------------------------------------------------------------

//----------------------------------------------------------------CHANGING NAV OPTIONS----------------------------------------------------------------
const cardStyleInterpolatorFunc = ({ current: { progress } }) => {
    return {
        cardStyle: {
            opacity: progress,
        },
    }
}

const gestureResponseVertical = {
    vertical: 1000,
}

const gestureResponseHorizontal = {
    horizontal: Platform.OS === 'android' ? 50 : 1000,
}

const gestureResponseDynamic = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route)

    switch (routeName) {
        case 'CameraScreen':
            return { horizontal: 1000 }
    }
}

const gestureDirectionVertical = 'vertical'
const gestureDirectionHorizontal = 'horizontal'
//----------------------------------------------------------------CHANGING NAV OPTIONS----------------------------------------------------------------

//----------------------------------------------------------------NULL ANIMATION CONFIG----------------------------------------------------------------
const nullAnimationConfig = (route) => {
    return [
        {
            id: null,
        },
    ]
}

//----------------------------------------------------------------NULL ANIMATION CONFIG----------------------------------------------------------------

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
                    animationEnabled: false,
                }}
            />
            <DashStackShared.Screen
                name="GalleryView"
                component={GalleryView}
                options={() => ({
                    headerShown: false,
                    gestureEnabled: false,
                    cardStyle: {
                        backgroundColor: 'transparent',
                    },
                    gestureResponseDistance: gestureResponseVertical,
                    gestureDirection: gestureDirectionVertical,
                    cardStyleInterpolator: cardStyleInterpolatorFunc,
                })}
                sharedElementsConfig={(route) => {
                    const { galleryID, galName } = route.params
                    return [
                        {
                            id: [galleryID],
                            animation:
                                Platform.OS === 'android' ? 'fade-out' : 'move',
                            resize: 'auto',
                            align: 'auto',
                        },
                        {
                            id: [galleryID + galName],
                            animation: 'fade',
                            resize: 'clip',
                            align: 'auto',
                        },
                    ]
                }}
            />
            <DashStackShared.Screen
                name="GalleryDetailScreen"
                component={GalleryDetailScreen}
                options={() => ({
                    headerShown: false,
                    cardStyle: {
                        backgroundColor: 'transparent',
                    },
                    gestureResponseDistance: gestureResponseVertical,
                    gestureDirection: gestureDirectionVertical,
                })}
                sharedElementsConfig={(route) => {
                    const { picID } = route.params
                    return [
                        {
                            id: Platform.OS === 'android' ? picID : picID,
                            animation:
                                Platform.OS === 'android' ? 'fade-out' : 'move',
                            resize: 'auto',
                        },
                    ]
                }}
            />
            <DashStackShared.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={() => ({
                    headerShown: false,
                    animationEnabled: false,
                    cardStyle: {
                        backgroundColor: 'transparent',
                    },
                    cardStyleInterpolator: cardStyleInterpolatorFunc,
                    gestureResponseDistance: gestureResponseVertical,
                    gestureDirection: gestureDirectionVertical,
                    // ...TransitionPresets.SlideFromRightIOS,
                })}
                // sharedElementsConfig={(route) => {
                //     return [
                //         {
                //             id: '1',
                //             animation:
                //                 Platform.OS === 'android' ? 'fade-out' : null,
                //             resize: 'auto',
                //         },
                //     ]
                // }}
            />
            <DashStackShared.Screen
                name="ProfileEditScreen"
                component={ProfileEditScreen}
                options={{
                    headerShown: false,
                    useNativeDriver: true,
                    gestureResponseDistance: gestureResponseVertical,
                    gestureDirection: gestureDirectionVertical,
                }}
                sharedElementsConfig={(route) => {
                    const routeName = route.name
                    console.log(
                        '🚀 ~ file: navigation.js ~ line 280 ~ DashModalStack ~ routeName',
                        routeName
                    )
                    return [
                        {
                            id: routeName === 'EditNameScreen' ? null : '1',
                            animation:
                                Platform.OS === 'android' ? 'fade-out' : null,
                            resize: 'auto',
                        },
                    ]
                }}
            />
            <DashStackShared.Screen
                name="PhotoEditScreen"
                component={PhotoEditScreen}
                options={{
                    headerShown: false,
                    useNativeDriver: true,
                    gestureEnabled: false,
                    cardStyle: {
                        backgroundColor: 'transparent',
                    },
                    gestureResponseDistance: gestureResponseVertical,
                    gestureDirection: gestureDirectionVertical,
                    cardStyleInterpolator: cardStyleInterpolatorFunc,
                }}
                sharedElementsConfig={(route) => {
                    return [
                        {
                            id: '1',
                            animation:
                                Platform.OS === 'android' ? 'fade-out' : null,
                            resize: 'auto',
                        },
                    ]
                }}
            />

            <DashStackShared.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{
                    headerShown: false,
                    animationEnabled: false,
                    // ...TransitionPresets.SlideFromRightIOS,
                }}
            />
            <DashStackShared.Screen
                name="OtherProfileScreen"
                component={OtherProfileScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: gestureResponseHorizontal,
                    gestureDirection: gestureDirectionHorizontal,
                }}
            />
            <DashStackShared.Screen
                name="OtherProfilePhotoScreen"
                component={OtherProfilePhotoScreen}
                options={{
                    headerShown: false,
                    useNativeDriver: true,
                    gestureEnabled: false,
                    cardStyle: {
                        backgroundColor: 'transparent',
                    },
                    gestureResponseDistance: gestureResponseVertical,
                    gestureDirection: gestureDirectionVertical,
                    cardStyleInterpolator: cardStyleInterpolatorFunc,
                }}
                sharedElementsConfig={(route) => {
                    return [
                        {
                            id: '2',
                            animation:
                                Platform.OS === 'android' ? 'fade-out' : 'move',
                            resize: 'auto',
                        },
                    ]
                }}
            />
            <DashStackShared.Screen
                name="OtherGalleryView"
                component={OtherGalleryView}
                options={() => ({
                    headerShown: false,
                    useNativeDriver: true,
                    gestureEnabled: false,
                    cardStyle: {
                        backgroundColor: 'transparent',
                    },
                    gestureResponseDistance: gestureResponseVertical,
                    gestureDirection: gestureDirectionVertical,
                    cardStyleInterpolator: cardStyleInterpolatorFunc,
                })}
                sharedElementsConfig={(route) => {
                    const { galleryID, galName } = route.params
                    return [
                        {
                            id: [galleryID],
                            animation:
                                Platform.OS === 'android' ? 'fade-out' : 'move',
                            resize: 'auto',
                            align: 'auto',
                        },
                        {
                            id: [galleryID + galName],
                            animation: 'fade',
                            resize: 'clip',
                            align: 'auto',
                        },
                    ]
                }}
            />
            {/* ALL HORIZONTAL SCREENS BELLOW */}
            <DashStackShared.Screen
                name="CreateEventScreen"
                component={CreateEventScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: gestureResponseHorizontal,
                    gestureDirection: gestureDirectionHorizontal,
                }}
            />
            <DashStackShared.Screen
                name="QrCodeScreen"
                component={QrCodeScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: gestureResponseHorizontal,
                    gestureDirection: gestureDirectionHorizontal,
                }}
            />
            <DashStackShared.Screen
                name="JoinEventScreen"
                component={JoinEventScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: gestureResponseHorizontal,
                    gestureDirection: gestureDirectionHorizontal,
                }}
            />
            <DashStackShared.Screen
                name="CameraScreen"
                component={CameraScreen}
                options={({ route }) => ({
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: { horizontal: 1000 },
                    gestureDirection: gestureDirectionHorizontal,
                })}
            />
            <DashStackShared.Screen
                name="FollowersScreen"
                component={FollowersScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: { horizontal: 1000 },
                    gestureDirection: gestureDirectionHorizontal,
                }}
            />
            <DashStackShared.Screen
                name="CommentsScreen"
                component={CommentsScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: gestureResponseHorizontal,
                    gestureDirection: gestureDirectionHorizontal,
                }}
            />
            {/* ALL EDIT SCREENS BELLOW */}
            <DashStackShared.Screen
                name="EditNameScreen"
                component={EditNameScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: gestureResponseHorizontal,
                    gestureDirection: gestureDirectionHorizontal,
                }}
                sharedElementsConfig={nullAnimationConfig}
            />
            <DashStackShared.Screen
                name="EditBirthdayScreen"
                component={EditBirthdayScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: { horizontal: 1000 },
                    gestureDirection: gestureDirectionHorizontal,
                }}
                sharedElementsConfig={nullAnimationConfig}
            />

            <DashStackShared.Screen
                name="EditPhoneScreen"
                component={EditPhoneScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: gestureResponseHorizontal,
                    gestureDirection: gestureDirectionHorizontal,
                }}
                sharedElementsConfig={nullAnimationConfig}
            />
            <DashStackShared.Screen
                name="EditUsernameScreen"
                component={EditUsernameScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    gestureResponseDistance: gestureResponseHorizontal,
                    gestureDirection: gestureDirectionHorizontal,
                }}
                sharedElementsConfig={nullAnimationConfig}
            />
        </DashStackShared.Navigator>
    )
}

const Drawer = createDrawerNavigator()
function DrawerNav({ navigation, route }) {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            drawerStyle={{
                width: '60%',
            }}
            // initialRouteName="DashboardScreen"
            drawerContentOptions={{
                activeTintColor: colors.textColor,
                activeBackgroundColor: colors.buttonPinkTransparent,
            }}
            detachInactiveScreens={true}
            screenOptions={{
                transitionSpec: {
                    open: iosTransitionSpec,
                    close: iosTransitionSpec,
                },
            }}
        >
            <Drawer.Screen
                name="DashModalStack"
                component={DashModalStack}
                options={({ route }) => ({
                    drawerLabel: 'Home',
                    drawerIcon: (config) => (
                        <Ionicons
                            name="home-outline"
                            color={config.color}
                            size={config.size}
                        />
                    ),
                    // unmountOnBlur: true
                    /*Whether this screen should be unmounted when navigating away from it.
                    Unmounting a screen resets any local state in the screen as well as state
                    of nested navigators in the screen. Defaults to false.*/
                    swipeEnabled: getDrawerState(route),
                })}
            />
            <Drawer.Screen
                name="DesignTest"
                component={DesignTest}
                options={({ route }) => ({
                    drawerLabel: 'Design',
                    drawerIcon: (config) => (
                        <Ionicons
                            name="home-outline"
                            color={config.color}
                            size={config.size}
                        />
                    ),
                    // unmountOnBlur: true
                    /*Whether this screen should be unmounted when navigating away from it.
                    Unmounting a screen resets any local state in the screen as well as state
                    of nested navigators in the screen. Defaults to false.*/
                    swipeEnabled: getDrawerState(route),
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
                        animationEnabled: false,
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
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator
