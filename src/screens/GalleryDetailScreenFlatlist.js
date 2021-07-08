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
} from 'react-native'
// import { FlatList, PanGestureHandler } from 'react-native-gesture-handler'

//reanimated
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
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

//paper
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper'
import { ScrollView } from 'react-native'

// blurview
import { BlurView } from 'expo-blur'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const GalleryDetailScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets()
    const { scrollIndex } = route.params
    // const image = useMemo(() => route.params?.image, [])
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
        await dispatch(deletePhoto(picToDelete))
        bottomSheetModalRef.current?.handleClosetModalPress()
        // reloadPics()
        // thumbnailRef.current?.animateCell()
    }
    const thumbnailRef = useRef()

    console.log('rendered galleryviewdetail screen')

    //----------------------------------------------------------------DELETE PHOTO----------------------------------------------------------------

    //----------------------------------------------------------------SYNCED LISTS LOGIC----------------------------------------------------------------
    const bigListRef = useRef()
    const smallListRef = useRef()

    useEffect(() => {
        console.log('effect ran')
        setActiveIndex(scrollIndex)
        setTimeout(() => {
            bigListRef.current?.scrollToOffset({
                offset: scrollIndex,
                animated: false,
            })
        }, 100)

        // bigListRef.current?.scrollToEnd({ animated: true })
        if (scrollIndex * 80 - 70 / 2 > width / 2) {
            smallListRef.current?.scrollToOffset({
                offset: scrollIndex * 80 - width / 2 + 35,
                animated: true,
            })
        } else {
            smallListRef.current?.scrollToOffset({
                offset: 0,
                animated: true,
            })
        }
    }, [])

    const [activeIndex, setActiveIndex] = useState(0)

    const onMomentumScrollEnd = useCallback((ev) => {
        const index = Math.floor(
            ev.nativeEvent.contentOffset.x.toFixed(0) / width.toFixed(0)
        )
        scrollToActiveIndex(index)
        // setActiveIndex(index)
    }, [])
    const scrollToActiveIndex = useCallback((index) => {
        setActiveIndex(index)
        // bigListRef.current?.scrollToOffset({
        //     offset: index * width,
        //     animated: false,
        // })
        if (index * 80 - 70 / 2 > width / 2) {
            smallListRef.current?.scrollToOffset({
                offset: index * 80 - width / 2 + 35,
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
        bigListRef.current?.scrollTo({ x: 0, y: 300, animated: true })

        if (index * 80 - 70 / 2 > width / 2) {
            smallListRef.current?.scrollToOffset({
                offset: index * 80 - width / 2 + 35,
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
    //----------------------------------------------------------------FLATLIST OPTIMIZATION----------------------------------------------------------------

    const handleScroll = (event) => {
        if (event.nativeEvent.contentOffset.y < -70) {
            navigation.goBack()
        }
    }

    const oneEllipsisPressed = useCallback(
        (picToDelete) => {
            bottomSheetModalRef.current?.handlePresentModalPress()
            setPicToDelete(picToDelete)
        },
        [picToDelete, refreshFlatlist]
    )

    //------------------------------FLAT LIST ANIMATION-----------------------------------
    const animatedScale = useSharedValue(1)

    //------------------------------FLAT LIST ANIMATION-----------------------------------
    const rowHeightAdjusted = useMemo(
        () => height - 40 - insets.top - insets.bottom - 70 - 30
    )

    const render = useCallback(({ item, index }) => {
        return (
            <ThumbnailBig
                images={item}
                key={item.id}
                oneEllipsisPressed={oneEllipsisPressed.bind(this, item.id)}
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
                >
                    <Image
                        style={{
                            ...styles.smallThumbs,
                            borderColor:
                                activeIndex === index ? 'white' : 'transparent',
                        }}
                        source={{ uri: item.thumbPath }}
                    />
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
            length: 80,
            offset: 80 * index,
            index,
        }),
        []
    )
    const keyExtractor = useCallback((item) => item.id, [])
    const keyExtractor2 = useCallback((item) => item.id, [])

    const scrollFailed = useCallback(() => {
        setTimeout(() => {
            bigListRef.current?.scrollToIndex({
                index: scrollIndex,
                animated: false,
            })
        }, 500)
    }, [])

    const scrollFailed2 = useCallback(() => {
        setTimeout(() => {
            smallListRef.current?.scrollToIndex({
                index: scrollIndex,
                animated: false,
            })
        }, 500)
    }, [])

    const [reloadingPics, setReloadingPics] = useState(false)
    const reloadPics = async () => {
        setReloadingPics(true)
        setReloadingPics(false)
    }
    //----------------------------------------------------------------FLATLIST OPTIMIZATION----------------------------------------------------------------

    //----------------------------------------------------------------Header Animation----------------------------------------------------------------
    const animatedOpacity = useSharedValue(0)

    const onScroll = useAnimatedScrollHandler((event, context) => {
        const { y } = event.contentOffset
        animatedOpacity.value = y
        animatedScale.value = y
    })

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                animatedOpacity.value,
                [0, 200],
                [1, 0],
                Extrapolate.CLAMP
            ),
        }
    })

    //----------------------------------------------------------------Header Animation----------------------------------------------------------------

    return (
        <ScreenWrapper style={{ paddingBottom: 0, paddingTop: 0 }}>
            {/* <ImageBackground
                style={StyleSheet.absoluteFill}
                source={{ uri: image[0]?.fullPath }}
                blurRadius={50}
                fadeDuration={500}
                loadingIndicatorSource={ActivityIndicator}
            > */}
            <CachedImageGalleryView
                style={StyleSheet.absoluteFill}
                source={{
                    uri: `${image[0]?.thumbPath}`,
                }}
                resizeMode="cover"
                cacheKey={`${image[0]?.galleryID}t`}
            />
            {/* cant use Big list because scroll to index and onScrollEndDrag do not work.*/}
            <EntryAnimation index={1}>
                <AnimatedFlatList
                    ref={bigListRef}
                    data={image}
                    renderItem={render}
                    keyExtractor={keyExtractor}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onScrollEndDrag={handleScroll}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    initialScrollIndex={scrollIndex}
                    onScrollToIndexFailed={scrollFailed}
                    getItemLayout={layOut}
                    windowSize={9}
                    contentContainerStyle={
                        {
                            // paddingBottom: 40,
                        }
                    }
                    // ListEmptyComponent={}
                    alwaysBounceVertical={false}
                    bounces={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    extraData={refreshFlatlist}
                    // onRefresh={reloadPics}
                    // refreshing={reloadingPics}
                    style={{
                        marginTop: insets.top + 40,
                        marginBottom: insets.bottom + 70 + 30,
                    }}
                    // carousel props
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </EntryAnimation>

            <FlatList
                ref={smallListRef}
                data={image}
                renderItem={render2}
                keyExtractor={keyExtractor2}
                horizontal
                style={{ ...styles.flatList2, bottom: insets.bottom + 10 }}
                initialScrollIndex={scrollIndex}
                onScrollToIndexFailed={scrollFailed2}
                getItemLayout={layOut2}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={8}
            />
            <Animated.View
                style={[
                    {
                        marginBottom: 10,
                        position: 'absolute',
                        marginTop: insets.top,
                    },
                    opacityStyle,
                ]}
            >
                <HeaderBasic
                    goBack={() => {
                        navigation.goBack()
                    }}
                    headerColor={{ color: colors.textColor }}
                    iconName="chevron-down-outline"
                />
            </Animated.View>
            <ActionSheetGV
                ref={bottomSheetModalRef}
                navigation={navigation}
                yesPressed={deletePhotoHandler}
                // refreshPhotos={loadGalleries}
            />
            {/* </ImageBackground> */}
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    imageTopActionsCont: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
    },
    flatList: {
        transform: [
            {
                scale: 0.7,
            },
        ],
    },
    flatList2: {
        height: 70,
        position: 'absolute',
        width: ' 100%',
    },
    smallThumbs: {
        height: 70,
        width: 70,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 10,
        borderWidth: 3,
    },
})

export default GalleryDetailScreen
