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
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

// custom components
import Button from '../components/Button'
import Thumbnail from '../components/Thumbnail'

//customHooks
import useAppState from '../hooks/useAppState'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//expo camera
import { Camera } from 'expo-camera'

//expo qr scanner
import { BarCodeScanner } from 'expo-barcode-scanner'

//dummy data
import images from '../data/images'

//redux
import {
    savePermissionsStatus,
    loadPermissions,
} from '../store/permissions/actions'

import { useDispatch } from 'react-redux'

const { height, width } = Dimensions.get('screen')

const DashboardScreen = (props) => {
    const insets = useSafeAreaInsets()

    const dispatch = useDispatch()

    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)

    const [showModal, setShowModal] = useState(false)

    // useEffect(() => {
    //     dispatch(loadPermissions())
    // }, [dispatch])

    //app state
    // const appState = useRef(AppState.currentState)
    // const [appStateVisible, setAppStateVisible] = useState(appState.current)

    const cameraPressedHandler = async () => {
        const { status } = await Camera.getPermissionsAsync()
        console.log(
            '🚀 ~ file: DashboardScreen.js ~ line 61 ~ cameraPressedHandler ~ status',
            status
        )

        // setHasCameraPermission(status === 'granted')
        if (status === 'granted') {
            dispatch(savePermissionsStatus('granted'))
            props.navigation.navigate('CameraScreen')
        } else if (status === 'undetermined') {
            const results = await Camera.requestPermissionsAsync()
            if (results.status === 'granted') {
                props.navigation.navigate('CameraScreen')
            } else if (status === 'denied') {
                sendUserToSettingsHandler()
                return
            }
        } else if (status === 'denied') {
            const results2 = await Camera.requestPermissionsAsync()
            if (results2.status === 'granted') {
                props.navigation.navigate('CameraScreen')
            } else {
                sendUserToSettingsHandler()
                return
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

    function galleryPressedHandler() {}

    // handle checking permissions after app state change
    const checkPermissionsAppState = useCallback(async () => {
        const { status } = await Camera.getPermissionsAsync()
        switch (status) {
            case 'granted':
                setHasCameraPermission(true)
                console.log('Camera permission has been granted.')
                break
            case 'denied':
                setHasCameraPermission(false)
                console.log(
                    'Camera permission has not been requested / is denied but request-able'
                )
                break
            case 'undetermined':
                setHasCameraPermission(false)
                console.log('Camera permission is undetermined')
                break
        }
    }, [])

    const { appStateVisible } = useAppState(checkPermissionsAppState)

    // native alert for camera settings
    function openSettings() {
        Linking.canOpenURL('app-settings:')
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
        Alert.alert(
            'Turn On Camera Permissions to Allow Event Share to Use Your Camera',
            '',
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
    }

    return (
        <View style={styles.screen}>
            <LinearGradient
                colors={['rgba(255, 237, 187, 1)', 'rgba(150, 227, 255, 1)']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View
                    style={{
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                        flex: 1,
                    }}
                >
                    <View style={styles.xCont}>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.toggleDrawer()
                            }}
                        >
                            <Ionicons
                                name="menu-outline"
                                size={35}
                                color={colors.buttonPurple}
                            />
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            onPress={() => {
                                props.navigation.toggleDrawer()
                            }}
                        >
                            <Ionicons
                                name="person"
                                size={26}
                                color={colors.buttonPurple}
                            />
                        </TouchableOpacity> */}
                    </View>
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
                                        galleryPressedHandler={
                                            galleryPressedHandler
                                        }
                                    />
                                </View>
                            )
                        }}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        columnWrapperStyle={{
                            marginLeft: 10,
                        }}
                        // contentStyle={{ paddingBottom: 50 }}
                    />
                    <View
                        style={{
                            ...styles.tabBar,
                            width: width - 26,
                        }}
                    >
                        <LinearGradient
                            colors={[
                                'rgba(252,140,250,1)',
                                'rgba(155,97,234,1)',
                            ]}
                            style={styles.tabBarGradient}
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
                                name="camera"
                                color="white"
                                size={22}
                                style={{
                                    position: 'absolute',
                                    top: 14.5,
                                    right: (width - 26) / 6,
                                }}
                                onPress={cameraPressedHandler}
                            />

                            <Ionicons
                                name="search-outline"
                                size={22}
                                color="white"
                                style={{
                                    position: 'absolute',
                                    top: 14.5,
                                    left: (width - 26) / 6,
                                }}
                            />
                        </LinearGradient>
                    </View>
                    <View
                        style={{
                            ...styles.floatingPlusCont,
                            left: width / 2 - 30,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                setShowModal(true)
                            }}
                        >
                            <View style={styles.bigPlusButton}>
                                <Icon
                                    name="plus"
                                    type="material-community"
                                    size={38}
                                    color={colors.buttonPurple}
                                />
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
                                text="Join Event"
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
        paddingBottom: 50,
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
        backgroundColor: 'rgba(255, 227, 255, 1)',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        borderRadius: 15,
        marginHorizontal: 13,
        position: 'absolute',
        bottom: 22,
        alignItems: 'center',
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

    bigPlusButton: {
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 30,
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
        bottom: 23,
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        // overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        elevation: 10,
    },
    floatingTouchable: {
        width: 60,
        height: 60,
        borderRadius: 30,
        bottom: 2,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'red',
    },
})

export default DashboardScreen
