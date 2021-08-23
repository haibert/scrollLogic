import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Image,
    TouchableOpacity,
    InteractionManager,
} from 'react-native'

//reanimated
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay,
} from 'react-native-reanimated'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import ThumbnailBig from '../components/ThumbnailBig'
import DeletePicBottomSheet from '../components/ProfileScreen/DeletePicBottomSheet'
import DeleteConfirmation from '../components/DeleteConfirmation'

const { width, height } = Dimensions.get('window')

//constants
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//redux
import { deletePhoto } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

// big list
import BigList from 'react-native-big-list'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

// blurview
// import { BlurView } from 'expo-blur'

//focus effect
import { useFocusEffect } from '@react-navigation/native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

//fast image
import FastImage from 'react-native-fast-image'

const GalleryDetailScreen = ({ route, navigation }) => {
    //insets
    const insets = useSafeAreaInsets()

    //adjusted height
    const rowHeightAdjusted = useMemo(() => {
        const calcHeight = height - 40 - insets.top - insets.bottom - 70 - 30
        return +calcHeight.toFixed(0)
    }, [])
    //adjusted width
    const rowWidthAdjust = useMemo(() => (rowHeightAdjusted * 9) / 16, [])

    //nav params
    const { scrollIndex, picID, fullPathNav } = route.params

    //data
    const image = useSelector((state) => state.galleryReducer.pics)

    // bottom sheet ref
    const bottomSheetModalRef = useRef()

    //dispatch
    const dispatch = useDispatch()

    //tab bar height
    const tabBarHeight = useBottomTabBarHeight()

    //----------------------------------------------------------------COMMENT PRESSED-------------------------------------------------------------
    const onCommentPressed = useCallback(() => {
        navigation.navigate('CommentsScreen')
    }, [])

    //----------------------------------------------------------------NAV FUNCTIONS-------------------------------------------------------------
    const goBack = useCallback(() => {
        navigation.goBack()
    }, [])

    //----------------------------------------------------------------ACTION SHEET LOGIC---------------------------------------------------------------
    const [picToDelete, setPicToDelete] = useState()
    const [refreshFlatlist, setRefreshFlatList] = useState(false)
    const [showConfirmationBool, setShowConfirmationBool] = useState(false)

    const showConfirmation = useCallback(() => {
        setTimeout(() => {
            setShowConfirmationBool(true)
        }, 180)
    }, [])

    const dismissConfirmation = useCallback(() => {
        setTimeout(() => {
            setShowConfirmationBool(false)
        }, 100)
    }, [])

    const onConfirmPressed = useCallback(async () => {
        await dispatch(deletePhoto(picToDelete.picToDelete))

        const newIndex = picToDelete.index - 1

        bigListRef.current?.scrollToOffset({
            offset: newIndex * width,
            animated: false,
        })
        smallListRef.current?.scrollToOffset({
            offset: newIndex * width,
            animated: false,
        })

        setActiveIndex(newIndex)
    }, [picToDelete])
    //----------------------------------------------------------------ACTION SHEET LOGIC--------------------------------------------------------------

    //----------------------------------------------------------------SCROLL TO INDEX WHEN MOUNTED----------------------------------------------------------------
    const bigListRef = useRef()
    const smallListRef = useRef()

    const listOpacity = useSharedValue(0)
    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: listOpacity.value,
        }
    })

    const delayAmount = useMemo(() => {
        if (Platform.OS === 'ios') {
            return 300
        } else {
            return 400
        }
    }, [])

    const fadeAmount = useMemo(() => {
        if (Platform.OS === 'ios') {
            return 200
        } else {
            return 200
        }
    }, [])

    const startOpacityAnim = useCallback(() => {
        listOpacity.value = withDelay(
            delayAmount,
            withTiming(1, { duration: fadeAmount })
        )
    }, [])

    useEffect(() => {
        setActiveIndex(scrollIndex)
        const scroll = width * scrollIndex
        setTimeout(() => {
            bigListRef.current?.scrollTo({
                x: 0,
                y: scroll,
                animated: false,
            })
        }, 200)

        startOpacityAnim()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                if (scrollIndex * 70 - 70 / 2 > width / 2) {
                    smallListRef.current?.scrollToOffset({
                        offset: scrollIndex * 70 - width / 2 + 35,
                        animated: false,
                    })
                } else {
                    smallListRef.current?.scrollToOffset({
                        offset: 0,
                        animated: false,
                    })
                }
            })

            return () => task.cancel()
        }, [])
    )
    //----------------------------------------------------------------SCROLL TO INDEX WHEN MOUNTED----------------------------------------------------------------

    //----------------------------------------------------------------SYNCED LISTS LOGIC----------------------------------------------------------------
    const [activeIndex, setActiveIndex] = useState(0)

    const onMomentumScrollEnd = useCallback((ev) => {
        const index = ev.nativeEvent.contentOffset.y / width

        scrollToActiveIndex(Math.round(index))
    }, [])
    const scrollToActiveIndex = useCallback((index) => {
        setActiveIndex(index)
        if (index * 70 - 70 / 2 > width / 2) {
            smallListRef.current?.scrollToOffset({
                offset: index * 70 - width / 2 + 35,
                animated: true,
            })
        } else {
            smallListRef.current?.scrollToOffset({
                offset: 0,
                animated: true,
            })
        }
    }, [])

    const scrollToActiveIndexSmall = useCallback((index) => {
        setActiveIndex(index)
        bigListRef.current?.scrollToOffset({
            offset: index * width,
            animated: false,
        })

        if (index * 70 - 70 / 2 > width / 2) {
            smallListRef.current?.scrollToOffset({
                offset: index * 70 - width / 2 + 35,
                animated: true,
            })
        } else {
            smallListRef.current?.scrollToOffset({
                offset: 0,
                animated: true,
            })
        }
    }, [])
    //----------------------------------------------------------------SYNCED LISTS LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    const oneEllipsisPressed = useCallback(
        (picToDelete, index) => {
            bottomSheetModalRef.current?.handlePresentModalPress()
            setPicToDelete({ picToDelete, index })
        },
        [picToDelete, refreshFlatlist]
    )

    const render = useCallback(({ item, index }) => {
        return (
            <ThumbnailBig
                images={item}
                key={item.id}
                oneEllipsisPressed={oneEllipsisPressed.bind(
                    this,
                    item.id,
                    index
                )}
                onCommentPressed={onCommentPressed}
            />
        )
    }, [])

    const render2 = useCallback(
        ({ item, index }) => {
            return (
                <TouchableOpacity
                    onPress={() => {
                        scrollToActiveIndexSmall(index)
                    }}
                    style={styles.render2}
                >
                    <View style={styles.smallThumbsFlipper}>
                        <Image
                            style={{
                                ...styles.smallThumbs,
                                borderColor:
                                    activeIndex === index
                                        ? 'white'
                                        : 'transparent',
                            }}
                            source={{ uri: item.thumbPath }}
                        />
                    </View>
                </TouchableOpacity>
            )
        },
        [activeIndex, setActiveIndex]
    )

    const layOut = useCallback(
        (data, index) => ({
            length: width,
            offset: width * index,
            index,
        }),
        []
    )
    const layOut2 = useCallback(
        (data, index) => ({
            length: 70,
            offset: 70 * index,
            index,
        }),
        []
    )
    const keyExtractor = useCallback((item) => item.id, [])
    const keyExtractor2 = useCallback((item) => item.id, [])

    const scrollFailed = useCallback(() => {
        const scroll = width * scrollIndex
        setTimeout(() => {
            bigListRef.current?.scrollTo({
                x: 0,
                y: scroll,
                animated: false,
            })
        }, 500)
    }, [])

    const scrollFailed2 = useCallback(() => {
        setTimeout(() => {
            const scroll = width * scrollIndex
            bigListRef.current?.scrollTo({
                x: 0,
                y: scroll,
                animated: false,
            })
        }, 500)
    }, [])
    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------

    return (
        <ScreenWrapper style={{ paddingBottom: tabBarHeight, paddingTop: 0 }}>
            <ImageBackground
                style={{
                    ...StyleSheet.absoluteFill,
                    ...styles.imageBackground,
                }}
                source={{
                    uri:
                        Platform.OS === 'android'
                            ? fullPathNav
                            : image[activeIndex]?.thumbPath,
                }}
                blurRadius={20}
                fadeDuration={50}
            />

            <View
                style={{
                    ...styles.transitionImageCont,
                    top: insets.top + 40,
                    height: rowHeightAdjusted,
                    width: width,
                }}
            >
                <SharedElement id={picID}>
                    <FastImage
                        style={{
                            height: rowHeightAdjusted,
                            width: rowWidthAdjust,
                            borderRadius: 17,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </SharedElement>
            </View>

            <View
                style={{
                    ...styles.bigListFlipperCont,
                    height: height,
                }}
            >
                <Animated.View
                    style={[
                        {
                            ...styles.bigListFlipper,
                            width: height,
                            overflow: 'visible',
                        },
                        opacityStyle,
                    ]}
                >
                    <BigList
                        ref={bigListRef}
                        data={image}
                        renderItem={render}
                        keyExtractor={keyExtractor}
                        initialScrollIndex={scrollIndex}
                        onScrollToIndexFailed={scrollFailed}
                        itemHeight={width}
                        getItemLayout={layOut}
                        // alwaysBounceVertical={false}
                        // bounces={false}
                        scrollEventThrottle={16}
                        style={{
                            ...styles.bigList,
                            paddingLeft: insets.bottom + 100,
                        }}
                        // carousel props
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                    />
                </Animated.View>
            </View>
            <HeaderBasic
                goBack={goBack}
                headerColor={{ color: colors.textColor }}
                iconName="chevron-down-outline"
                style={{ ...styles.header, marginTop: insets.top }}
            />
            <View
                style={{
                    ...styles.smallListFlipperCont,
                    bottom: insets.bottom + 10,
                }}
            >
                <View style={styles.smallListFlipper}>
                    <BigList
                        ref={smallListRef}
                        data={image}
                        renderItem={render2}
                        keyExtractor={keyExtractor2}
                        initialScrollIndex={scrollIndex}
                        onScrollToIndexFailed={scrollFailed2}
                        getItemLayout={layOut2}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>

            <DeletePicBottomSheet
                ref={bottomSheetModalRef}
                showConfirmation={showConfirmation}
            />

            {showConfirmationBool && (
                <DeleteConfirmation
                    dismissConfirmation={dismissConfirmation}
                    onConfirmPressed={onConfirmPressed}
                    message={'This will permanently delete this photo'}
                />
            )}
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    imageTopActionsCont: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
    },
    header: {
        marginBottom: 10,
        position: 'absolute',
    },
    imageBackground: {
        backgroundColor: colors.backgroundBlurLight,
    },
    transitionImageCont: {
        left: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatList2: {
        height: 60,
        position: 'absolute',
        width: ' 100%',
    },
    render2: {
        marginBottom: 10,
    },
    smallThumbsFlipper: {
        transform: [
            {
                rotate: '90deg',
            },
        ],
    },
    smallThumbs: {
        height: 60,
        width: 60,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 3,
    },
    bigListFlipperCont: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bigListFlipper: {
        transform: [
            {
                rotate: '-90deg',
            },
        ],
        height: width,
        opacity: 0,
    },
    bigList: {
        flex: 1,
    },
    smallListFlipperCont: {
        width: width,
        height: 60,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallListFlipper: {
        transform: [
            {
                rotate: '-90deg',
            },
        ],
        width: 60,
        height: width,
    },
})

export default GalleryDetailScreen
