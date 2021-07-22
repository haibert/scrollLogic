import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Alert,
    Linking,
} from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    Extrapolate,
    interpolate,
    runOnJS,
} from 'react-native-reanimated'
import { snapPoint } from 'react-native-redash'
import { PanGestureHandler } from 'react-native-gesture-handler'

//custom components
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderX from '../../components/HeaderX'

//colors
import colors from '../../constants/colors'

//dimensions
const { width, height } = Dimensions.get('window')

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//image picker
import * as ImagePicker from 'expo-image-picker'

// expo image manipulator
import * as ImageManipulator from 'expo-image-manipulator'

//redux
import { changeAvatar } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//fast image
import FastImage from 'react-native-fast-image'

const PhotoEditScreen = ({ route, ...props }) => {
    //picture source
    const picSource = useSelector(
        (state) => state.signupReducer.userInfo.avatarFullPath
    )

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    //----------------------------------------------------------------PERMISSION LOGIC----------------------------------------------------------------

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
            'We need access to your photos to be able to upload a profile picture'
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

    const askForPermission = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()

        //     if (status !== 'granted') {
        //     alert('Sorry, we need camera roll permissions to make this work!')
        //     return false
        // } else {
        //     return true
        // }

        if (status === 'granted') {
            return true
        } else if (status === 'undetermined') {
            const results =
                await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (results.status === 'granted') {
                return true
            } else if (results.status === 'denied') {
                sendUserToSettingsHandler()
                return false
            }
        } else if (status || audioResults.status === 'denied') {
            const results2 =
                await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (results2.status === 'granted') {
                return true
            } else {
                sendUserToSettingsHandler()
                return false
            }
        }
    }
    //----------------------------------------------------------------PERMISSION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------EDIT PRESSED----------------------------------------------------------------
    const [chosenImage, setChosenImage] = useState(null)
    const editPressedHandler = async () => {
        const havePermission = await askForPermission()

        if (havePermission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: Platform.OS === 'ios' ? 0 : 1,
                base64: true,
            })

            if (!result.cancelled) {
                //then create compressed version to save.
                const compressedPhoto = await ImageManipulator.manipulateAsync(
                    result.uri,
                    [{ resize: { height: 500 } }],
                    {
                        compress: Platform.OS === 'ios' ? 0.2 : 0.5,
                        format: 'jpeg',
                        base64: true,
                    }
                )
                await dispatch(
                    changeAvatar(`data:image/jpeg;base64,${result.base64}`)
                )
                setChosenImage(compressedPhoto.uri)
            }
        }
    }
    //----------------------------------------------------------------EDIT PRESSED----------------------------------------------------------------

    //----------------------------------------------------------------PAN ANIMATION LOGIC----------------------------------------------------------------
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const isGestureActive = useSharedValue(false)

    function timeToClose() {
        props.navigation.goBack()
    }
    function closePage() {
        'worklet'
        runOnJS(timeToClose)()
    }
    const onGestureEvent = useAnimatedGestureHandler({
        onStart: ({ translationY }) => {
            isGestureActive.value = true
        },
        onActive: ({ translationX, translationY }) => {
            translateX.value = translationX
            translateY.value = translationY
        },
        onEnd: ({ velocityX, velocityY }) => {
            const goBack =
                snapPoint(translateY.value, velocityY, [
                    0,
                    height - height / 2,
                ]) ===
                height - height / 2
            if (goBack) {
                closePage()
            } else {
                translateX.value = withTiming(0, { duration: 100 })
                translateY.value = withTiming(0, { duration: 100 })
            }
            isGestureActive.value = false
        },
    })
    const panGestureStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            translateY.value,
            [0, height],
            [1, 0.62],
            Extrapolate.CLAMP
        )
        return {
            flex: 1,
            borderRadius: withTiming(isGestureActive.value ? 30 : 0, {
                duration: 200,
            }),
            transform: [
                {
                    translateX: translateX.value * scale,
                },
                {
                    translateY: translateY.value * scale,
                },
                {
                    scale,
                },
            ],
        }
    })
    //--------------------------------------------------------------PAN ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = () => {
        const imageString = chosenImage ? `${chosenImage}` : `${picSource}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return normalizedSource
    }
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            // activeOffsetY={5}
            // failOffsetY={-5}
        >
            <Animated.View
                style={[
                    { flex: 1, backgroundColor: 'white', overflow: 'hidden' },
                    panGestureStyle,
                ]}
            >
                <ScreenWrapper style={{ paddingBottom: insets.bottom }}>
                    <HeaderX
                        circleColor={{ backgroundColor: 'white' }}
                        color={colors.darkestColorP1}
                        goBack={() => {
                            props.navigation.goBack()
                        }}
                    />
                    <View style={styles.screenCont}>
                        <SharedElement id={'1'}>
                            <FastImage
                                resizeMode={FastImage.resizeMode.cover}
                                source={{
                                    uri: chosenImage
                                        ? chosenImage
                                        : normalizedSource(),
                                    priority: FastImage.priority.normal,
                                }}
                                style={styles.image}
                            />
                        </SharedElement>
                    </View>

                    <TouchableOpacity
                        style={styles.editCont}
                        onPress={editPressedHandler}
                    >
                        <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                </ScreenWrapper>
            </Animated.View>
        </PanGestureHandler>
    )
}

const styles = StyleSheet.create({
    screenCont: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    image: {
        width: width - 60,
        height: width - 60,
        borderRadius: width - 60 / 2,
    },
    editCont: {
        marginLeft: 20,
        marginBottom: 10,
    },
    editButton: {
        fontSize: 20,
        fontWeight: 'bold',
    },
})

export default PhotoEditScreen
