import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Platform,
} from 'react-native'
//shared elements
import { SharedElement } from 'react-navigation-shared-element'
import { FlatList, PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    runOnJS,
    Extrapolate,
    interpolate,
} from 'react-native-reanimated'
import { snapPoint } from 'react-native-redash'

//custom components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import ThumbnailSmall from '../components/ThumbnailSmall'

//hooks
import useDidMountEffect from '../hooks/useDidMountEffect'

//useFocus
import { useFocusEffect } from '@react-navigation/native'

//constants
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//dummy data
import images from '../data/images'

//redux
import { setPics } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

const GalleryView = ({ route, navigation }) => {
    const { gallery } = route.params

    const shouldRefresh = useMemo(() => {
        const result = route.params?.shouldRefresh
        return result
    }, [route])
    console.log(
        '🚀 ~ file: GalleryView.js ~ line 57 ~ shouldRefresh ~ shouldRefresh',
        shouldRefresh
    )

    const insets = useSafeAreaInsets()
    const dispatch = useDispatch()

    // pan gesture handler
    // const enable = useSharedValue(false).value
    const [enable, setEnabled] = useState()
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const scrollViewRef = useRef()
    const panViewRef = useRef()
    const isGestureActive = useSharedValue(false)

    let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10

    if (tabBarBottomPosition === 10 && Platform.OS === 'android') {
        tabBarBottomPosition = 55
    }

    function picturePressedHandler(image) {
        navigation.navigate('GalleryDetailScreen', {
            image,
        })
    }

    //old way of handling gesture event
    const handleScroll = (event) => {
        if (event.nativeEvent.contentOffset.y < 1) {
            Platform.OS === 'android' ? navigation.goBack() : null
        }
    }
    // const scrollChecker = () => {
    //     if (scrollOffset <= 0) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    let scrollOffset = 1

    function timeToClose() {
        navigation.goBack()
    }
    function willThisWork() {
        'worklet'
        runOnJS(timeToClose)()
    }

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: ({ translationY }) => {
            if (!enable) return
            isGestureActive.value = true
        },
        onActive: ({ translationX, translationY }) => {
            if (!enable) return
            translateX.value = translationX
            translateY.value = translationY
        },
        onEnd: ({ velocityX, velocityY }) => {
            if (!enable) return
            const goBack =
                snapPoint(translateY.value, velocityY, [0, height]) === height
            if (goBack) {
                willThisWork()
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
                    /* this is multiplied by scale because that keeps
                    the finger position in mind while panning around the view */
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

    const onScroll = useCallback(({ nativeEvent }) => {
        if (nativeEvent.contentOffset.y <= 0 && !enable) {
            setEnabled(true)
            // enable.value = true
        }
        if (nativeEvent.contentOffset.y > 0 && enable) {
            setEnabled(false)
            // enable.value = false
        }
    }, [])

    //-----------------------------------------------------LOAD PICS--------------------------------------------------------
    const [loadingPics, setLoadingPics] = useState()

    // -------------
    const pics = useSelector((state) => state.galleryReducer.pics)

    const loadPics = useCallback(async () => {
        setLoadingPics(true)
        // setError(null)
        try {
            await dispatch(setPics(gallery.galleryID))
        } catch (error) {
            setError(error.message)
        }
        setLoadingPics(false)
    }, [])

    useFocusEffect(
        useCallback(() => {
            console.log('ran')
            loadPics()
        }, [loadPics])
    )

    //-----------------------------------------------------LOAD PICS--------------------------------------------------------

    React.useLayoutEffect(() => {
        navigation.setOptions({
            swipeEnabled: false,
        })
    }, [navigation])
    return (
        <PanGestureHandler
            ref={panViewRef}
            onGestureEvent={onGestureEvent}
            enabled={enable}
            activeOffsetY={5}
            failOffsetY={-5}
        >
            <Animated.View
                style={[
                    { flex: 1, backgroundColor: 'white', overflow: 'hidden' },
                    panGestureStyle,
                ]}
            >
                <ScreenWrapper
                    //old way of handling gesture event
                    // onStartShouldSetResponderCapture={scrollChecker}
                    style={{ paddingBottom: 0 }}
                >
                    <SharedElement
                        id={gallery?.galleryID}
                        style={styles.sharedElement}
                    >
                        <ImageBackground
                            style={styles.imageBg}
                            source={gallery?.thumbnail}
                            resizeMode="cover"
                        ></ImageBackground>
                    </SharedElement>
                    <HeaderBasic
                        rightButton
                        goBack={() => {
                            navigation.goBack()
                        }}
                        header="Your Event"
                        headerColor={{ color: colors.textColor }}
                        iconName="chevron-down-outline"
                        rightIcon="add"
                        onPressRight={() => {
                            navigation.navigate('CameraScreen', {
                                checkMarkSet: 'checkMarkSet',
                                galleryID: gallery.galleryID,
                            })
                        }}
                    />

                    <FlatList
                        onRefresh={loadPics}
                        refreshing={loadingPics}
                        ref={scrollViewRef}
                        waitFor={enable ? panViewRef : scrollViewRef}
                        scrollEventThrottle={16}
                        onScroll={onScroll}
                        style={styles.flatList}
                        data={pics}
                        keyExtractor={(item) => item.id}
                        renderItem={(item) => {
                            return (
                                <ThumbnailSmall
                                    images={item.item}
                                    picturePressedHandler={() => {
                                        picturePressedHandler(item.item)
                                    }}
                                />
                            )
                        }}
                        showsVerticalScrollIndicator={false}
                        numColumns={3}
                        contentContainerStyle={{
                            paddingBottom: tabBarBottomPosition + 60,
                        }}
                        onScrollEndDrag={handleScroll}
                    />
                </ScreenWrapper>
            </Animated.View>
        </PanGestureHandler>
    )
}

const styles = StyleSheet.create({
    sharedElement: {
        flex: 1,
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
    },
    imageBg: {
        flex: 1,
        opacity: 0,
    },
    flatList: {
        marginTop: 10,
        flex: 1,
    },
})

export default GalleryView
