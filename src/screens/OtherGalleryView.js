import React, { useState, useRef, useCallback } from 'react'
import { StyleSheet, Dimensions, Platform } from 'react-native'
//shared elements
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
import ThumbnailSmall from '../components/ThumbnailSmall'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'react-native'

const { width, height } = Dimensions.get('window')

const OtherGalleryView = ({ route, navigation }) => {
    //insets
    const insets = useSafeAreaInsets()

    const handleScroll = useCallback((event) => {
        if (event.nativeEvent.contentOffset.y <= 0) {
            Platform.OS === 'android' ? navigation.goBack() : null
        }
    }, [])

    //----------------------------------------------------------------PAN ANIMATION LOGIC----------------------------------------------------------------
    // pan gesture handler
    // const enable = useSharedValue(false).value
    const [enable, setEnabled] = useState()
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const isGestureActive = useSharedValue(false)

    const panViewRef = useRef()
    const scrollViewRef = useRef()
    let offset = 0
    const onScroll = useCallback(
        ({ nativeEvent }) => {
            let currentOffset = nativeEvent.contentOffset.y
            let direction = currentOffset > offset ? 'down' : 'up'

            if (
                direction === 'up' &&
                nativeEvent.contentOffset.y <= 0 &&
                !enable
            ) {
                console.log('enabled!')
                setEnabled(true)
            }
            if (
                direction === 'down' &&
                nativeEvent.contentOffset.y > 0 &&
                enable
            ) {
                console.log('disabled!')
                setEnabled(false)
            }
        },
        [setEnabled, enable]
    )

    const timeToClose = useCallback(() => {
        navigation.goBack()
    }, [])

    function closePage() {
        'worklet'
        runOnJS(timeToClose)()
    }

    const reEnableFlatList = useCallback(() => {
        setEnabled((prev) => !prev)
    }, [enable])

    function enableScroll() {
        'worklet'
        runOnJS(reEnableFlatList)()
    }

    const onGestureEvent = useAnimatedGestureHandler(
        {
            onStart: () => {
                if (!enable) return
                isGestureActive.value = true
            },
            onActive: ({ translationX, translationY }) => {
                if (!enable) return
                translateY.value = translationY
                translateX.value = translationX
            },
            onEnd: ({ velocityY }) => {
                if (!enable) return
                const goBack =
                    snapPoint(translateY.value, velocityY, [
                        0,
                        height - height / 2,
                    ]) ===
                    height - height / 2
                if (goBack) {
                    closePage()
                    return
                } else {
                    enableScroll()
                    translateX.value = withTiming(0, { duration: 100 })
                    translateY.value = withTiming(0, { duration: 100 })
                }
                isGestureActive.value = false
            },
        },
        [enable]
    )
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
    }, [])
    //----------------------------------------------------------------PAN ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------LOAD PICS--------------------------------------------------------
    const [pics, setPics] = useState([
        {
            id: '226',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60cccb5ee6d77.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60cccb5ee6d77.webp',
            ownerIsMe: 'true',
        },
        {
            id: '235',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd2e3ceb4b.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd2e3ceb4b.webp',
            ownerIsMe: 'true',
        },
        {
            id: '236',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd5da0ca7d.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd5da0ca7d.webp',
            ownerIsMe: 'true',
        },
        {
            id: '239',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd782e25d2.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd782e25d2.webp',
            ownerIsMe: 'true',
        },
        {
            id: '240',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd78a42082.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd78a42082.webp',
            ownerIsMe: 'true',
        },
        {
            id: '242',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd92c63edc.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd92c63edc.webp',
            ownerIsMe: 'true',
        },
        {
            id: '245',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd98bd7cf4.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd98bd7cf4.webp',
            ownerIsMe: 'true',
        },
        {
            id: '248',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccda58d66f6.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccda58d66f6.webp',
            ownerIsMe: 'true',
        },
    ])

    //----------------------------------------------------------------LOAD PICS--------------------------------------------------------

    //----------------------------------------------------------------PICTURE PRESSED--------------------------------------------------------
    const picturePressedHandler = useCallback(
        (scrollIndex, picID, fullPathNav) => {
            navigation.navigate('OtherGalleryDetailScreen', {
                scrollIndex,
                picID,
                fullPathNav,
                pics,
            })
        },
        [pics]
    )
    //----------------------------------------------------------------PICTURE PRESSED--------------------------------------------------------

    //----------------------------------------------------------------FLAT LIST OPTIMIZATION--------------------------------------------------------

    const keyExtractor = useCallback((item) => item.id, [])

    const getItemLayout = useCallback(
        (data, index) => ({
            length: width / 2,
            offset: (width / 2) * index,
            index: index,
        }),
        []
    )

    const renderItem = useCallback(
        ({ item, index }) => {
            return <ThumbnailSmall key={item.id} images={item} />
        },
        [pics]
    )
    //----------------------------------------------------------------FLAT LIST OPTIMIZATION--------------------------------------------------------

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
                <FlatList
                    ref={scrollViewRef}
                    data={pics}
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    renderItem={renderItem}
                    waitFor={enable ? panViewRef : scrollViewRef}
                    scrollEventThrottle={16}
                    onScroll={onScroll}
                    style={styles.flatList}
                    contentContainerStyle={{
                        ...styles.flatListContent,
                        paddingBottom: insets.bottom,
                    }}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    initialNumToRender={5}
                    windowSize={7}
                    updateCellsBatchingPeriod={100}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={12}
                    onScrollEndDrag={handleScroll}
                    removeClippedSubviews={
                        Platform.OS === 'android' ? true : false
                    }
                    onEndReachedThreshold={0.1}
                />
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
        height: height,
        width: width,
    },
    sharedElementText: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        height: 40,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageBg: {
        flex: 1,
        opacity: 0,
        height: height,
        width: width,
    },
    flatList: {
        flex: 1,
    },
    flatListContent: {
        flex: 1,
    },
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
})

export default OtherGalleryView
