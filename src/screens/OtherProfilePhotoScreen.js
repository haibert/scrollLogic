import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
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
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderX from '../components/HeaderX'

//colors
import colors from '../constants/colors'

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

const OtherProfilePhotoScreen = ({ route, ...props }) => {
    //picture source
    const profilePic = route.params?.profilePic

    //insets
    const insets = useSafeAreaInsets()

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
    return (
        <PanGestureHandler onGestureEvent={onGestureEvent}>
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
                    <View
                        style={{
                            ...styles.screenCont,
                        }}
                    >
                        <SharedElement id={'2'}>
                            <Image
                                source={{
                                    uri: profilePic,
                                }}
                                style={styles.image}
                            />
                        </SharedElement>
                    </View>
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

export default OtherProfilePhotoScreen
