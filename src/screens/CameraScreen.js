import React, { useState, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    ImageBackground,
    StatusBar,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//expo camera
import { Camera } from 'expo-camera'

//custom components
import HeaderX from '../components/HeaderX'
import Button from '../components/Button'

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

const { height, width } = Dimensions.get('screen')

const CameraScreen = (props) => {
    const [type, setType] = useState(Camera.Constants.Type.back)
    const insets = useSafeAreaInsets()

    const [pic, setPic] = useState(null)

    const [showModal, setShowModal] = useState(false)

    const cameraRef = useRef()

    const dispatch = useDispatch()

    // const picTaken = useSelector((state) => state.cameraReducer.pictureUri)
    // console.log(
    //     '🚀 ~ file: CameraScreen.js ~ line 36 ~ CameraScreen ~ picTaken',
    //     picTaken
    // )
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
            console.log('Open settings and give permissin')
        }
    }

    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="blue" transparent={false} hidden /> */}
            <Camera
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    flex: 1,
                    borderWidth: 1,
                }}
                ref={cameraRef}
                type={type}
            >
                {/* <StatusBar
                    translucent
                    backgroundColor={backgroundColor}
                    {...props}
                /> */}
                <View style={styles.cameraInner}>
                    <View style={styles.topLeftCont}>
                        {/* <TouchableOpacity
                            onPress={flipCameraHandler}
                        > */}
                        <Entypo
                            name="loop"
                            size={30}
                            color="white"
                            style={styles.flipIcon}
                            onPress={flipCameraHandler}
                        />
                        {/* </TouchableOpacity> */}
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
                            <View style={styles.bigPlusButton}>
                                <Icon
                                    name="camera-outline"
                                    type="material-community"
                                    size={30}
                                    color="white"
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Camera>
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
    camera: {
        flex: 1,
        flexDirection: 'row',
    },
    cameraInner: {
        flex: 1,
    },
    topLeftCont: {
        position: 'absolute',
        width: 50,
        top: 0,
        right: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(184,184,184,0.42)',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 5,
    },
    flipIcon: {
        transform: [
            {
                rotate: '90deg',
            },
        ],
    },
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
        borderWidth: 4,
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingPlusCont: {
        bottom: 23,
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        // overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        elevation: 10,
    },
})

export default CameraScreen
