import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Modal,
    FlatList,
    AppState,
    Alert,
    Linking,
    Image,
    Platform,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

// custom components
import Button from '../components/Button'
import Thumbnail from '../components/Thumbnail'
import CustomHeaderBasic from '../components/HeaderBasic'

//customHooks
import useAppState from '../hooks/useAppState'

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
import { useDispatch, useSelector } from 'react-redux'

//blurview
import { BlurView } from 'expo-blur'

const { height, width } = Dimensions.get('screen')

const DashboardScreen = (props) => {
    const insets = useSafeAreaInsets()

    let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10

    if (tabBarBottomPosition === 10 && Platform.OS === 'android') {
        tabBarBottomPosition = 55
    }
    const dispatch = useDispatch()

    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)

    const [showModal, setShowModal] = useState(false)

    const greenLightOnPermissions = useSelector(
        (state) => state.permissionsReducer.permissions.camera
    )

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

    function galleryPressedHandler(image) {
        props.navigation.navigate('GalleryView', {
            image,
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
        <View style={styles.screen}>
            <LinearGradient
                // colors={['rgba(255, 237, 187, 1)', 'rgba(150, 227, 255, 1)']}
                // colors={['rgba(252,140,250,1)', 'rgba(255, 237, 187, 1)']}
                // colors={['rgba(252,140,250,1)', colors.lightTint]}
                colors={['rgba(252,140,250,1)', colors.blue]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View
                    style={{
                        paddingTop: insets.top,
                        // paddingBottom: insets.bottom,
                        flex: 1,
                    }}
                >
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
                        data={images}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={(item) => {
                            return (
                                <View>
                                    <View style={{ height: 10 }}></View>
                                    <Thumbnail
                                        images={item.item}
                                        galleryPressedHandler={() => {
                                            galleryPressedHandler(item.item)
                                        }}
                                    />
                                </View>
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
                    <View
                        style={{
                            ...styles.tabBarShadow,
                            width: width - 20,
                            bottom: tabBarBottomPosition,
                        }}
                    >
                        <LinearGradient
                            colors={[
                                'rgba(247, 37, 133, 1)',
                                'rgba(171,67,239,1)',
                                'rgba(76, 201, 240, 1)',
                            ]}
                            style={{ flex: 1, borderRadius: 15 }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    // props.navigation.navigate('CameraScreen')
                                }}
                            >
                                <View style={styles.tabButton}></View>
                            </TouchableWithoutFeedback>

                            <View style={{ width: 50 }}></View>
                            <TouchableWithoutFeedback
                                onPress={cameraPressedHandler}
                            >
                                <View style={styles.tabButton}></View>
                            </TouchableWithoutFeedback>

                            <Ionicons
                                name="camera-outline"
                                // color={colors.mediumTint}
                                color={colors.textColor}
                                size={29}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: (width - 26) / 6,
                                }}
                                onPress={cameraPressedHandler}
                            />

                            <Ionicons
                                name="search-outline"
                                size={28}
                                // color={colors.mediumTint}
                                color={colors.textColor}
                                style={{
                                    position: 'absolute',
                                    top: 11,
                                    left: (width - 26) / 6,
                                }}
                            />
                        </LinearGradient>
                    </View>
                    <View
                        style={{
                            ...styles.floatingPlusCont,
                            left: width / 2 - 40,
                            bottom: tabBarBottomPosition,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                setShowModal(true)
                            }}
                        >
                            <View style={styles.bigPlusButton}>
                                <LinearGradient
                                    colors={[
                                        // 'rgba(255, 237, 187, 1)',
                                        // 'rgba(150, 227, 255, 1)',
                                        colors.lightTint,
                                        colors.lightTint,
                                        // colors.buttonPink,
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.bigPlusButton}
                                >
                                    <Icon
                                        name="plus"
                                        type="material-community"
                                        size={38}
                                        color={colors.textColor}
                                    />
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

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
                            ></Button>
                        </View>
                        <Button
                            style={styles.cancelButton}
                            onPress={() => {
                                setShowModal(false)
                            }}
                            text="Cancel"
                        ></Button>
                    </View>
                </View>
            </Modal>
        </View>
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
        height: '100%',
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
