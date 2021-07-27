import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    FlatList,
    Alert,
    Linking,
    Platform,
    BackHandler,
} from 'react-native'
import Reanimated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    interpolate,
    withSequence,
} from 'react-native-reanimated'

import { StatusBar } from 'expo-status-bar'

// //Linear Gradient
// import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

// custom components
import Button from '../components/Button'
import Thumbnail from '../components/Thumbnail'
import CustomHeaderBasic from '../components/HeaderBasic'
import ScreenWrapper from '../components/ScreenWrapper'
import BottomNavBar from '../components/BottomNavBar'
import NuemorphicNavBar from '../components/NuemorphicNavBar'
import CustomActionSheet from '../components/CustomActionSheet'

import ActionBottomSheet from '../components/ActionBottomSheet'

//customHooks
import useAppState from '../hooks/useAppState'

//useFocusEffect
import { InteractionManager } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//expo camera
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'

//redux
import {
    savePermissionsStatus,
    loadPermissions,
} from '../store/permissions/actions'
import { setGalleries, shouldRefreshSet } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

// big list
import BigList from 'react-native-big-list'

//dimensions
const { height, width } = Dimensions.get('screen')

import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'

//fake data make sure to comment out
// import { fakeArray, fakeArray2 } from '../data/images'

//-------------------------------------------------------------------NOTIFICATIONS LOGIC-------------------------------------------------------------------
// get notifications permission and send token to server
const registerForPushNotificationsAsync = async () => {
    let token
    if (Constants.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!')
            return
        }
        token = (await Notifications.getExpoPushTokenAsync()).data
        // send token to server for specific user
        console.log(token)
    } else {
        alert('Must use physical device for Push Notifications')
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    return token
}
//-------------------------------------------------------------------NOTIFICATIONS LOGIC-------------------------------------------------------------------

const DashboardScreen = (props) => {
    const insets = useSafeAreaInsets()

    const isFocused = useIsFocused()

    // sheet ref
    const bottomSheetRef = useRef()

    let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10
    const [deleteID, setDeleteID] = useState({ id: '', index: '' })

    //dispatch
    const dispatch = useDispatch()

    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)

    const [showModal, setShowModal] = useState(false)

    const greenLightOnPermissions = useSelector(
        (state) => state.permissionsReducer.permissions.camera
    )

    //----------------------------------------------------------------LOAD GALLERIES----------------------------------------------------------------
    const [loadingGalleries, setLoadingGalleries] = useState(false)
    // states
    const galleries = useSelector((state) => state.galleryReducer.galleries)

    console.log('Dash Screen Loaded')
    const shouldRefresh = useSelector(
        (state) => state.galleryReducer.shouldRefresh
    )

    const loadGalleries = useCallback(async () => {
        // setLoadingGalleries(true)
        // setError(null)
        try {
            await dispatch(setGalleries(null))
        } catch (error) {
            // setError(error.message)
        }
        // setLoadingGalleries(false)
    }, [setLoadingGalleries, dispatch])

    useEffect(() => {
        loadGalleries()
    }, [loadGalleries])

    useFocusEffect(() => {
        const refreshConditionally = async () => {
            if (shouldRefresh) {
                loadGalleries()
                await dispatch(shouldRefreshSet(false))
            }
        }
        refreshConditionally()
    })
    //----------------------------------------------------------------LOAD GALLERIES----------------------------------------------------------------

    //----------------------------------------------------------------PREVENT BACK BUTTON ANDROID----------------------------------------------------------------
    useEffect(
        () =>
            props.navigation.addListener('beforeRemove', (e) => {
                e.preventDefault()
            }),
        []
    )
    //----------------------------------------------------------------PREVENT BACK BUTTON ANDROID----------------------------------------------------------------

    const cameraPressedHandler = async () => {
        if (greenLightOnPermissions === 'granted') {
            props.navigation.navigate('CameraScreen')
        } else {
            const { status } = await Camera.getPermissionsAsync()
            const audioStatus = await Audio.getPermissionsAsync()

            // setHasCameraPermission(status === 'granted')
            if (status && audioStatus.status === 'granted') {
                dispatch(loadPermissions('granted'))
                props.navigation.navigate('CameraScreen')
            } else if (status || audioStatus.status === 'undetermined') {
                const results = await Camera.requestPermissionsAsync()
                const audioResults = await Audio.requestPermissionsAsync()
                if (results.status && audioResults.status === 'granted') {
                    props.navigation.navigate('CameraScreen')
                } else if (results.status || audioResults.status === 'denied') {
                    sendUserToSettingsHandler()
                    return
                }
            } else if (status || audioResults.status === 'denied') {
                const results2 = await Camera.requestPermissionsAsync()
                const audioResults2 = await Audio.requestPermissionsAsync()
                if (results2.status && audioResults2 === 'granted') {
                    props.navigation.navigate('CameraScreen')
                } else {
                    sendUserToSettingsHandler()
                    return
                }
            }
        }
    }

    // // handle checking permissions after app state change
    // const checkPermissionsAppState = useCallback(async () => {
    //     const { status } = await Camera.getPermissionsAsync()
    //     switch (status) {
    //         case 'granted':
    //             setHasCameraPermission(true)
    //             console.log('Camera permission has been granted.')
    //             break
    //         case 'denied':
    //             setHasCameraPermission(false)
    //             console.log(
    //                 'Camera permission has not been requested / is denied but request-able'
    //             )
    //             break
    //         case 'undetermined':
    //             setHasCameraPermission(false)
    //             console.log('Camera permission is undetermined')
    //             break
    //     }
    // }, [])

    // const { appStateVisible } = useAppState(checkPermissionsAppState)

    // opening app settings
    const openSettings = useCallback(async () => {
        Platform.OS === 'android' ? Linking.openSettings() : null
        if (Platform.OS === 'ios') {
            const supported = await Linking.canOpenURL('app-settings:')
            try {
                if (!supported) {
                    console.log("Can't handle settings url")
                } else {
                    return Linking.openURL('app-settings:')
                }
            } catch (err) {
                console.error('An error occurred', err)
            }
        }
    }, [])

    function sendUserToSettingsHandler() {
        const alertMessage =
            'Turn On Camera Permissions to Allow Event Share to Scan QR Codes'
        Platform.OS === 'android' ? androidAlert() : IOSAlert()

        function IOSAlert() {
            Alert.alert(alertMessage, '', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Settings',
                    onPress: () => {
                        openSettings()
                    },
                },
            ])
        }
        function androidAlert() {
            Alert.alert('', alertMessage, [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Settings',
                    onPress: () => {
                        openSettings()
                    },
                },
            ])
        }
    }

    //----------------------------------------------------------------PRESENTATION ANIMATION---------------------------------------------------------------
    // const reanimatedValue = useSharedValue(0)

    // const reToggleOpen = () => {
    //     reanimatedValue.value = withSequence(
    //         withTiming(1, {
    //             duration: 400,
    //         }),
    //         withTiming(0, {
    //             duration: 400,
    //         })
    //     )
    // }

    // const reReloadStyle = useAnimatedStyle(() => {
    //     return {
    //         transform: [
    //             {
    //                 scale: reanimatedValue.value,
    //             },
    //             {
    //                 translateY: interpolate(
    //                     reanimatedValue.value,
    //                     [0, 1],
    //                     [0, -70]
    //                 ),
    //             },
    //             {
    //                 rotate: interpolate(reanimatedValue.value, [0, 1], [0, 1]),
    //             },
    //         ],
    //     }
    // })
    // useFocusEffect(() => {
    //     const task = InteractionManager.runAfterInteractions(() => {
    //         setTimeout(() => reToggleOpen(), 200)
    //     })
    //     return () => task.cancel()
    // })
    //----------------------------------------------------------------PRESENTATION ANIMATION---------------------------------------------------------------

    //----------------------------------------------------------------NAV BAR FUNCTIONS----------------------------------------------------------------
    const onSearchPressed = useCallback(() => {
        props.navigation.navigate('SearchScreen')
    }, [])

    const onPersonPressed = useCallback(() => {
        props.navigation.navigate('ProfileScreen')
    }, [])

    const onFeedPressed = useCallback(() => {}, [])
    //----------------------------------------------------------------NAV BAR FUNCTIONS----------------------------------------------------------------

    //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------
    const render = useCallback(({ item, index }) => {
        return (
            <Thumbnail
                images={item}
                galleryPressedHandler={() => {
                    galleryPressedHandler(
                        item.galleryID,
                        item.thumbnail,
                        item.galleryName
                    )
                }}
                galleryName={item.galleryName}
                onActionsPressed={onActionsPressed.bind(this, item, index)}
                key={item.galleryID}
            />
        )
    }, [])

    const galleryPressedHandler = useCallback(
        (galleryID, thumbnail, galName) => {
            props.navigation.navigate('GalleryView', {
                galleryID,
                thumbnail,
                galName,
            })
        },
        []
    )

    const onActionsPressed = useCallback((item, index) => {
        bottomSheetRef.current?.handlePresentModalPress()
        setDeleteID({ id: item.galleryID, index: index })
    }, [])

    const itemHeight = useMemo(() => width / 2 - 5, [])

    const layOut = useCallback(
        (data, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
        }),
        []
    )

    const keyExtractor = useCallback((item) => `${item.galleryID}`, [])

    //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------

    return (
        <ScreenWrapper>
            <CustomHeaderBasic
                iconName="menu-outline"
                goBack={() => {
                    props.navigation.toggleDrawer()
                }}
                header="Gallery"
                headerColor={{ color: colors.darkestColorP1 }}
            />

            <BigList
                data={galleries}
                renderItem={render}
                itemHeight={itemHeight}
                layOut={layOut}
                keyExtractor={keyExtractor}
                contentContainerStyle={{
                    paddingBottom: tabBarBottomPosition + 80,
                }}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                onRefresh={loadGalleries}
                refreshing={loadingGalleries}
                removeClippedSubviews={Platform.OS === 'android' ? true : false}
                // ListEmptyComponent={}
            />

            {/* <FlatList
                data={galleries}
                renderItem={render}
                style={styles.flatList}
                onRefresh={loadGalleries}
                refreshing={loadingGalleries}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                // columnWrapperStyle={{
                //     marginLeft: 10,
                // }}
                contentContainerStyle={{
                    ...styles.bigListContentCont,
                    paddingBottom: tabBarBottomPosition + 80,
                }}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                getItemLayout={layOut}
            /> */}
            {/* <Reanimated.View
                style={[
                    styles.animation,
                    reReloadStyle,
                    {
                        position: 'absolute',
                        bottom: insets.bottom + 5,
                        left: (width - 50) / 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                ]}
            >
                <Ionicons name="home" size={20} color="#555"></Ionicons>
            </Reanimated.View> */}

            <NuemorphicNavBar
                onCameraPressed={cameraPressedHandler}
                onSearchPressed={onSearchPressed}
                onPersonPressed={onPersonPressed}
                onFeedPressed={onFeedPressed}
                feedFocused={true}
            />

            <ActionBottomSheet
                ref={bottomSheetRef}
                galleryID={deleteID}
                refreshGalleryList={loadGalleries}
            />

            {/* <CustomActionSheet /> */}
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: height,
        width: '100%',
    },
    xCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.43)',
    },
    flatList: {
        flex: 1,
        marginTop: 10,
    },
    bigListContentCont: {
        marginLeft: 10,
    },
    //animation
    animation: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        // position: 'absolute',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.2,
        backgroundColor: 'white',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        elevation: 5,
    },
})

export default DashboardScreen
