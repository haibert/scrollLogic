import React, { useCallback, useEffect, useState, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Share,
} from 'react-native'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../../constants/colors'
import Button from '../../components/Button'
import ScreenWrapper from '../../components/ScreenWrapper'
import CustomHeaderBasic from '../../components/HeaderBasic'

//qr code
import QRCode from 'react-native-qrcode-svg'

// async storage
import AsyncStorage from '@react-native-async-storage/async-storage'

//redux
import { shouldRefreshSet } from '../../store/event/action'
import { useSelector, useDispatch } from 'react-redux'

// navigation actions
import { CommonActions } from '@react-navigation/native'

//expo camera
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'

const { height, width } = Dimensions.get('screen')

const QrCodeScreen = ({ navigation, route }) => {
    const dispatch = useDispatch()
    const qrWidth = useMemo(() => width * 0.75)
    const [qrCode, setQrCode] = useState()
    const getData = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem('userID')
            if (value !== null) {
                return value
            }
        } catch (e) {
            return Math.random().toFixed(3) * 1000
        }
    }, [])

    const newGalID = useSelector((state) => state.galleryReducer.newGalleryID)
    console.log(
        '🚀 ~ file: QrCodeScreen.js ~ line 55 ~ QrCodeScreen ~ newGalID',
        newGalID
    )

    const qrCodePortion = route.params?.qrCodePortion
    console.log(
        '🚀 ~ file: QrCodeScreen.js ~ line 64 ~ QrCodeScreen ~ qrCodePortion',
        qrCodePortion
    )

    const getQrCode = useCallback(async () => {
        const qrCode = (await getData()) + qrCodePortion
        setQrCode(qrCode)
    }, [])

    useEffect(() => {
        getQrCode()
    }, [])

    console.log('rendered Qr code screen')
    // const randomNumber = (
    //     Math.random().toFixed(5) * 100000 +
    //     Math.random().toFixed(3) * 1000 +
    //     Math.random().toFixed(3) * 1000
    // ).toString()

    // let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';

    //----------------------------------------------------------------PERMISSIONS LOGIC----------------------------------------------------------------
    const greenLightOnPermissions = useSelector(
        (state) => state.permissionsReducer.permissions.camera
    )

    const navigateToCamera = useCallback(() => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'DashModalStack' },
                    {
                        name: 'CameraScreen',
                        params: {
                            checkMarkSet: 'checkMarkSet',
                            newGalleryID: newGalID,
                        },
                    },
                ],
            })
        )
    }, [])

    const addPhotoHandler = useCallback(async () => {
        if (greenLightOnPermissions === 'granted') {
            navigateToCamera()
        } else {
            const { status } = await Camera.getPermissionsAsync()
            const audioStatus = await Audio.getPermissionsAsync()

            // setHasCameraPermission(status === 'granted')
            if (status && audioStatus.status === 'granted') {
                dispatch(loadPermissions('granted'))
            } else if (status || audioStatus.status === 'undetermined') {
                const results = await Camera.requestPermissionsAsync()
                const audioResults = await Audio.requestPermissionsAsync()
                if (results.status && audioResults.status === 'granted') {
                    navigateToCamera()
                } else if (results.status || audioResults.status === 'denied') {
                    sendUserToSettingsHandler()
                    return
                }
            } else if (status || audioResults.status === 'denied') {
                const results2 = await Camera.requestPermissionsAsync()
                const audioResults2 = await Audio.requestPermissionsAsync()
                if (results2.status && audioResults2 === 'granted') {
                    navigateToCamera()
                } else {
                    sendUserToSettingsHandler()
                    return
                }
            }
        }
    }, [])
    //----------------------------------------------------------------PERMISSIONS LOGIC----------------------------------------------------------------
    return (
        <ScreenWrapper>
            <CustomHeaderBasic
                // iconName="chevron-back-outline"
                goBack={() => {
                    navigation.goBack()
                }}
                rightButton
                rightIcon="close"
                onPressRight={async () => {
                    await dispatch(shouldRefreshSet(true))
                    navigation.navigate('DashModalStack')
                }}
            />
            <View style={styles.outerCont}>
                <Text
                    style={styles.title}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >
                    Share Event With QR Code
                </Text>
                <Text
                    style={styles.underTitle}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >
                    You can share the code bellow with others. You may also have
                    the code printed on a large poster and displayed at your
                    event so others can easily join and upload their pictures.
                </Text>
                <Text
                    style={styles.underTitle}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >
                    To have this done for you and shipped click here.
                </Text>
            </View>
            <View style={styles.midCont}>
                <QRCode
                    value={qrCode}
                    size={qrWidth}
                    color={colors.textColor}
                    backgroundColor="transparent"
                    enableLinearGradient
                    linearGradient={[colors.blue3, colors.textColor]}
                    // logo={{ uri: base64Logo }}
                    // logoSize={30}
                    // logoBackgroundColor='transparent'
                />
            </View>
            <View style={styles.bottomCont}>
                <Button
                    text="Share"
                    style={styles.button}
                    onPress={() => {
                        // navigation.navigate('DashModalStack')
                    }}
                />
                <Button
                    text="Add Photos to Gallery"
                    style={styles.button}
                    onPress={addPhotoHandler}
                />
            </View>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    outerCont: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        color: colors.textColor,
    },
    underTitle: {
        color: colors.mediumTint,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 15,
        paddingHorizontal: 20,
    },
    midCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomCont: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },

    button: {
        width: '90%',
        marginBottom: 10,
    },
})

export default QrCodeScreen
