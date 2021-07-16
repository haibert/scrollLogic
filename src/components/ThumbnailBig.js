import React, { useRef, useCallback, useMemo } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ImageBackground,
    Pressable,
    Image,
    ActivityIndicator,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
} from 'react-native-reanimated'

// expo blurview
import { BlurView } from 'expo-blur'

//colors
import colors from '../constants/colors'

//custom  component
import Heart from '../components/Heart'

const { width, height } = Dimensions.get('window')

const CELL_WIDTH = width / 2

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//custom components
import CachedImage from '../components/CachedImage'

//fast image
import FastImage from 'react-native-fast-image'

const ThumbnailBig = (props) => {
    const insets = useSafeAreaInsets()

    //----------------------------------------------------------------ROW HEIGHT CALCS----------------------------------------------------------------
    const rowHeightAdjusted = useMemo(() => {
        const calcHeight = height - 40 - insets.top - insets.bottom - 70 - 30
        return +calcHeight.toFixed(0)
    })
    const rowWidthAdjust = useMemo(() => (rowHeightAdjusted * 9) / 16)
    //----------------------------------------------------------------ROW HEIGHT CALCS----------------------------------------------------------------

    //----------------------------------------------------------------DELETE ANIMATION LOGIC----------------------------------------------------------------
    const animatedHight = useSharedValue(colors.rowHeight)

    const deleteStyle = useAnimatedStyle(() => {
        return {
            height: animatedHight.value,
            width: '100%',
        }
    })

    const startDeleteAnimation = () => {
        animatedHight.value = withTiming(0, { duration: 300 })
    }
    // const animatedScaleStyle = useAnimatedStyle(() => {
    //     return {
    //         transform: [
    //             {
    //                 scale: props.animatedValue,
    //             },
    //         ],
    //     }
    // })
    //----------------------------------------------------------------DELETE ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------HIDE ACTIONS ANIMATION----------------------------------------------------------------

    const animatedOpacity = useSharedValue(1)

    const bigContStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity.value,
        }
    })

    const startOpacityAnim = useCallback(() => {
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
        animatedOpacity2.value = withTiming(0, { duration: 200 })
    }, [])

    const onLoad = useCallback(() => {
        startOpacity2Anim()
    }, [])
    //----------------------------------------------------------------LOADING LOGIC----------------------------------------------------------------

    return (
        <Pressable
            style={{ ...styles.pressable, width: rowHeightAdjusted }}
            onPress={startOpacityAnim}
        >
            <View
                style={{
                    height: rowHeightAdjusted,
                    width: rowWidthAdjust,
                    transform: [
                        {
                            rotate: '90deg',
                        },
                    ],
                }}
            >
                {/* <ImageBackground
                    style={styles.image}
                    source={{
                        uri: props.images.fullPath,
                    }}
                    // onLoadStart={onLoadStart}
                    onLoad={onLoad}
                /> */}

                {/* <CachedImage
                    style={styles.image}
                    resizeMode="cover"
                    source={{
                        uri: `${props.images.fullPath}`,
                    }}
                    cacheKey={`${props.images.id}t`}
                    onLoad={onLoad}
                /> */}

                <FastImage
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                        uri: `${props.images.fullPath}`,
                        // headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                    }}
                    onLoad={onLoad}
                />
                <Animated.View style={[StyleSheet.absoluteFill, opacityStyle]}>
                    <FastImage
                        style={[styles.image, StyleSheet.absoluteFill]}
                        source={{
                            uri: `${props.images.thumbPath}`,
                            // headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        resizeMode="cover"
                    />
                </Animated.View>
                <Animated.View style={[styles.wholeCont, bigContStyle]}>
                    <ImageBackground
                        style={styles.actionBar}
                        blurRadius={100}
                        source={require('../../assets/AndroidTransparentPngBLUR.png')}
                        resizeMode="stretch"
                    />

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
    )
}

const styles = StyleSheet.create({
    pressable: {
        height: width,
        alignItems: 'center',
        justifyContent: 'center',
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
        backgroundColor: colors.backgroundBlurLight,
        position: 'absolute',
        bottom: 15,
        width: '100%',
        borderRadius: 13,
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

export default React.memo(ThumbnailBig)
