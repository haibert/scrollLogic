import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    ImageBackground,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    InteractionManager,
} from 'react-native'
// import { FlatList, PanGestureHandler } from 'react-native-gesture-handler'

//reanimated
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay,
    useAnimatedScrollHandler,
    useAnimatedProps,
} from 'react-native-reanimated'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import ActionSheetGV from '../components/ActionSheetGV'
import CachedImage from '../components/CachedImage'
import ThumbnailBig from '../components/ThumbnailBig'
import { EntryAnimation } from '../components/EntryAnimation'
import CachedImageGalleryView from '../components/CachedImageGalleryView'

const { width, height } = Dimensions.get('window')

//constants
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//redux
import { deletePhoto } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

// big list
import BigList from 'react-native-big-list'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//paper
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper'
import { ScrollView } from 'react-native'

// blurview
import { BlurView } from 'expo-blur'

//focus effect
import { useFocusEffect } from '@react-navigation/native'

//fast image
import FastImage from 'react-native-fast-image'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const GalleryDetailScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets()

    const rowHeightAdjusted = useMemo(() => {
        const calcHeight = height - 40 - insets.top - insets.bottom - 70 - 30
        return +calcHeight.toFixed(0)
    })
    const rowWidthAdjust = useMemo(() => (rowHeightAdjusted * 9) / 16)

    const { scrollIndex, picID, fullPathNav } = route.params
    const image = useSelector((state) => state.galleryReducer.pics)
    // console.log(
    //     '🚀 ~ file: GalleryDetailScreen.js ~ line 65 ~ GalleryDetailScreen ~ image',
    //     image
    // )

    const bottomSheetModalRef = useRef()

    //----------------------------------------------------------------DELETE PHOTO----------------------------------------------------------------
    const [picToDelete, setPicToDelete] = useState()
    const [refreshFlatlist, setRefreshFlatList] = useState(false)
    const dispatch = useDispatch()
    const deletePhotoHandler = async () => {
        await dispatch(deletePhoto(picToDelete.picToDelete))
        bottomSheetModalRef.current?.handleClosetModalPress()

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
    }
    const thumbnailRef = useRef()

    // console.log(`rendered galleryviewdetail screen ${Math.floor(activeIndex)}`)

    //----------------------------------------------------------------DELETE PHOTO----------------------------------------------------------------

    //----------------------------------------------------------------SYNCED LISTS LOGIC----------------------------------------------------------------
    const bigListRef = useRef()
    const smallListRef = useRef()

    //----------------------------------------------------------------SCROLL TO INDEX WHEN MOUNTED----------------------------------------------------------------
    const listOpacity = useSharedValue(0)
    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: listOpacity.value,
        }
    })
    const startOpacityAnim = useCallback(() => {
        listOpacity.value = withDelay(300, withTiming(1, { duration: 200 }))
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

    //------------------------------FLAT LIST ANIMATION-----------------------------------
    const animatedScale = useSharedValue(1)

    //------------------------------FLAT LIST ANIMATION-----------------------------------

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

    const [reloadingPics, setReloadingPics] = useState(false)
    const reloadPics = async () => {
        setReloadingPics(true)
        setReloadingPics(false)
    }
    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------

    return (
        <ScreenWrapper style={{ paddingBottom: 0, paddingTop: 0 }}>
            <ImageBackground
                style={StyleSheet.absoluteFill}
                source={{
                    uri:
                        Platform.OS === 'android'
                            ? fullPathNav
                            : image[activeIndex]?.thumbPath,
                }}
                blurRadius={40}
                fadeDuration={100}
            />

            <View
                style={{
                    top: insets.top + 40,
                    left: 0,
                    right: 0,
                    height: rowHeightAdjusted,
                    width: width,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <SharedElement id={picID}>
                    <Image
                        // source={{ uri: fullPathNav }}
                        style={{
                            height: rowHeightAdjusted,
                            borderRadius: 17,
                            width: rowWidthAdjust,
                        }}
                        blurRadius={20}
                    />
                </SharedElement>
            </View>
            {/* <EntryAnimation
                index={1}
                style={{
                    width: '100%',
                    flex: 1,
                }}
            > */}

            <View
                style={{
                    ...styles.bigListFlipperCont,
                    marginTop: insets.top + 40,
                    height: rowHeightAdjusted,
                }}
            >
                <Animated.View
                    style={[
                        { ...styles.bigListFlipper, width: rowHeightAdjusted },
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
                        style={styles.bigList}
                        // carousel props
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                    />
                </Animated.View>
            </View>
            {/* </EntryAnimation> */}

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
            <HeaderBasic
                goBack={() => {
                    navigation.navigate('GalleryView', {
                        picID,
                    })
                }}
                headerColor={{ color: colors.textColor }}
                iconName="chevron-down-outline"
                style={{
                    marginBottom: 10,
                    position: 'absolute',
                    marginTop: insets.top,
                }}
            />

            <ActionSheetGV
                ref={bottomSheetModalRef}
                navigation={navigation}
                yesPressed={deletePhotoHandler}
            />
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    imageTopActionsCont: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
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
