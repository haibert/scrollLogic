import React, { useState, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    ImageBackground,
    Animated,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//expo camera
import { Camera } from 'expo-camera'

//custom components
import HeaderX from '../components/HeaderX'

//ionicons
import { Entypo, Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'
//ionicons

//colors
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//redux
import { takePicture } from '../store/camera/actions'
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
} from 'react-native-reanimated'

const { height, width } = Dimensions.get('screen')

const CameraScreen = (props) => {
    const [type, setType] = useState(Camera.Constants.Type.back)
    const insets = useSafeAreaInsets()

    const [pic, setPic] = useState(null)

    const [showModal, setShowModal] = useState(false)

    const cameraRef = useRef()

    const dispatch = useDispatch()

    const [zooming, setZooming] = useState(0)

    //camera settings
    const [flashMode, setFlashMode] = useState('off')

    // const picTaken = useSelector((state) => state.cameraReducer.pictureUri)
    // console.log(
    //     '🚀 ~ file: CameraScreen.js ~ line 36 ~ CameraScreen ~ picTaken',
    //     picTaken
    // )

    // camera Functions
    async function takePictureHandler() {
        try {
            if (cameraRef.current) {
                const options = {
                    quality: 0.5,
                    base64: true,
                    skipProcessing: true,
                }
                let photo = await cameraRef.current.takePictureAsync(options)
                setPic(photo.uri)
                dispatch(takePicture(photo.uri))
                setShowModal(true)
            }
        } catch (err) {
            console.log(err)
        }

        // setPickedImage(image.uri)
        // props.onImageTaken(image.uri)
    }

    function flipCameraHandler() {
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

    async function savePictureLocallyHandler(localUri) {
        const { status } = await MediaLibrary.getPermissionsAsync()
        if (status === 'undetermined') {
            const { status } = await MediaLibrary.requestPermissionsAsync()
            if (status === 'granted') {
                const asset = await MediaLibrary.createAssetAsync(localUri)
            }
        }

        if (status === 'granted') {
            const asset = await MediaLibrary.createAssetAsync(localUri)
            if (asset) {
                //display check mark showing it was saved.
            }
        }

        if (status === 'denied') {
            console.log('Open settings and give permission')
        }
    }

    // zoom gesture handler
    const zoom = useSharedValue(0)
    const MAX_ZOOM_FACTOR = 20
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

    return (
        <View style={styles.container}>
            <PinchGestureHandler onGestureEvent={onPinchGesture}>
                <Reanimated.View style={StyleSheet.absoluteFill}>
                    <Camera
                        style={{
                            flex: 1,
                        }}
                        ref={cameraRef}
                        type={type}
                        flashMode={flashMode}
                        zoom={zooming}
                    >
                        <View
                            style={[
                                styles.contentContainer,
                                {
                                    paddingTop: insets.top,
                                    paddingBottom: insets.bottom,
                                    top: insets.top,
                                    bottom: insets.bottom,
                                },
                            ]}
                        >
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
                            <View
                                style={{
                                    ...styles.floatingPlusCont,
                                    left: width / 2 - 40,
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={takePictureHandler}
                                >
                                    <View style={styles.bigPlusButton}></View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Camera>
                </Reanimated.View>
            </PinchGestureHandler>

            <Modal visible={showModal} transparent animationType="none">
                <View style={styles.modal}>
                    <ImageBackground
                        source={{ uri: pic }}
                        resizeMode="cover"
                        style={styles.takenImage}
                    >
                        <View
                            style={{
                                paddingTop: insets.top,
                                paddingBottom: insets.bottom,
                                flex: 1,
                                borderWidth: 1,
                            }}
                        >
                            <HeaderX
                                color="white"
                                goBack={() => {
                                    setShowModal(false)
                                }}
                            />
                            <View style={styles.bottomCont}>
                                <View style={styles.bottomButtonsCont}>
                                    <Ionicons
                                        name="download-outline"
                                        size={30}
                                        color="white"
                                        onPress={() => {
                                            savePictureLocallyHandler(pic)
                                        }}
                                    />
                                    <Icon
                                        name="upload"
                                        type="feather"
                                        size={30}
                                        color="white"
                                    />
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        borderWidth: 1,
        position: 'absolute',
        right: 0,
        left: 0,
        borderWidth: 0,
    },
    camera: {
        flex: 1,
        flexDirection: 'row',
    },

    topLeftCont: {
        position: 'absolute',
        width: 45,
        top: 0,
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
    },
    takenImage: { flex: 1 },
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
    bigPlusButton: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 7,
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowRadius: 6,
        shadowOpacity: 0.1,
        // backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
    },
    floatingPlusCont: {
        bottom: 23,
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        // overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        elevation: 1,
    },
})

export default CameraScreen
