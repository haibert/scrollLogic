import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    ImageBackground,
    BackHandler,
    Alert,
    Linking,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//expo camera
import { Camera } from 'expo-camera'

//expo AV
import { Video, AVPlaybackStatus } from 'expo-av'

//custom components
import HeaderX from '../components/HeaderX'
import CameraButton from '../components/CameraButton'
import EditorBottomActions from '../components/CameraComponents/EditorBottomActions'
import BottomSheet from '../components/CameraComponents/BottomSheet'

//ionicons
import { Entypo, Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//colors
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//redux
import {
    takePicture,
    addToGallery,
    setCameraUp,
    setPics,
} from '../store/camera/actions'

import { shouldRefreshSet } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

// MediaLibrary
import * as MediaLibrary from 'expo-media-library'

//gesture handlers
import {
    PinchGestureHandler,
    PinchGestureHandlerGestureEvent,
    State,
    TapGestureHandler,
    TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler'
import Reanimated, {
    Extrapolate,
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedProps,
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    runOnUI,
    useAnimatedRef,
    withTiming,
} from 'react-native-reanimated'

//nav 5
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { InteractionManager } from 'react-native'

//status bar
import { StatusBar } from 'expo-status-bar'

// expo image manipulator
import * as ImageManipulator from 'expo-image-manipulator'

// expo view shot
import ViewShot, { captureRef } from 'react-native-view-shot'

//expo constatns
import Constants from 'expo-constants'

const { height, width } = Dimensions.get('window')
console.log('🚀 ~ file: CameraScreen.js ~ line 77 ~ height', height)
console.log('🚀 ~ file: CameraScreen.js ~ line 77 ~ width', width)

const CameraScreen = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    let checkMarkSet = useRef(route.params?.checkMarkSet).current
    console.log(
        '🚀 ~ file: CameraScreen.js ~ line 69 ~ CameraScreen ~ checkMarkSet',
        checkMarkSet
    )
    const galleryIDPassed = useRef(route.params?.galleryID).current
    const newGalleryID = useRef(route.params?.newGalleryID).current

    const [camWidth, setCamWidth] = useState(0)
    //----------------------------------------------------------------BOTTOM SHEET----------------------------------------------------------------
    const [picture64, setPicture64] = useState()

    const bottomSheetRef = useRef()
    //----------------------------------------------------------------BOTTOM SHEET----------------------------------------------------------------

    //----------------------------------------------------------------MOUNT/UNMOUNT CAMERA ON FOCUS/BLUR----------------------------------------------------------------
    const [screenFocused, setScreenFocused] = useState(true)

    // useFocusEffect(() => {
    //     setScreenFocused(true)
    // })

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('blur', () => {
    //         const task = InteractionManager.runAfterInteractions(() => {
    //             setScreenFocused(false)
    //         })
    //         return () => task.cancel()
    //     })
    //     return unsubscribe
    // }, [navigation])
    //----------------------------------------------------------------MOUNT/UNMOUNT CAMERA ON FOCUS/BLUR----------------------------------------------------------------

    //----------------------------------------------------------------RATIO SETTER----------------------------------------------------------------
    const [cameraSettings, setCameraSettings] = useState({
        imagePadding: 0,
        ratio: '4:3',
        previewRatio: 1,
        isRatioSet: false,
    })
    const [imagePadding, setImagePadding] = useState(0)
    const [ratio, setRatio] = useState('4:3') // default is 4:3
    const [previewRatio, setPreviewRatio] = useState(1) // default is 4:3
    // console.log(
    //     '🚀 ~ file: CameraScreen.js ~ line 79 ~ CameraScreen ~ previewRatio',
    //     previewRatio
    // )
    const screenRatio = height / width
    // const [isRatioSet, setIsRatioSet] = useState(false)
    const prepareRatio = useCallback(async () => {
        let desiredRatio = '4:3' // Start with the system default
        // This issue only affects Android
        if (Platform.OS === 'android') {
            const ratios = await cameraRef.current.getSupportedRatiosAsync()
            // console.log(
            //     '🚀 ~ file: CameraScreen.js ~ line 88 ~ prepareRatio ~ ratios',
            //     ratios
            // )
            let distances = {}
            let realRatios = {}
            let minDistance = null
            let previewRatio = 1
            for (const ratio of ratios) {
                const parts = ratio.split(':')
                const ratioHeight = parseInt(parts[0])
                const ratioWidth = parseInt(parts[1])
                const realRatio = ratioHeight / ratioWidth

                realRatios[ratio] = realRatio
                // ratio can't be taller than screen, so we don't want an abs()
                const distance = screenRatio - realRatio
                distances[ratio] = realRatio
                if (minDistance == null) {
                    minDistance = ratio
                } else {
                    if (distance >= 0 && distance < distances[minDistance]) {
                        minDistance = ratio
                    }
                }
            }
            // set the best match
            desiredRatio = minDistance
            const parts = desiredRatio.split(':')
            const ratioHeight = parseInt(parts[0])
            const ratioWidth = parseInt(parts[1])
            previewRatio = ratioWidth / ratioHeight
            const picSize =
                await cameraRef.current.getAvailablePictureSizesAsync(
                    desiredRatio
                )
            // console.log(
            //     '🚀 ~ file: CameraScreen.js ~ line 123 ~ prepareRatio ~ picSize',
            //     picSize
            // )
            //  calculate the difference between the camera width and the screen height
            const remainder = Math.floor(
                height - realRatios[desiredRatio] * width
            )

            // set the preview padding and preview ratio
            // dispatch(setCameraUp(remainder, desiredRatio, previewRatioPassed))
            const previewRatioPassed = +previewRatio.toFixed(2)
            setCameraSettings({
                imagePadding: remainder,
                ratio: desiredRatio,
                previewRatio: previewRatioPassed,
                isRatioSet: true,
            })
            // setImagePadding(remainder)

            // setRatio(desiredRatio)
            // setPreviewRatio(+previewRatio.toFixed(2))
            // setIsRatioSet(true)
        }
    }, [])

    const setCameraReady = async () => {
        if (!cameraSettings.isRatioSet) {
            await prepareRatio()
        }
    }
    //----------------------------------------------------------------RATIO SETTER----------------------------------------------------------------

    const [type, setType] = useState(Camera.Constants.Type.back)
    const [activateCamera, setActivateCamera] = useState(false)
    const [video, setVideo] = useState('')
    const [showVideoModal, setShowVideoModal] = useState(false)
    const insets = useSafeAreaInsets()

    //----------------------------------------------------------------ACTIVATE CAMERA----------------------------------------------------------------
    // useFocusEffect(() => {
    //     if (navigation.isFocused()) {
    //         setActivateCamera(true)
    //     }
    // })
    //----------------------------------------------------------------ACTIVATE CAMERA----------------------------------------------------------------

    const [pic, setPic] = useState(null)

    const [showPicModal, setShowPicture] = useState(false)

    // const cameraRef = useRef()

    const cameraRef = useAnimatedRef()

    const dispatch = useDispatch()

    const [zooming, setZooming] = useState(0)

    //camera settings
    const [flashMode, setFlashMode] = useState('off')

    // const picTaken = useSelector((state) => state.cameraReducer.pictureUri)
    // console.log(
    //     '🚀 ~ file: CameraScreen.js ~ line 36 ~ CameraScreen ~ picTaken',
    //     picTaken
    // )
    //----------------------------------------------------------------TAKE PICTURE----------------------------------------------------------------
    const takePictureHandler = useCallback(async () => {
        try {
            if (cameraRef.current) {
                const options = {
                    quality: 0,
                    base64: true,
                    skipProcessing: true,
                }
                let photo = await cameraRef.current.takePictureAsync(options)
                // console.log(
                //     '🚀 ~ file: CameraScreen.js ~ line 231 ~ takePictureHandler ~ photo.height',
                //     photo.height
                // )
                // set photo uri for upload function to be able to use, then show photo
                const resizedPhoto = await ImageManipulator.manipulateAsync(
                    photo.uri,
                    [{ resize: { height: 1100 } }],
                    { compress: 1, format: 'jpeg', base64: true }
                )
                //then create smaller version to save.
                await dispatch(
                    takePicture(resizedPhoto.uri, resizedPhoto.base64)
                )
                setPic(photo.uri)
                setShowPicture(true)
            }
        } catch (err) {
            console.log(err)
        }
    }, [])

    //----------------------------------------------------------------TAKE PICTURE----------------------------------------------------------------
    //----------------------------------------------------------------SCREEN SHOTTING----------------------------------------------------------------
    const screenShotRef = useRef()

    const takeScreenShotHandler = async () => {
        const photoURI = await captureRef(screenShotRef, {
            format: 'jpg',
            quality: 1,
        })
        const base64 = await captureRef(screenShotRef, {
            format: 'jpg',
            quality: 1,
            result: 'base64',
        })

        await dispatch(takePicture(photoURI, base64))
        setPic(photoURI)
        setShowPicture(true)
    }

    //----------------------------------------------------------------SCREEN SHOTTING----------------------------------------------------------------
    //----------------------------------------------------------------UPLOAD PICTURE----------------------------------------------------------------
    const uploadPhotoHandler = useCallback(async () => {
        console.log('iOS upload Ran')
        const resizedPhoto = await ImageManipulator.manipulateAsync(
            pic,
            [{ resize: { height: 1100 } }],
            { compress: 0.5, format: 'jpeg', base64: true }
        )

        try {
            await dispatch(shouldRefreshSet(true))
            dispatch(
                addToGallery(
                    `data:image/jpeg;base64,${resizedPhoto.base64}`,
                    newGalleryID ? [`${newGalleryID}`] : [galleryIDPassed]
                )
            )
            setShowPicture(false)
        } catch (err) {}
    }, [showPicModal])

    const screenShotBase64 = useSelector(
        (state) => state.cameraReducer.pictureBase64
    )

    const uploadScreenShotHandler = useCallback(async () => {
        console.log('android upload fired')
        try {
            await dispatch(shouldRefreshSet(true))
            dispatch(
                addToGallery(
                    `data:image/jpeg;base64,${screenShotBase64}`,
                    newGalleryID ? [`${newGalleryID}`] : [galleryIDPassed]
                )
            )

            setShowPicture(false)

            // if (!newGalleryID) {
            //     navigation.navigate('GalleryView', {
            //         shouldRefresh: 'shouldRefresh',
            //     })
            // }
        } catch (err) {}
    }, [])
    //----------------------------------------------------------------UPLOAD PICTURE----------------------------------------------------------------

    const flipCameraHandler = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        )
    }

    function flashSwitchHandler() {
        if (flashMode === 'off') {
            setFlashMode('on')
        }
        if (flashMode === 'on') {
            setFlashMode('off')
        }
    }

    //----------------------------------------------------------------SAVE PICTURE LOCALLY----------------------------------------------------------------
    function sendUserToSettingsHandler() {
        const alertMessage = 'EventShare Would Like to Access Your Photo'
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

    async function savePictureLocallyHandler() {
        const { status } = await MediaLibrary.getPermissionsAsync()

        if (status === 'granted') {
            const asset = await MediaLibrary.createAssetAsync(pic)
            if (asset) {
                //display check mark showing it was saved.
            }
        }
        if (status === 'undetermined') {
            const results = await MediaLibrary.requestPermissionsAsync()
            if (results.status === 'granted') {
                await MediaLibrary.createAssetAsync(pic)
                //show success
            } else {
                sendUserToSettingsHandler()
                return
            }
        }
        if (status === 'denied') {
            const results = await MediaLibrary.requestPermissionsAsync()
            if (results.status === 'granted') {
                await MediaLibrary.createAssetAsync(pic)
                //show success
            } else {
                sendUserToSettingsHandler()
                return
            }
        }
    }
    //----------------------------------------------------------------SAVE PICTURE LOCALLY----------------------------------------------------------------

    //----------------------------------------------------------------ZOOM LOGIC--------------------------------------------------------------------------

    const zoom = useSharedValue(0)
    const MAX_ZOOM_FACTOR = 10
    const SCALE_FULL_ZOOM = 20
    const formatMaxZoom = 1
    const maxZoomFactor = Math.min(formatMaxZoom, MAX_ZOOM_FACTOR)
    const neutralZoomScaled = (neutralZoom / maxZoomFactor) * formatMaxZoom
    const maxZoomScaled = (1 / formatMaxZoom) * maxZoomFactor

    const neutralZoom = 0
    useAnimatedProps(
        () => ({
            zoom: interpolate(
                zoom.value,
                [0, neutralZoomScaled, 1],
                [0, neutralZoom, maxZoomScaled],
                Extrapolate.CLAMP
            ),
        }),
        [maxZoomScaled, neutralZoom, neutralZoomScaled, zoom]
    )

    function updateValue() {
        setZooming(zoom.value)
    }
    function willThisWork() {
        'worklet'
        runOnJS(updateValue)()
    }

    // cameraRef.current.setNativeProps({ zoom: zoom.value })

    const cameraAnimatedProps = useAnimatedProps(
        () => ({
            zoom: withTiming(zoom.value),
        }),
        [zoom]
    )

    const onPinchGesture = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.startZoom = zoom.value
        },
        onActive: (event, context) => {
            // trying to map the scale gesture to a linear zoom here
            const startZoom = context.startZoom ?? 0
            const scale = interpolate(
                event.scale,
                [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
                [-1, 0, 1],
                Extrapolate.CLAMP
            )
            zoom.value = interpolate(
                scale,
                [-1, 0, 1],
                [0, startZoom, 1],
                Extrapolate.CLAMP
            )
            willThisWork()
        },
    })
    //----------------------------------------------------------------ZOOM LOGIC--------------------------------------------------------------------------

    //----------------------------------------------------------------VIDEO RECORDING---------------------------------------------------------------------

    const beginRecording = async () => {
        console.log('got here')
        let video = await cameraRef.current.recordAsync()
        setVideo(video)
        // dispatch(takePicture(photo.uri))
    }
    async function endRecording() {
        cameraRef.current.stopRecording()
        setShowVideoModal(true)
    }
    //----------------------------------------------------------------VIDEO RECORDING---------------------------------------------------------------------

    //----------------------------------------------------------------PLATFORM SPECIFIC----------------------------------------------------------------

    const uploadHandler = () => {
        if (Platform.OS === 'android') {
            return uploadScreenShotHandler()
        } else {
            return uploadPhotoHandler()
        }
    }

    const takePhotoHandler = () => {
        if (Platform.OS === 'android') {
            return takeScreenShotHandler()
        } else {
            return takePictureHandler()
        }
    }

    //----------------------------------------------------------------PLATFORM SPECIFIC----------------------------------------------------------------

    return (
        <View
            style={{
                ...styles.container,
                // paddingTop: Platform.OS === 'android' ? insets.top : null,
            }}
        >
            <StatusBar
                style="light"
                translucent
                backgroundColor="rgba(0,0,0,1)"
            />
            <PinchGestureHandler onGestureEvent={onPinchGesture}>
                <Reanimated.View
                    style={{
                        flex: 1,
                        backgroundColor: 'black',
                        justifyContent: 'flex-start',
                        paddingBottom: -cameraSettings.imagePadding,
                    }}
                >
                    {screenFocused && (
                        <ViewShot
                            style={{
                                // flex: 1,
                                marginTop: insets.top,

                                // for new aspect ratio related code
                                aspectRatio: 9 / 16,
                                top: 0,
                                right: 0,
                                left: 0,
                                position: 'absolute',
                            }}
                            ref={screenShotRef}
                            collapsable={false}
                            onLayout={(event) => {
                                event.nativeEvent.layout.height
                            }}
                        >
                            <Camera
                                // style={{
                                //     aspectRatio:
                                //         Platform.OS === 'android'
                                //             ? cameraSettings.previewRatio
                                //             : null,
                                //     left: -(camWidth - width) / 2,
                                //     marginTop: insets.top,
                                //     aspectRatio: 9 / 16,
                                //     width: width,
                                // }}
                                style={{
                                    // aspectRatio:
                                    //     Platform.OS === 'android'
                                    //         ? cameraSettings.previewRatio
                                    //         : null,
                                    // // flex: 1,
                                    // left: -(camWidth - width) / 2,
                                    aspectRatio: 9 / 16,
                                }}
                                ref={cameraRef}
                                type={type}
                                flashMode={flashMode}
                                zoom={zoom.value}
                                onCameraReady={setCameraReady}
                                ratio={cameraSettings.ratio}
                                autoFocus="on"
                                onLayout={(event) => {
                                    setCamWidth(event.nativeEvent.layout.width)
                                }}
                            />
                        </ViewShot>
                    )}
                    <View
                        style={[
                            styles.contentContainer,
                            {
                                top: insets.top,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack()
                            }}
                        >
                            <Ionicons
                                name="chevron-back-outline"
                                size={40}
                                color="white"
                            />
                        </TouchableOpacity>
                        <View style={styles.topLeftCont}>
                            <TouchableOpacity onPress={flipCameraHandler}>
                                <Entypo
                                    name="loop"
                                    size={27}
                                    color="white"
                                    style={styles.flipIcon}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={flashSwitchHandler}>
                                <Ionicons
                                    name={
                                        flashMode !== 'off'
                                            ? 'flash'
                                            : 'flash-off'
                                    }
                                    size={27}
                                    color="white"
                                    style={styles.cameraSettingsButton}
                                />
                            </TouchableOpacity>
                        </View>

                        <CameraButton
                            style={{
                                ...styles.floatingPlusCont,
                                left: width / 2 - 45,
                            }}
                            onLongPress={beginRecording}
                            onEndPress={endRecording}
                            onTap={takePhotoHandler}
                        />
                    </View>
                </Reanimated.View>
            </PinchGestureHandler>
            {showPicModal && (
                <View
                    style={{
                        ...styles.modal,
                        marginTop: insets.top,
                        aspectRatio: 9 / 16,
                    }}
                >
                    <ImageBackground
                        source={{ uri: pic }}
                        style={{
                            ...styles.takenImage,
                        }}
                    >
                        <HeaderX
                            color="white"
                            goBack={() => {
                                setShowPicture(false)
                                setPic('')
                            }}
                        />
                        <EditorBottomActions
                            onSave={savePictureLocallyHandler}
                            onUpload={uploadHandler}
                            checkMarkSet={checkMarkSet}
                            onPresentGalleries={() => {
                                bottomSheetRef.current?.handlePresentModalPress()
                            }}
                        />
                    </ImageBackground>
                </View>
            )}
            {showVideoModal && (
                <View
                    style={{
                        ...styles.modal,
                        marginTop: insets.top,
                    }}
                >
                    <Video
                        // ref={video}
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: 'black',
                                flex: 1,
                            },
                        ]}
                        source={{
                            uri: video.uri,
                        }}
                        resizeMode="contain"
                        isLooping
                        shouldPlay={true}
                        // onPlaybackStatusUpdate={(status) =>
                        //     setStatus(() => status)
                        // }
                    />
                    <View
                        style={{
                            paddingTop: 10,
                        }}
                    ></View>
                    <HeaderX
                        color="white"
                        goBack={() => {
                            setShowVideoModal(false)
                            setVideo('')
                        }}
                    />
                </View>
            )}
            {showPicModal || showVideoModal ? (
                <BottomSheet
                    ref={bottomSheetRef}
                    navigation={navigation}
                    base64Pic={picture64}
                    dismissModal={() => {
                        setShowPicture(false)
                    }}
                />
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    contentContainer: {
        position: 'absolute',
        aspectRatio: 9 / 16,
        right: 0,
        left: 0,
        paddingTop: 10,
    },
    camera: {
        flex: 1,
        flexDirection: 'row',
    },
    topLeftCont: {
        position: 'absolute',
        width: 45,
        top: 10,
        right: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(184,184,184,0.42)',
        alignItems: 'center',
        justifyContent: 'space-between',
        // flexDirection: 'row',
        padding: 5,
    },
    flipIcon: {
        marginVertical: 7,
        transform: [
            {
                rotate: '90deg',
            },
        ],
    },
    cameraSettingsButton: { marginVertical: 7 },
    modal: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        // bottom: 0,
        aspectRatio: 9 / 16,
    },
    takenImage: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    bottomCont: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 10,
    },
    bottomButtonsCont: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    floatingPlusCont: {
        bottom: 10,
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    loadingView: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        // marginLeft: 10,
        height: 40,
        width: 60,
        borderRadius: 20,
        backgroundColor: colors.lightTint,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default CameraScreen
