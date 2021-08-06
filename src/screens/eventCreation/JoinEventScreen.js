import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Dimensions,
    Alert,
    Linking,
    Platform,
} from 'react-native'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'

//custom components
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'
import TitleText from '../../components/Title'
import Button from '../../components/Button'
import CustomInput from '../../components/CustomInput'
import Card from '../../components/Card'
import SafeAreaComp from '../../components/SafeAreaComp'
import GridComponent from '../../components/GridComponent'

//customHooks
import useAppState from '../../hooks/useAppState'

//expo qr scanner
import { BarCodeScanner } from 'expo-barcode-scanner'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//blurview
// import { BlurView } from 'expo-blur'

//constants
import colors from '../../constants/colors'

//expo camera
import { Camera } from 'expo-camera'

const { width, height } = Dimensions.get('window')

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//nav 5
import { useFocusEffect } from '@react-navigation/native'

const JoinEventScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets()
    const [activateCamera, setActivateCamera] = useState()
    // const [isAndroid, setIsAndroid] = useState()
    let isAndroid = false

    if (Platform.OS === 'android') {
        isAndroid = true
    }

    const [hasPermission, setHasPermission] = useState(
        route.params.permission === 'granted' ? true : false
    )

    useFocusEffect(() => {
        if (navigation.isFocused()) {
            setActivateCamera(true)
        }
    })

    const [scanned, setScanned] = useState(false)

    const [showModal, setShowModal] = useState(false)

    // bar code scanning
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true)
        alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    }

    // // handle checking permissions after app state change
    // const checkPermissionsAppState = useCallback(async () => {
    //     const { status } = await Camera.getPermissionsAsync()
    //     switch (status) {
    //         case 'granted':
    //             setHasPermission(true)
    //             break
    //         case 'denied':
    //             setHasPermission(false)
    //             console.log(
    //                 'The permission has not been requested / is denied but requestable'
    //             )
    //             break
    //         case 'undetermined':
    //             setHasPermission(false)
    //             console.log('The permission is undetermined')
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

    const ModalComponent = (props) => {
        return (
            <Modal visible={props.showModal} transparent animationType="fade">
                <View style={styles.modal}>
                    <BlurView intensity={96} style={styles.blurView}>
                        <TouchableWithoutFeedback
                            onPress={() => setShowModal(false)}
                        >
                            <View
                                style={{
                                    paddingTop: insets.top,
                                    paddingBottom: insets.bottom,
                                    flex: 1,
                                }}
                            >
                                <View style={styles.modalActions}>
                                    <CustomInput
                                        placeholder="Enter Code"
                                        autoFocus={true}
                                        keyboardAppearance="dark"
                                        keyboardType="numeric"
                                    />
                                    <Button
                                        text="Join Event"
                                        onPress={() => {
                                            setShowModal(false)
                                        }}
                                    ></Button>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </BlurView>
                </View>
            </Modal>
        )
    }

    const NoPermissionContent = (props) => {
        return (
            <ScreenWrapper>
                <HeaderBasic
                    goBack={() => {
                        props.navigation.goBack()
                    }}
                    header="Join Gallery"
                    iconName="chevron-back-outline"
                />
                <View
                    style={{ alignSelf: 'center', flex: 1, paddingTop: '10%' }}
                >
                    <TouchableOpacity onPress={sendUserToSettingsHandler}>
                        <View style={styles.forkButton}>
                            <Ionicons
                                name="scan-outline"
                                size={35}
                                color={colors.buttonPurple}
                            />
                            <Text
                                style={styles.forkButtonText}
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                            >
                                Scan Event QR Code
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowModal(true)}>
                        <View style={styles.forkButton}>
                            <Ionicons
                                name="arrow-up-outline"
                                size={35}
                                color={colors.buttonPurple}
                            />
                            <Text
                                style={styles.forkButtonText}
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                            >
                                Enter Code Manually
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ModalComponent showModal={showModal} />
            </ScreenWrapper>
        )
    }

    const ScannerComponent = (props) => {
        return (
            <View style={styles.screen}>
                {!hasPermission ? (
                    <NoPermissionContent navigation={props.navigation} />
                ) : (
                    <BarCodeScanner
                        onBarCodeScanned={
                            scanned ? undefined : handleBarCodeScanned
                        }
                        style={styles.scanner}
                    >
                        <View
                            style={{
                                paddingTop: insets.top,
                                paddingBottom: insets.bottom,
                                flex: 1,
                            }}
                        >
                            {isAndroid && <View style={{ height: 30 }}></View>}
                            <HeaderBasic
                                goBack={() => {
                                    navigation.goBack()
                                }}
                                header=" Scan to Join"
                            />
                            <View style={styles.outerScreenCont}>
                                <GridComponent>
                                    <Ionicons
                                        name="qr-code-outline"
                                        size={60}
                                        color="rgba(255, 255, 255,0.7)"
                                    />
                                </GridComponent>

                                <View style={styles.bottomCont}>
                                    <Button
                                        text="Enter Manually"
                                        style={styles.button}
                                        onPress={() => setShowModal(true)}
                                        iconName="keypad-outline"
                                    />
                                    {isAndroid && (
                                        <View style={{ height: 30 }}></View>
                                    )}
                                </View>
                                {scanned && (
                                    <Button
                                        title={'Tap to Scan Again'}
                                        onPress={() => setScanned(false)}
                                    />
                                )}
                            </View>
                        </View>
                    </BarCodeScanner>
                )}
                <ModalComponent showModal={showModal} />
            </View>
        )
    }
    return <ScannerComponent navigation={navigation}></ScannerComponent>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    forkButton: {
        minWidth: '90%',
        borderColor: colors.buttonPurple,
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
        marginTop: 20,
    },
    forkButtonText: {
        color: colors.buttonPurple,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 13,
    },
    scanner: {
        flex: 1,
        backgroundColor: 'black',
    },
    blurView: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
    },
    outerScreenCont: {
        flex: 1,
        alignItems: 'center',
    },
    noPermissionContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    safeComp: {
        backgroundColor: colors.transparentModal,
        alignContent: 'center',
        justifyContent: 'center',
    },
    noPermissionText: {
        fontSize: 20,
        color: colors.textColor,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    permissionsText: {
        fontSize: 16,
        textAlign: 'center',
    },
    permissionsActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: colors.lightTint,
    },
    permissionsTouchable: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    bottomCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    inputView: {
        height: 50,
        width: '80%',
    },
    button: {
        width: '90%',
        // marginTop: 10,
    },
    modal: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: colors.transparentModal,
    },
    modalActions: {
        width: '100%',
        height: 200,
        shadowColor: 'black',
        shadowRadius: 7,
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
})

export default JoinEventScreen
