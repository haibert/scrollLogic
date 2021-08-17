import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    Alert,
    Linking,
    Platform,
    BackHandler,
} from 'react-native'

import { StatusBar } from 'expo-status-bar'

// //Linear Gradient
// import { LinearGradient } from 'expo-linear-gradient'

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

//customHooks
import useAppState from '../hooks/useAppState'

//useFocusEffect
import { InteractionManager } from 'react-native'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'

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
import {
    setGalleries,
    shouldRefreshSet,
    deleteGallery,
} from '../store/event/action'

import { useDispatch, useSelector } from 'react-redux'

// big list
import BigList from 'react-native-big-list'

//dimensions
const { height, width } = Dimensions.get('screen')

const loadNumber = 15
let page = 1

const FeedScreen = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    // sheet ref
    const bottomSheetRef = useRef()

    const isFocused = useIsFocused()

    let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10

    //dispatch
    const dispatch = useDispatch()

    // green on permissions
    const greenLightOnPermissions = useSelector(
        (state) => state.permissionsReducer.permissions.camera
    )

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

    const openSettings = useCallback(
        Platform.select({
            ios: async () => {
                const supported = await Linking.canOpenURL('app-settings:')
                try {
                    if (!supported) {
                        //Can't handle settings url
                        Alert.alert(
                            'Failed to Open Settings',
                            'Please go to this app settings manually.',
                            [
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                },
                            ]
                        )
                    } else {
                        return Linking.openURL('app-settings:')
                    }
                } catch (err) {
                    Alert.alert(
                        'Something Went Wrong.',
                        'Please try again later.',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                        ]
                    )
                }
            },
            android: () => {
                Linking.openSettings()
            },
        }),
        []
    )

    const alertMessage =
        'Turn on camera permissions to allow EventShare to take pictures, videos, and scan QR codes.'

    const sendUserToSettingsHandler = useCallback(
        Platform.select({
            ios: () => {
                Alert.alert(
                    'EventShare Needs Access to Your Camera',
                    alertMessage,
                    [
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
                    ]
                )
            },
            android: () => {
                Alert.alert(
                    'EventShare Needs Access to Your Camera',
                    alertMessage,
                    [
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
                    ]
                )
            },
        }),
        []
    )

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
        }, 100)
    }, [])

    const onConfirmPressed = useCallback(async () => {
        try {
            await dispatch(deleteGallery(deleteID))
            setTimeout(() => {
                setShowConfirmationBool(false)
            }, 100)
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

    const oneEllipsisPressed = useCallback((galleryID, index) => {
        bottomSheetRef.current?.handlePresentModalPress()
        setDeleteID({ id: galleryID, index: index })
    }, [])

    const itemHeight = useMemo(() => width + 20, [])

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
        <ScreenWrapper>
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

            <ActionBottomSheet
                ref={bottomSheetRef}
                showConfirmation={showConfirmation}
            />

            {showConfirmationBool && (
                <DeleteConfirmation
                    dismissConfirmation={dismissConfirmation}
                    onConfirmPressed={onConfirmPressed}
                    message="This will permanently delete all of the pictures
                            inside this gallery"
                />
            )}
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

export default FeedScreen
