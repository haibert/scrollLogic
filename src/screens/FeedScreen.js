import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import {
    StyleSheet,
    Dimensions,
    Platform,
    BackHandler,
    Modal,
} from 'react-native'

import { StatusBar } from 'expo-status-bar'

//colors
import colors from '../constants/colors'

// custom components
import Button from '../components/Button'
import Thumbnail from '../components/Thumbnail'
import FeedCell from '../components/FeedScreen/FeedCell'
import CustomHeaderBasic from '../components/HeaderBasic'
import ScreenWrapper from '../components/ScreenWrapper'
import BottomNavBar from '../components/BottomNavBar'
import NuemorphicNavBar from '../components/NuemorphicNavBar'
import CustomActionSheet from '../components/CustomActionSheet'
import DeleteConfirmation from '../components/DeleteConfirmation'
import ActionBottomSheet from '../components/ActionBottomSheet'

import FloatingButton from '../components/FloatingButton'

//useFocusEffect
import { InteractionManager } from 'react-native'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

import {
    setGalleries,
    shouldRefreshSet,
    deleteGallery,
} from '../store/event/action'
import { uploadExpoToken } from '../store/signup-auth/actions'

import { useDispatch, useSelector } from 'react-redux'

// big list
import BigList from 'react-native-big-list'

//dimensions
const { height, width } = Dimensions.get('screen')

//expo notifications
import * as Notifications from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'
import Constants from 'expo-constants'

//-------------------------------------------------------------------NOTIFICATIONS SETUP-------------------------------------------------------------------
const hasNotificationPermission = async () => {
    if (Constants.isDevice) {
        try {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync()
            let finalStatus = existingStatus

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync({
                    ios: {
                        allowAlert: true,
                        allowBadge: true,
                        allowSound: true,
                        allowAnnouncements: true,
                    },
                })
                finalStatus = status
            }

            if (finalStatus === 'granted') return true

            if (finalStatus !== 'granted') {
                // Alert.alert(
                //     'Warning',
                //     'You will not receive notifications if you do not enable push notifications. If you would like to stay up to date with your account activity, please enable push notifications for EventShare in your settings.',
                //     [
                //         { text: 'Cancel' },
                //         {
                //             text: 'Enable Notifications',
                //             onPress: () =>
                //                 Platform.OS === 'ios'
                //                     ? Linking.openURL('app-settings:')
                //                     : Linking.openSettings(),
                //         },
                //     ]
                // )
                return false
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'Something went wrong while check your notification permissions, please try again later.'
            )
            return false
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            })
        }
    } else {
        alert('Must use physical device for Push Notifications')
    }
}

const getPushToken = async () => {
    const token = await Notifications.getExpoPushTokenAsync({
        experienceId: '@haibert/EventShare',
    })
    return token
}

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'
TaskManager.defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    ({ data, error, executionInfo }) => {
        console.log('Received a notification in the background!')
        console.log(data)
        // Do something with the notification data
    }
)
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)

//-------------------------------------------------------------------NOTIFICATIONS SETUP-------------------------------------------------------------------

// USED FOR LOADING GALLERIES WITH PAGINATION
const loadNumber = 15
let page = 1

const FeedScreen = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    // sheet ref
    const bottomSheetRef = useRef()

    const tabBarHeight = useBottomTabBarHeight()

    const isFocused = useIsFocused()

    let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10

    //dispatch
    const dispatch = useDispatch()

    //----------------------------------------------------------------GET NOTIFICATION AND UPLOAD------------------------------------------------------------
    const notificationListener = useRef()
    const responseListener = useRef()
    const uploadNotificationToken = useCallback(async () => {
        const hasPermission = await hasNotificationPermission()
        if (hasPermission) {
            const token = await getPushToken()
            await dispatch(uploadExpoToken(token.data))
            console.log(
                '🚀 ~ file: App.js ~ line 122 ~ doNotificationLogic ~ token',
                token
            )
            // dispatch(updatePushToken(token))
            return
        }
    }, [])

    useEffect(() => {
        uploadNotificationToken()
    }, [])

    // useEffect(() => {
    //     const getRegisteredTasks = async () => {
    //         const tasks = await TaskManager.getRegisteredTasksAsync()
    //         console.log(tasks)
    //     }
    //     getRegisteredTasks()
    // }, [])

    useEffect(() => {
        notificationListener.current =
            Notifications.addNotificationReceivedListener(
                async (notification) => {
                    // notification received in the foreground
                }
            )

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    // console.log(response)
                    navigateToNotifications()
                }
            )

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            )
            Notifications.removeNotificationSubscription(
                responseListener.current
            )
        }
    }, [])
    //----------------------------------------------------------------GET NOTIFICATION AND UPLOAD------------------------------------------------------------

    //----------------------------------------------------------------HANDLE NOTIFICATION------------------------------------------------------------

    const navigateToNotifications = () => {
        Notifications.setBadgeCountAsync(0)
        props.navigation.dispatch(
            CommonActions.navigate('ProfileSEStack', {
                screen: 'ProfileScreen',
            })
        )
        props.navigation.dispatch(
            CommonActions.navigate('ProfileSEStack', {
                screen: 'ProfileScreen',
            })
        )
    }
    //----------------------------------------------------------------HANDLE NOTIFICATION------------------------------------------------------------

    //----------------------------------------------------------------LOAD GALLERIES----------------------------------------------------------------
    const [loadingGalleries, setLoadingGalleries] = useState(false)

    const galleries = useSelector((state) => state.galleryReducer.galleries)

    console.log('Dash Screen Loaded')
    const shouldRefresh = useSelector(
        (state) => state.galleryReducer.shouldRefresh
    )

    const loadGalleries = useCallback(async () => {
        // setLoadingGalleries(true)
        // setError(null)
        page = 1
        try {
            await dispatch(setGalleries(null, loadNumber, page, true))
        } catch (error) {
            // setError(error.message)
        }
        // setLoadingGalleries(false)
    }, [dispatch])

    // useEffect(() => {
    //     loadGalleries()
    // }, [loadGalleries])

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

    //----------------------------------------------------------------ACTION SHEET LOGIC---------------------------------------------------------------
    const [showConfirmationBool, setShowConfirmationBool] = useState()
    const [deleteID, setDeleteID] = useState({ id: '', index: '' })

    const showConfirmation = useCallback(() => {
        setTimeout(() => {
            setShowConfirmationBool(true)
        }, 180)
    }, [])

    const dismissConfirmation = useCallback(() => {
        setTimeout(() => {
            setShowConfirmationBool(false)
            setOpenModal(false)
        }, 150)
    }, [])

    const onConfirmPressed = useCallback(async () => {
        try {
            await dispatch(deleteGallery(deleteID))
            setTimeout(() => {
                setShowConfirmationBool(false)
                setOpenModal(false)
            }, 150)
        } catch (err) {
            console.log('Error deleting gallery', err)
        }
    }, [deleteID])

    //----------------------------------------------------------------ACTION SHEET LOGIC--------------------------------------------------------------

    //----------------------------------------------------------------NAV BAR FUNCTIONS----------------------------------------------------------------
    const onSearchPressed = useCallback(() => {
        props.navigation.navigate('SearchScreen', { shouldAnimateSearch: true })
    }, [])

    const onProfilePressed = useCallback(() => {
        props.navigation.navigate('ProfileScreen', {
            shouldAnimateProfile: true,
        })
    }, [])

    const onFeedPressed = useCallback(() => {}, [])
    //----------------------------------------------------------------NAV BAR FUNCTIONS----------------------------------------------------------------

    //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------
    const render = useCallback(
        ({ item, index }) => {
            return (
                <FeedCell
                    galleryData={item}
                    galleryPressedHandler={() => {
                        galleryPressedHandler(
                            item.galleryID,
                            item.thumbnail,
                            index
                        )
                    }}
                    galleryName={item.galleryName}
                    oneEllipsisPressed={() => {
                        oneEllipsisPressed(item.galleryID, index)
                    }}
                    key={item.galleryID}
                />
            )
        },
        [galleries]
    )

    const galleryPressedHandler = useCallback((galleryID, thumbnail, index) => {
        props.navigation.navigate('OtherGalleryView', {
            galleryID,
            thumbnail,
            index,
        })
    }, [])

    const [openModal, setOpenModal] = useState(false)
    const oneEllipsisPressed = useCallback((galleryID, index) => {
        setOpenModal(true)
        setTimeout(() => {
            bottomSheetRef.current?.handlePresentModalPress()
        }, 50)
        setDeleteID({ id: galleryID, index: index })
    }, [])

    const closeModal = useCallback(() => {
        setOpenModal(false)
    }, [])

    const itemHeight = useMemo(() => width + 40, [])

    const layOut = useCallback(
        (data, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
        }),
        []
    )

    const keyExtractor = useCallback((item) => `${item.galleryID}`, [])

    const onEndReached = useCallback(async () => {
        const nextPage = (page += 1)
        try {
            await dispatch(setGalleries(null, loadNumber, nextPage))
        } catch (error) {
            // setError(error.message)
        }
    }, [])

    //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------

    return (
        <ScreenWrapper
            style={{
                paddingBottom: tabBarHeight,
            }}
        >
            <CustomHeaderBasic
                iconName="menu-outline"
                goBack={() => {
                    props.navigation.toggleDrawer()
                }}
                // header="Gallery"
                // headerColor={{ color: colors.darkestColorP1 }}
            />

            <BigList
                data={galleries}
                renderItem={render}
                itemHeight={itemHeight}
                layOut={layOut}
                keyExtractor={keyExtractor}
                // contentContainerStyle={{
                //     paddingBottom: tabBarBottomPosition,
                // }}
                contentContainerStyle={{
                    paddingTop: 20,
                }}
                showsVerticalScrollIndicator={false}
                onRefresh={loadGalleries}
                refreshing={loadingGalleries}
                removeClippedSubviews={Platform.OS === 'android' ? true : false}
                onEndReachedThreshold={0.8}
                onEndReached={onEndReached}
                // ListEmptyComponent={}
            />

            {/* <FlatList
                data={galleries}
                renderItem={render}
                style={styles.flatList}
                // onRefresh={loadGalleries}
                // refreshing={loadingGalleries}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                contentContainerStyle={{
                    paddingBottom: tabBarBottomPosition,
                }}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                getItemLayout={layOut}
                onEndReachedThreshold={1}
                onEndReached={onEndReached}
            /> */}

            {/* <NuemorphicNavBar
                onCameraPressed={cameraPressedHandler}
                onSearchPressed={onSearchPressed}
                onProfilePressed={onProfilePressed}
                onFeedPressed={onFeedPressed}
                feedFocused={isFocused}
            /> */}
            {/* 
            <View
                style={{
                    position: 'absolute',
                    borderColor: 'red',
                    borderWidth: 1,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            ></View> */}
            <Modal
                style={StyleSheet.absoluteFill}
                visible={openModal}
                animationType="fade"
                transparent
            >
                <ActionBottomSheet
                    ref={bottomSheetRef}
                    showConfirmation={showConfirmation}
                    closeModal={() => {
                        console.log('called')
                        closeModal()
                    }}
                />
                {showConfirmationBool && (
                    <DeleteConfirmation
                        dismissConfirmation={dismissConfirmation}
                        onConfirmPressed={onConfirmPressed}
                        message="This will permanently delete all of the pictures
                            inside this gallery"
                    />
                )}
            </Modal>
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

export default FeedScreen
