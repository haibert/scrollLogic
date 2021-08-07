// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
// import {
//     View,
//     StyleSheet,
//     Text,
//     Dimensions,
//     ImageBackground,
//     BackHandler,
//     Alert,
//     Linking,
// } from 'react-native'

// //expo AV
// import { Video, AVPlaybackStatus } from 'expo-av'

// //custom components
// import HeaderX from '../components/HeaderX'
// import CameraButton from '../components/CameraButton'
// import EditorBottomActions from '../components/CameraComponents/EditorBottomActions'
// import BottomSheet from '../components/CameraComponents/BottomSheet'
// import ScreenWrapper from '../components/ScreenWrapper'

// //ionicons
// import {
//     Entypo,
//     Ionicons as IonIcon,
//     MaterialIcons as MaterialIcon,
// } from '@expo/vector-icons'
// import { Icon } from 'react-native-elements'

// //colors
// import colors from '../constants/colors'

// //safe area
// import { useSafeAreaInsets } from 'react-native-safe-area-context'

// //redux
// import {
//     takePicture,
//     addToGallery,
//     setCameraUp,
//     setPics,
// } from '../store/camera/actions'

// import { shouldRefreshSet } from '../store/event/action'
// import { useDispatch, useSelector } from 'react-redux'

// // MediaLibrary
// import * as MediaLibrary from 'expo-media-library'

// //gesture handlers
// import {
//     PinchGestureHandler,
//     TapGestureHandler,
//     TapGestureHandler,
// } from 'react-native-gesture-handler'
// import Reanimated, {
//     Extrapolate,
//     interpolate,
//     useAnimatedGestureHandler,
//     useAnimatedProps,
//     useSharedValue,
//     useAnimatedStyle,
//     runOnJS,
//     runOnUI,
//     useAnimatedRef,
//     withTiming,
// } from 'react-native-reanimated'
// import { sortFormats } from 'react-native-vision-camera'
// import { Camera, frameRateIncluded } from 'react-native-vision-camera'
// import {
//     CONTENT_SPACING,
//     MAX_ZOOM_FACTOR,
//     SAFE_AREA_PADDING,
// } from '../components/VisionCamera/Constants'
// import { StatusBarBlurBackground } from '../components/VisionCamera/StatusBarBlurBackground'
// import { CaptureButton } from '../components/VisionCamera/CaptureButton'
// import { TouchableOpacity as PressableOpacity } from 'react-native'
// const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
// Reanimated.addWhitelistedNativeProps({
//     zoom: true,
// })

// //nav 5
// import { useFocusEffect, useIsFocused } from '@react-navigation/native'
// import { InteractionManager } from 'react-native'

// //status bar
// import { StatusBar } from 'expo-status-bar'

// // expo image manipulator
// import * as ImageManipulator from 'expo-image-manipulator'

// // expo view shot
// import ViewShot, { captureRef } from 'react-native-view-shot'

// //expo constatns
// import Constants from 'expo-constants'

// //custom hooks
// import { useIsForeground } from '../hooks/useIsForeground'

// const { height, width } = Dimensions.get('window')

// const SCALE_FULL_ZOOM = 3
// const BUTTON_SIZE = 40

// const VisionCameraScreen = ({ navigation, route }) => {
//     let checkMarkSet = useRef(route.params?.checkMarkSet).current
//     console.log(
//         '🚀 ~ file: CameraScreen.js ~ line 69 ~ CameraScreen ~ checkMarkSet',
//         checkMarkSet
//     )
//     const galleryIDPassed = useRef(route.params?.galleryID).current
//     const newGalleryID = useRef(route.params?.newGalleryID).current

//     //----------------------------------------------------------------BOTTOM SHEET----------------------------------------------------------------
//     const [picture64, setPicture64] = useState()

//     const bottomSheetRef = useRef()
//     //----------------------------------------------------------------BOTTOM SHEET----------------------------------------------------------------

//     const [video, setVideo] = useState('')
//     const [showVideoModal, setShowVideoModal] = useState(false)

//     //insets
//     const insets = useSafeAreaInsets()

//     const [pic, setPic] = useState(null)

//     const [showPicModal, setShowPicture] = useState(false)

//     // const cameraRef = useRef()

//     const cameraRef = useAnimatedRef()

//     const dispatch = useDispatch()

//     // const picTaken = useSelector((state) => state.cameraReducer.pictureUri)
//     // console.log(
//     //     '🚀 ~ file: CameraScreen.js ~ line 36 ~ CameraScreen ~ picTaken',
//     //     picTaken
//     // )
//     //----------------------------------------------------------------TAKE PICTURE----------------------------------------------------------------
//     const takePictureHandler = useCallback(async () => {
//         try {
//             if (cameraRef.current) {
//                 const options = {
//                     quality: 0,
//                     base64: true,
//                     skipProcessing: true,
//                 }
//                 let photo = await cameraRef.current.takePictureAsync(options)
//                 // console.log(
//                 //     '🚀 ~ file: CameraScreen.js ~ line 231 ~ takePictureHandler ~ photo.height',
//                 //     photo.height
//                 // )
//                 // set photo uri for upload function to be able to use, then show photo
//                 const resizedPhoto = await ImageManipulator.manipulateAsync(
//                     photo.uri,
//                     [{ resize: { height: 1100 } }],
//                     { compress: 1, format: 'jpeg', base64: true }
//                 )
//                 //then create smaller version to save.
//                 await dispatch(
//                     takePicture(resizedPhoto.uri, resizedPhoto.base64)
//                 )
//                 setPic(photo.uri)
//                 setShowPicture(true)
//             }
//         } catch (err) {
//             console.log(err)
//         }
//     }, [])

//     //----------------------------------------------------------------TAKE PICTURE----------------------------------------------------------------
//     //----------------------------------------------------------------SCREEN SHOTTING----------------------------------------------------------------
//     const screenShotRef = useRef()

//     const takeScreenShotHandler = async () => {
//         const photoURI = await captureRef(screenShotRef, {
//             format: 'jpg',
//             quality: 1,
//         })
//         const base64 = await captureRef(screenShotRef, {
//             format: 'jpg',
//             quality: 1,
//             result: 'base64',
//         })

//         await dispatch(takePicture(photoURI, base64))
//         setPic(photoURI)
//         setShowPicture(true)
//     }

//     //----------------------------------------------------------------SCREEN SHOTTING----------------------------------------------------------------
//     //----------------------------------------------------------------UPLOAD PICTURE----------------------------------------------------------------
//     const uploadPhotoHandler = useCallback(async () => {
//         console.log('iOS upload Ran')
//         const resizedPhoto = await ImageManipulator.manipulateAsync(
//             pic,
//             [{ resize: { height: 1100 } }],
//             { compress: 0.5, format: 'jpeg', base64: true }
//         )

//         try {
//             await dispatch(shouldRefreshSet(true))
//             dispatch(
//                 addToGallery(
//                     `data:image/jpeg;base64,${resizedPhoto.base64}`,
//                     newGalleryID ? [`${newGalleryID}`] : [galleryIDPassed]
//                 )
//             )
//             setShowPicture(false)
//         } catch (err) {}
//     }, [showPicModal])

//     const screenShotBase64 = useSelector(
//         (state) => state.cameraReducer.pictureBase64
//     )

//     const uploadScreenShotHandler = useCallback(async () => {
//         console.log('android upload fired')
//         try {
//             await dispatch(shouldRefreshSet(true))
//             dispatch(
//                 addToGallery(
//                     `data:image/jpeg;base64,${screenShotBase64}`,
//                     newGalleryID ? [`${newGalleryID}`] : [galleryIDPassed]
//                 )
//             )

//             setShowPicture(false)

//             // if (!newGalleryID) {
//             //     navigation.navigate('GalleryView', {
//             //         shouldRefresh: 'shouldRefresh',
//             //     })
//             // }
//         } catch (err) {}
//     }, [])
//     //----------------------------------------------------------------UPLOAD PICTURE----------------------------------------------------------------

//     //----------------------------------------------------------------SAVE PICTURE LOCALLY----------------------------------------------------------------
//     function sendUserToSettingsHandler() {
//         const alertMessage = 'EventShare Would Like to Access Your Photo'
//         Platform.OS === 'android' ? androidAlert() : IOSAlert()

//         function IOSAlert() {
//             Alert.alert(alertMessage, '', [
//                 {
//                     text: 'Cancel',
//                     style: 'cancel',
//                 },
//                 {
//                     text: 'Settings',
//                     onPress: () => {
//                         openSettings()
//                     },
//                 },
//             ])
//         }
//         function androidAlert() {
//             Alert.alert('', alertMessage, [
//                 {
//                     text: 'Cancel',
//                     style: 'cancel',
//                 },
//                 {
//                     text: 'Settings',
//                     onPress: () => {
//                         openSettings()
//                     },
//                 },
//             ])
//         }
//     }

//     function openSettings() {
//         Platform.OS === 'android'
//             ? Linking.openSettings()
//             : Linking.canOpenURL('app-settings:')
//                   .then((supported) => {
//                       if (!supported) {
//                           console.log("Can't handle settings url")
//                       } else {
//                           return Linking.openURL('app-settings:')
//                       }
//                   })
//                   .catch((err) => console.error('An error occurred', err))
//     }

//     async function savePictureLocallyHandler() {
//         const { status } = await MediaLibrary.getPermissionsAsync()

//         if (status === 'granted') {
//             const asset = await MediaLibrary.createAssetAsync(pic)
//             if (asset) {
//                 //display check mark showing it was saved.
//             }
//         }
//         if (status === 'undetermined') {
//             const results = await MediaLibrary.requestPermissionsAsync()
//             if (results.status === 'granted') {
//                 await MediaLibrary.createAssetAsync(pic)
//                 //show success
//             } else {
//                 sendUserToSettingsHandler()
//                 return
//             }
//         }
//         if (status === 'denied') {
//             const results = await MediaLibrary.requestPermissionsAsync()
//             if (results.status === 'granted') {
//                 await MediaLibrary.createAssetAsync(pic)
//                 //show success
//             } else {
//                 sendUserToSettingsHandler()
//                 return
//             }
//         }
//     }
//     //----------------------------------------------------------------SAVE PICTURE LOCALLY----------------------------------------------------------------

//     //----------------------------------------------------------------VIDEO RECORDING---------------------------------------------------------------------

//     const beginRecording = async () => {
//         console.log('got here')
//         let video = await cameraRef.current.recordAsync()
//         setVideo(video)
//         // dispatch(takePicture(photo.uri))
//     }
//     async function endRecording() {
//         cameraRef.current.stopRecording()
//         setShowVideoModal(true)
//     }
//     //----------------------------------------------------------------VIDEO RECORDING---------------------------------------------------------------------

//     //----------------------------------------------------------------PLATFORM SPECIFIC----------------------------------------------------------------

//     const uploadHandler = () => {
//         if (Platform.OS === 'android') {
//             return uploadScreenShotHandler()
//         } else {
//             return uploadPhotoHandler()
//         }
//     }

//     //----------------------------------------------------------------PLATFORM SPECIFIC----------------------------------------------------------------

//     //----------------------------------------------------------------NEW ADDED STUFF----------------------------------------------------------------
//     const camera = useRef(null)
//     const device = devices[cameraPosition]
//     const zoom = useSharedValue(0)
//     const isPressingButton = useSharedValue(false)
//     const [cameraPosition, setCameraPosition] = useState('back')
//     const [enableHdr, setEnableHdr] = useState(false)
//     const [flash, setFlash] = useState('off')
//     const [enableNightMode, setEnableNightMode] = useState(false)
//     const isFocussed = useIsFocused()
//     const isForeground = useIsForeground()
//     const isActive = isFocussed && isForeground
//     const [is60Fps, setIs60Fps] = useState(true)
//     const minZoom = device?.minZoom ?? 1
//     const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR)
//     const formats = useMemo(() => {
//         if (device?.formats == null) return []
//         return device.formats.sort(sortFormats)
//     }, [device?.formats])
//     const supportsCameraFlipping = useMemo(
//         () => devices.back != null && devices.front != null,
//         [devices.back, devices.front]
//     )
//     const supportsFlash = device?.hasFlash ?? false
//     const supportsHdr = useMemo(
//         () => formats.some((f) => f.supportsVideoHDR || f.supportsPhotoHDR),
//         [formats]
//     )
//     const supports60Fps = useMemo(
//         () =>
//             formats.some((f) =>
//                 f.frameRateRanges.some((rate) => frameRateIncluded(rate, 60))
//             ),
//         [formats]
//     )
//     const canToggleNightMode = enableNightMode
//         ? true // it's enabled so you have to be able to turn it off again
//         : (device?.supportsLowLightBoost ?? false) || fps > 30
//     const onPinchGesture = useAnimatedGestureHandler({
//         onStart: (_, context) => {
//             context.startZoom = zoom.value
//         },
//         onActive: (event, context) => {
//             // we're trying to map the scale gesture to a linear zoom here
//             const startZoom = context.startZoom ?? 0
//             const scale = interpolate(
//                 event.scale,
//                 [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
//                 [-1, 0, 1],
//                 Extrapolate.CLAMP
//             )
//             zoom.value = interpolate(
//                 scale,
//                 [-1, 0, 1],
//                 [minZoom, startZoom, maxZoom],
//                 Extrapolate.CLAMP
//             )
//         },
//     })
//     const onFlipCameraPressed = useCallback(() => {
//         setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))
//     }, [])

//     const onFlashPressed = useCallback(() => {
//         setFlash((f) => (f === 'off' ? 'on' : 'off'))
//     }, [])

//     const onDoubleTap = useCallback(() => {
//         onFlipCameraPressed()
//     }, [onFlipCameraPressed])

//     const fps = useMemo(() => {
//         if (!is60Fps) return 30

//         if (enableNightMode && !device?.supportsLowLightBoost) {
//             // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
//             return 30
//         }

//         const supportsHdrAt60Fps = formats.some(
//             (f) =>
//                 f.supportsVideoHDR &&
//                 f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
//         )
//         if (enableHdr && !supportsHdrAt60Fps) {
//             // User has enabled HDR, but HDR is not supported at 60 FPS.
//             return 30
//         }

//         const supports60Fps = formats.some((f) =>
//             f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
//         )
//         if (!supports60Fps) {
//             // 60 FPS is not supported by any format.
//             return 30
//         }
//         // If nothing blocks us from using it, we default to 60 FPS.
//         return 60
//     }, [
//         device?.supportsLowLightBoost,
//         enableHdr,
//         enableNightMode,
//         formats,
//         is60Fps,
//     ])

//     const onInitialized = useCallback(() => {
//         console.log('Camera initialized!')
//         setIsCameraInitialized(true)
//     }, [])

//     const onError = useCallback((error) => {
//         console.error(error)
//     }, [])

//     const cameraAnimatedProps = useAnimatedProps(() => {
//         const z = Math.max(Math.min(zoom.value, maxZoom), minZoom)
//         return {
//             zoom: z,
//         }
//     }, [maxZoom, minZoom, zoom])

//     const setIsPressingButton = useCallback(
//         (_isPressingButton) => {
//             isPressingButton.value = _isPressingButton
//         },
//         [isPressingButton]
//     )

//     const onMediaCaptured = useCallback(async (media, type) => {
//         console.log(`Media captured! ${JSON.stringify(media)}`)
//         // await Navigation.showModal({
//         //     component: {
//         //         name: 'MediaPage',
//         //         passProps: {
//         //             type: type,
//         //             path: media.path,
//         //         },
//         //     },
//         // })
//     }, [])

//     const neutralZoom = device?.neutralZoom ?? 1
//     useEffect(() => {
//         // Run every time the neutralZoomScaled value changes. (reset zoom when device changes)
//         zoom.value = neutralZoom
//     }, [neutralZoom, zoom])

//     if (device != null && format != null) {
//         console.log(
//             `Re-rendering camera page with ${
//                 isActive ? 'active' : 'inactive'
//             } camera. ` +
//                 `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`
//         )
//     } else {
//         console.log('re-rendering camera page without active camera')
//     }

//     return (
//         <ScreenWrapper style={styles.container}>
//             <StatusBar
//                 style="light"
//                 translucent
//                 backgroundColor="rgba(0,0,0,1)"
//             />
//             {device != null && (
//                 <PinchGestureHandler
//                     onGestureEvent={onPinchGesture}
//                     enabled={isActive}
//                 >
//                     <Reanimated.View style={StyleSheet.absoluteFill}>
//                         <TapGestureHandler
//                             onEnded={onDoubleTap}
//                             numberOfTaps={2}
//                         >
//                             <ReanimatedCamera
//                                 ref={camera}
//                                 style={StyleSheet.absoluteFill}
//                                 device={device}
//                                 format={format}
//                                 fps={fps}
//                                 hdr={enableHdr}
//                                 lowLightBoost={
//                                     device.supportsLowLightBoost &&
//                                     enableNightMode
//                                 }
//                                 isActive={isActive}
//                                 onInitialized={onInitialized}
//                                 onError={onError}
//                                 enableZoomGesture={false}
//                                 animatedProps={cameraAnimatedProps}
//                                 photo={true}
//                                 video={true}
//                                 audio={true}
//                             />
//                         </TapGestureHandler>
//                     </Reanimated.View>
//                 </PinchGestureHandler>
//             )}

//             <CaptureButton
//                 style={styles.captureButton}
//                 camera={camera}
//                 onMediaCaptured={onMediaCaptured}
//                 cameraZoom={zoom}
//                 minZoom={minZoom}
//                 maxZoom={maxZoom}
//                 flash={supportsFlash ? flash : 'off'}
//                 enabled={isCameraInitialized && isActive}
//                 setIsPressingButton={setIsPressingButton}
//             />

//             <StatusBarBlurBackground />

//             <View style={styles.rightButtonRow}>
//                 {supportsCameraFlipping && (
//                     <PressableOpacity
//                         style={styles.button}
//                         onPress={onFlipCameraPressed}
//                         disabledOpacity={0.4}
//                     >
//                         <IonIcon
//                             name="camera-reverse"
//                             color="white"
//                             size={24}
//                         />
//                     </PressableOpacity>
//                 )}
//                 {supportsFlash && (
//                     <PressableOpacity
//                         style={styles.button}
//                         onPress={onFlashPressed}
//                         disabledOpacity={0.4}
//                     >
//                         <IonIcon
//                             name={flash === 'on' ? 'flash' : 'flash-off'}
//                             color="white"
//                             size={24}
//                         />
//                     </PressableOpacity>
//                 )}
//                 {supports60Fps && (
//                     <PressableOpacity
//                         style={styles.button}
//                         onPress={() => setIs60Fps(!is60Fps)}
//                     >
//                         <Text style={styles.text}>
//                             {is60Fps ? '60' : '30'}
//                             {'\n'}FPS
//                         </Text>
//                     </PressableOpacity>
//                 )}
//                 {supportsHdr && (
//                     <PressableOpacity
//                         style={styles.button}
//                         onPress={() => setEnableHdr((h) => !h)}
//                     >
//                         <MaterialIcon
//                             name={enableHdr ? 'hdr' : 'hdr-off'}
//                             color="white"
//                             size={24}
//                         />
//                     </PressableOpacity>
//                 )}
//                 {canToggleNightMode && (
//                     <PressableOpacity
//                         style={styles.button}
//                         onPress={() => setEnableNightMode(!enableNightMode)}
//                         disabledOpacity={0.4}
//                     >
//                         <IonIcon
//                             name={enableNightMode ? 'moon' : 'moon-outline'}
//                             color="white"
//                             size={24}
//                         />
//                     </PressableOpacity>
//                 )}
//             </View>
//             {showPicModal && (
//                 <View
//                     style={{
//                         ...styles.modal,
//                         marginTop: insets.top,
//                         aspectRatio: 9 / 16,
//                     }}
//                 >
//                     <ImageBackground
//                         source={{ uri: pic }}
//                         style={{
//                             ...styles.takenImage,
//                         }}
//                     >
//                         <HeaderX
//                             color="white"
//                             goBack={() => {
//                                 setShowPicture(false)
//                                 setPic('')
//                             }}
//                         />
//                         <EditorBottomActions
//                             onSave={savePictureLocallyHandler}
//                             onUpload={uploadHandler}
//                             checkMarkSet={checkMarkSet}
//                             onPresentGalleries={() => {
//                                 bottomSheetRef.current?.handlePresentModalPress()
//                             }}
//                         />
//                     </ImageBackground>
//                 </View>
//             )}
//             {showVideoModal && (
//                 <View
//                     style={{
//                         ...styles.modal,
//                         marginTop: insets.top,
//                     }}
//                 >
//                     <Video
//                         // ref={video}
//                         style={[
//                             StyleSheet.absoluteFill,
//                             {
//                                 backgroundColor: 'black',
//                                 flex: 1,
//                             },
//                         ]}
//                         source={{
//                             uri: video.uri,
//                         }}
//                         resizeMode="contain"
//                         isLooping
//                         shouldPlay={true}
//                         // onPlaybackStatusUpdate={(status) =>
//                         //     setStatus(() => status)
//                         // }
//                     />
//                     <View
//                         style={{
//                             paddingTop: 10,
//                         }}
//                     ></View>
//                     <HeaderX
//                         color="white"
//                         goBack={() => {
//                             setShowVideoModal(false)
//                             setVideo('')
//                         }}
//                     />
//                 </View>
//             )}
//             {showPicModal || showVideoModal ? (
//                 <BottomSheet
//                     ref={bottomSheetRef}
//                     navigation={navigation}
//                     base64Pic={picture64}
//                     dismissModal={() => {
//                         setShowPicture(false)
//                     }}
//                 />
//             ) : null}
//         </ScreenWrapper>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'flex-start',
//     },
//     contentContainer: {
//         position: 'absolute',
//         aspectRatio: 9 / 16,
//         right: 0,
//         left: 0,
//         paddingTop: 10,
//     },
//     camera: {
//         flex: 1,
//         flexDirection: 'row',
//     },
//     topLeftCont: {
//         position: 'absolute',
//         width: 45,
//         top: 10,
//         right: 10,
//         borderRadius: 20,
//         backgroundColor: 'rgba(184,184,184,0.42)',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         // flexDirection: 'row',
//         padding: 5,
//     },
//     flipIcon: {
//         marginVertical: 7,
//         transform: [
//             {
//                 rotate: '90deg',
//             },
//         ],
//     },
//     cameraSettingsButton: { marginVertical: 7 },
//     modal: {
//         flex: 1,
//         position: 'absolute',
//         top: 0,
//         right: 0,
//         left: 0,
//         // bottom: 0,
//         aspectRatio: 9 / 16,
//     },
//     takenImage: {
//         flex: 1,
//         justifyContent: 'space-between',
//         paddingTop: 10,
//     },
//     bottomCont: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         padding: 10,
//     },
//     bottomButtonsCont: {
//         width: '100%',
//         justifyContent: 'space-between',
//         flexDirection: 'row',
//         paddingHorizontal: 5,
//     },
//     floatingPlusCont: {
//         bottom: 10,
//         position: 'absolute',
//         width: 90,
//         height: 90,
//         borderRadius: 45,
//     },
//     loadingView: {
//         backgroundColor: 'rgba(0,0,0,0.4)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     circle: {
//         // marginLeft: 10,
//         height: 40,
//         width: 60,
//         borderRadius: 20,
//         backgroundColor: colors.lightTint,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },

//     //new styles
//     container2: {
//         flex: 1,
//         backgroundColor: 'black',
//     },
//     captureButton: {
//         position: 'absolute',
//         alignSelf: 'center',
//         bottom: SAFE_AREA_PADDING.paddingBottom,
//     },
//     button: {
//         marginBottom: CONTENT_SPACING,
//         width: BUTTON_SIZE,
//         height: BUTTON_SIZE,
//         borderRadius: BUTTON_SIZE / 2,
//         backgroundColor: 'rgba(140, 140, 140, 0.3)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     rightButtonRow: {
//         position: 'absolute',
//         right: SAFE_AREA_PADDING.paddingRight,
//         top: SAFE_AREA_PADDING.paddingTop,
//     },
//     text: {
//         color: 'white',
//         fontSize: 11,
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
// })

// export default VisionCameraScreen
