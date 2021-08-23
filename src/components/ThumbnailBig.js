import React, { useCallback, useMemo } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Pressable,
    Platform,
} from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    withDelay,
    useAnimatedStyle,
    Extrapolate,
    interpolate,
    useAnimatedGestureHandler,
    cancelAnimation,
} from 'react-native-reanimated'
import { PinchGestureHandler } from 'react-native-gesture-handler'

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)

// expo blurview
import { BlurView, VibrancyView } from '@react-native-community/blur'

//colors
import colors from '../constants/colors'

//custom  component
import Heart from '../components/Heart'

//dimensions
const { width, height } = Dimensions.get('window')

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//fast image
import FastImage from 'react-native-fast-image'

const ThumbnailBig = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    //isAndroid
    const isAndroid = useMemo(() => {
        if (Platform.OS === 'android') {
            return true
        } else {
            return false
        }
    }, [])

    //----------------------------------------------------------------ROW HEIGHT CALCS----------------------------------------------------------------
    const rowHeightAdjusted = useMemo(() => {
        const calcHeight = height - 40 - insets.top - insets.bottom - 70 - 30
        return +calcHeight.toFixed(0)
    }, [])
    const rowWidthAdjust = useMemo(() => (rowHeightAdjusted * 9) / 16, [])
    //----------------------------------------------------------------ROW HEIGHT CALCS----------------------------------------------------------------

    //----------------------------------------------------------------HIDE ACTIONS ANIMATION----------------------------------------------------------------

    const animatedOpacity = useSharedValue(1)

    const bigContStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity.value,
        }
    })

    const hideActions = useCallback(() => {
        if (animatedOpacity.value === 1) {
            animatedOpacity.value = withTiming(0, { duration: 200 })
        } else {
            animatedOpacity.value = withTiming(1, { duration: 200 })
        }
    }, [])
    //----------------------------------------------------------------HIDE ACTIONS ANIMATION----------------------------------------------------------------

    //----------------------------------------------------------------LOADING LOGIC----------------------------------------------------------------
    const animatedOpacity2 = useSharedValue(1)

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity2.value,
        }
    })

    const startOpacity2Anim = useCallback(() => {
        animatedOpacity2.value = withTiming(0, { duration: 100 })
    }, [])

    const onLoad = useCallback(() => {
        startOpacity2Anim()
    }, [])
    //----------------------------------------------------------------LOADING LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------PINCH GESTURE HANDLER----------------------------------------------------------------
    const scale = useSharedValue(1)
    const focalX = useSharedValue(0)
    const focalY = useSharedValue(0)

    const pinchHandler = useAnimatedGestureHandler({
        onActive: (event) => {
            animatedOpacity.value = withTiming(0, { duration: 200 })
            scale.value = interpolate(
                event.scale,
                [0, 1],
                [0.5, 1],
                Extrapolate.clamp
            )
            focalX.value = event.focalY
            focalY.value = event.focalX
        },
        onEnd: () => {
            scale.value = withTiming(1, { duration: 200 })
            animatedOpacity.value = withDelay(
                100,
                withTiming(1, { duration: 400 })
            )
        },
    })

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: -focalX.value },
                { translateY: focalY.value },
                { translateX: width / 2 },
                { translateY: -height / 2 },
                { scale: scale.value },
                { translateX: focalX.value },
                { translateY: -focalY.value },
                { translateX: -width / 2 },
                { translateY: height / 2 },
            ],
        }
    })

    //----------------------------------------------------------------PINCH GESTURE HANDLER----------------------------------------------------------------

    return (
        <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.View
                style={{
                    height: rowHeightAdjusted,
                    width: rowWidthAdjust,
                }}
            >
                <Pressable
                    style={{ ...styles.pressable, width: rowHeightAdjusted }}
                    onPress={hideActions}
                >
                    <View
                        style={{
                            ...styles.rotatorCont,
                            height: rowHeightAdjusted,
                            width: rowWidthAdjust,
                        }}
                    >
                        <AnimatedFastImage
                            style={[styles.image, rStyle]}
                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                                uri: `${props.images.fullPath}`,
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable,
                            }}
                            onLoad={onLoad}
                        />

                        <Animated.View
                            style={[StyleSheet.absoluteFill, opacityStyle]}
                        >
                            <FastImage
                                style={[styles.image, StyleSheet.absoluteFill]}
                                source={{
                                    uri: `${props.images.thumbPath}`,
                                    priority: FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable,
                                }}
                                resizeMode="cover"
                            />
                        </Animated.View>
                        <Animated.View style={[styles.wholeCont, bigContStyle]}>
                            <View style={styles.actionBar}>
                                {isAndroid ? (
                                    <View style={styles.androidActionBar} />
                                ) : (
                                    <BlurView
                                        style={styles.blurView}
                                        blurType={
                                            Platform.OS === 'android'
                                                ? 'light'
                                                : 'light'
                                        }
                                        blurAmount={13}
                                        reducedTransparencyFallbackColor="white"
                                    />
                                )}
                            </View>

                            <Ionicons
                                name="ellipsis-horizontal"
                                size={25}
                                color={colors.darkestColorP1}
                                onPress={props.oneEllipsisPressed}
                                style={styles.deleteIcon}
                            />
                            <Heart style={styles.heartIcon} />
                            <Text style={styles.likes}>500</Text>
                            <EvilIcons
                                name="comment"
                                size={41}
                                color={colors.darkestColorP1}
                                onPress={props.onCommentPressed}
                                style={styles.commentIcon}
                            />
                            <Text style={styles.comments}>12</Text>
                        </Animated.View>
                    </View>
                </Pressable>
            </Animated.View>
        </PinchGestureHandler>
    )
}

const styles = StyleSheet.create({
    pressable: {
        height: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rotatorCont: {
        transform: [
            {
                rotate: '90deg',
            },
        ],
    },
    image: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        flex: 1,
        padding: 20,
        alignItems: 'center',
        borderRadius: 17,
        overflow: 'hidden',
        // aspectRatio: 9 / 16,
    },
    wholeCont: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
        overflow: 'hidden',
    },
    actionBar: {
        height: 60,
        position: 'absolute',
        bottom: 15,
        width: '100%',
        borderRadius: 13,
        overflow: 'hidden',
    },
    blurView: {
        flex: 1,
    },
    androidActionBar: {
        backgroundColor: colors.backgroundBlurLight,
        flex: 1,
        overflow: 'hidden',
    },
    deleteIcon: {
        position: 'absolute',
        right: 30,
        bottom: 30,
    },
    heartIcon: {
        position: 'absolute',
        left: 30,
        bottom: 20,
    },
    likes: {
        position: 'absolute',
        left: 65,
        bottom: 33,
        fontSize: 19,
    },
    commentIcon: {
        position: 'absolute',
        left: 120,
        bottom: 29,
    },
    comments: {
        position: 'absolute',
        left: 163,
        bottom: 33,
        fontSize: 19,
    },
})

export default ThumbnailBig
