import React, { useState, useRef, useCallback, useEffect } from 'react'
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
import { TouchableOpacity } from 'react-native-gesture-handler'

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
import ActionBottomSheet from '../components/ActionBottomSheet'

//customHooks
import useAppState from '../hooks/useAppState'

//useFocusEffect
import { useFocusEffect } from '@react-navigation/native'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//expo camera
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'

//expo qr scanner
import { BarCodeScanner } from 'expo-barcode-scanner'

//dummy data
import images from '../data/images'

//redux
import {
    savePermissionsStatus,
    loadPermissions,
} from '../store/permissions/actions'
import { setGalleries } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

const { height, width } = Dimensions.get('screen')

const DashboardScreen = (props) => {
    const insets = useSafeAreaInsets()

    let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10
    const [deleteID, setDeleteID] = useState()

    const dispatch = useDispatch()

    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)

    const [showModal, setShowModal] = useState(false)

    const greenLightOnPermissions = useSelector(
        (state) => state.permissionsReducer.permissions.camera
    )

    //----------------------------------------------------------------BOTTOM SHEET----------------------------------------------------------------
    const bottomSheetRef = useRef()
    //----------------------------------------------------------------BOTTOM SHEET----------------------------------------------------------------

    //-----------------------------------------------------LOAD GALLERIES--------------------------------------------------------
    const [loadingGalleries, setLoadingGalleries] = useState(false)
    // states
    const galleries = useSelector((state) => state.galleryReducer.galleries)
    const id = useSelector((state) => state.signupReducer.userInfo.userID)
    console.log(
        '🚀 ~ file: DashboardScreen.js ~ line 91 ~ DashboardScreen ~ id',
        id
    )

    const loadGalleries = useCallback(async () => {
        setLoadingGalleries(true)
        // setError(null)
        try {
            await dispatch(setGalleries())
        } catch (error) {
            setLoadingGalleries(false)
            // setError(error.message)
        }
        setLoadingGalleries(false)
    }, [])

    useEffect(() => {
        loadGalleries()
    }, [loadGalleries])
    //-----------------------------------------------------LOAD GALLERIES--------------------------------------------------------

    // useFocusEffect(() => {
    //     const prevent = BackHandler
    //     if (props.navigation.isFocused()) {
    //         prevent.addEventListener('hardwareBackPress', () => true)
    //     }
    //     return () => {
    //         console.log('ran')
    //         prevent.removeEventListener()
    //     }
    // })

    // useEffect(() => {
    //     const prevent = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         () => true
    //     )
    //     return () => {
    //         prevent.removeEventListener()
    //     }
    // }, [])

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

    const askForQRScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync()
        setShowModal(false)

        setHasCameraPermission(status === 'granted')
        if (status === 'granted') {
            props.navigation.navigate('JoinEventScreen', {
                permission: status,
            })
        } else {
            props.navigation.navigate('JoinEventScreen', {
                permission: status,
            })
        }
    }

    function joinEventHandler() {
        askForQRScannerPermissions()
    }

    function galleryPressedHandler(gallery) {
        props.navigation.navigate('GalleryView', {
            gallery,
        })
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
    function openSettings() {
        Platform.OS === 'android'
            ? Linking.openSettings()
            : Linking.canOpenURL('app-settings:')
                  .then((supported) => {
                      if (!supported) {
                          console.log("Can't handle settings url")
                      } else {
                          return Linking.openURL('app-settings:')
                      }
                  })
                  .catch((err) => console.error('An error occurred', err))
    }

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

    return (
        <ScreenWrapper>
            <CustomHeaderBasic
                iconName="menu-outline"
                goBack={() => {
                    props.navigation.toggleDrawer()
                }}
                header="Gallery"
                headerColor={{ color: colors.textColor }}
            />

            <FlatList
                style={styles.flatList}
                onRefresh={loadGalleries}
                refreshing={loadingGalleries}
                data={galleries}
                keyExtractor={(item) => `${item.galleryID}`}
                renderItem={({ item, index }) => {
                    return (
                        <Thumbnail
                            images={item}
                            galleryPressedHandler={() => {
                                galleryPressedHandler(item)
                            }}
                            navigation={props.navigation}
                            galleryName={item.galleryName}
                            onActionsPressed={() => {
                                bottomSheetRef.current?.handlePresentModalPress()
                                setDeleteID(item.galleryID)
                            }}
                        />
                    )
                }}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={{
                    marginLeft: 10,
                }}
                contentContainerStyle={{
                    paddingBottom: tabBarBottomPosition + 60,
                }}
            />

            <BottomNavBar
                onPlusPressed={() => {
                    setShowModal(true)
                }}
                onRightPressed={cameraPressedHandler}
            />
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modal}>
                    <View>
                        <View style={styles.modalActions}>
                            <Button
                                text="Join Gallery"
                                style={styles.innerButton}
                                onPress={joinEventHandler}
                            ></Button>
                            <Button
                                text="Create Event"
                                onPress={() => {
                                    setShowModal(false)
                                    props.navigation.navigate(
                                        'CreateEventScreen'
                                    )
                                }}
                            />
                        </View>
                        <Button
                            style={styles.cancelButton}
                            onPress={() => {
                                setShowModal(false)
                            }}
                            text="Cancel"
                        />
                    </View>
                </View>
            </Modal>

            <ActionBottomSheet
                ref={bottomSheetRef}
                navigation={props.navigation}
                galleryID={deleteID}
                refreshGalleryList={loadGalleries}
            />
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
    modalActions: {
        width: '80%',
        height: 200,
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.26,
        backgroundColor: colors.pinkLESSTransparent,

        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 30,
    },
    innerButton: {
        marginBottom: 20,
    },
    cancelButton: {
        marginTop: 30,
        width: `80%`,
    },
    tabBar: {
        height: 50,
        // backgroundColor: 'rgba(255, 227, 255, 1)',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        borderRadius: 15,
        marginHorizontal: 10,
        position: 'absolute',
        alignItems: 'center',
        overflow: 'hidden',
    },
    tabBarImage: {
        height: 50,
        borderRadius: 15,
        marginHorizontal: 10,
        position: 'absolute',
    },
    tabBarGradient: {
        flex: 1,
        borderRadius: 15,
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: '100%',
    },

    tabLabel: {
        color: 'white',
        fontSize: 10,
    },
    tabLabel2: {
        color: 'white',
        fontSize: 10,
    },
    tabBarShadow: {
        position: 'absolute',
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 15,
        marginHorizontal: 10,
        shadowColor: 'black',
        shadowRadius: 3,
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 5,
    },
    bigPlusButton: {
        backgroundColor: colors.mediumTint,
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    floatingPlusCont: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        // overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        elevation: 10,
    },
    floatingTouchable: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'red',
    },
})

export default DashboardScreen
