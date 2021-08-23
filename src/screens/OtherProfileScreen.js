import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import {
    StyleSheet,
    Dimensions,
    Linking,
    Alert,
    View,
    Text,
    FlatList,
    Modal,
} from 'react-native'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import Button from '../components/Button'
import BottomNavBar from '../components/BottomNavBar'
import NuemorphicNavBar from '../components/NuemorphicNavBar'
import StatsContainer from '../components/ProfileScreen/StatsContainer'
import ProfileTopElements from '../components/ProfileScreen/ProfileTopElements'
import Thumbnail from '../components/Thumbnail'
import ThumbnailSmall from '../components/ThumbnailSmall'
import OtherProfileTabBar from '../components/OtherProfileScreen/OtherProfileTabBar'
import DeleteConfirmation from '../components/DeleteConfirmation'
import ActionBottomSheet from '../components/ActionBottomSheet'

//redux
import { loadPermissions } from '../store/permissions/actions'
import {
    setOtherProfileGalleries,
    shouldRefreshSet,
    setTaggedGalleries,
    setGalleries as setCurrentUserGalleries,
} from '../store/event/action'
import {
    setShouldRefreshProfile,
    loadProfile,
    followUnfollow,
} from '../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//colors
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// big list
import BigList from 'react-native-big-list'

const { width, height } = Dimensions.get('window')

//expo camera
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'

//useFocus InteractionManager
import { InteractionManager } from 'react-native'
import { useIsFocused, useFocusEffect } from '@react-navigation/native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'

const loadNumber = 10
let page = 1

const OtherProfileScreen = (props) => {
    //uniqueID
    const uniqueID = props.route.params?.uniqueID

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    // sheet ref
    const bottomSheetRef = useRef()

    // for animating tabBar
    const animatedTabBarRef = useRef()

    //for scrolling To X position
    const pagerScrollViewRef = useRef()

    //tab bar height
    const tabBarHeight = useBottomTabBarHeight()

    //tabBarBottomPosition
    let tabBarBottomPosition = useMemo(
        () => (insets.bottom > 0 ? insets.bottom / 2 + 2 : 10),
        []
    )
    //----------------------------------------------------------------LOAD PROFILE----------------------------------------------------------------
    const [profileInfo, setProfileInfo] = useState()

    const loadProfileInfo = useCallback(async () => {
        // setLoadingGalleries(true)
        // setError(null)
        try {
            const profileData = await dispatch(loadProfile(uniqueID))

            setProfileInfo(profileData)
        } catch (error) {
            // setError(error.message)
        }
        // setLoadingGalleries(false)
    }, [])

    useEffect(() => {
        loadProfileInfo()
    }, [loadProfileInfo, uniqueID])
    //----------------------------------------------------------------LOAD PROFILE----------------------------------------------------------------

    //----------------------------------------------------------------ACTION SHEET LOGIC---------------------------------------------------------------
    const [showConfirmationBool, setShowConfirmationBool] = useState()
    const [deleteID, setDeleteID] = useState({ id: '', index: '' })

    const showConfirmation = useCallback(() => {
        setTimeout(() => {
            setShowConfirmationBool(true)
        }, 180)
    }, [])

    const dismissConfirmation = useCallback(() => {
        setTimeout(() => {
            setShowConfirmationBool(false)
            setOpenModal(false)
        }, 150)
    }, [])

    const onConfirmPressed = useCallback(async () => {
        try {
            await dispatch(deleteGallery(deleteID))
            setTimeout(() => {
                setShowConfirmationBool(false)
                setOpenModal(false)
            }, 150)
        } catch (err) {
            console.log('Error deleting gallery', err)
        }
    }, [deleteID])

    //----------------------------------------------------------------ACTION SHEET LOGIC--------------------------------------------------------------

    //----------------------------------------------------------------LOAD GALLERIES----------------------------------------------------------------
    const [loadingGalleries, setLoadingGalleries] = useState(false)

    const galleries2 = [
        {
            eventDate: '2021-07-26',
            galleryID: '34',
            galleryName: 'Gacias Grad',
            thumbnail: 'http://144.126.212.5/uploads/thumb/60fe3ca1c6950.webp',
        },
        {
            eventDate: '2021-08-06',
            galleryID: '24',
            galleryName: 'Fmdjdjd',
            thumbnail: 'none',
        },
        {
            eventDate: '2021-08-06',
            galleryID: '64',
            galleryName: 'Vcff',
            thumbnail: 'none',
        },
        {
            eventDate: '2021-08-11',
            galleryID: '76',
            galleryName: 'Couples Trip ',
            thumbnail: 'http://144.126.212.5/uploads/thumb/61143fa3c8988.webp',
        },
        {
            eventDate: '2021-08-13',
            galleryID: '87',
            galleryName: 'Test',
            thumbnail: 'http://144.126.212.5/uploads/thumb/6116ac2b68302.webp',
        },
        {
            eventDate: '2021-08-14',
            galleryID: '47',
            galleryName: 'Yhhhh',
            thumbnail: 'http://144.126.212.5/uploads/thumb/611759a5676dd.webp',
        },
    ]

    const shouldRefresh = useSelector(
        (state) => state.galleryReducer.shouldRefresh
    )
    // const galleries = useSelector((state) => state.galleryReducer.galleries)
    const [galleries, setGalleries] = useState([])

    const loadGalleries = useCallback(async () => {
        // setLoadingGalleries(true)
        // setError(null)
        page = 1
        try {
            loadedGalleries = await dispatch(
                setOtherProfileGalleries(uniqueID, loadNumber, page, true)
            )
            setGalleries(loadedGalleries)
        } catch (error) {
            // setError(error.message)
        }
        // setLoadingGalleries(false)
    }, [dispatch])

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            loadGalleries()
        })
        return () => task.cancel()
    }, [])

    useFocusEffect(() => {
        const refreshConditionally = async () => {
            if (shouldRefresh) {
                loadGalleries()
                await dispatch(shouldRefreshSet(false))
            }
        }
        refreshConditionally()
    })
    //----------------------------------------------------------------LOAD GALLERIES----------------------------------------------------------------

    //----------------------------------------------------------------LOAD LIKED CONTENT----------------------------------------------------------------
    const likedContent = useSelector((state) => state.galleryReducer.galleries)

    const shouldRefreshTaggedGalleries = useSelector(
        (state) => state.galleryReducer.shouldRefresh
    )

    const loadTaggedGalleries = useCallback(async () => {
        // setLoadingGalleries(true)
        // setError(null)
        try {
            await dispatch(setTaggedGalleries(userID))
        } catch (error) {
            // setError(error.message)
        }
        // setLoadingGalleries(false)
    }, [dispatch])

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            loadTaggedGalleries()
        })
        return () => task.cancel()
    }, [])

    useFocusEffect(() => {
        const refreshConditionally = async () => {
            if (shouldRefresh) {
                loadTaggedGalleries()
                await dispatch(shouldRefreshSet(false))
            }
        }
        refreshConditionally()
    })
    //----------------------------------------------------------------LOAD LIKED CONTENT----------------------------------------------------------------

    //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------
    const [listShown, setListShown] = useState('galleries')
    const render = useCallback(({ item, index }) => {
        return (
            <Thumbnail
                images={item}
                galleryPressedHandler={() => {
                    galleryPressedHandler(item.galleryID, item.thumbnail, index)
                }}
                navigation={props.navigation}
                galleryName={item.galleryName}
                oneEllipsisPressed={() => {
                    oneEllipsisPressed(item.galleryID, index)
                }}
                key={item.galleryID}
                imageURI={`${item.thumbnail}`}
            />
        )
    }, [])

    const galleryPressedHandler = useCallback((galleryID, thumbnail, index) => {
        props.navigation.navigate('OtherGalleryView', {
            galleryID,
            thumbnail,
            index,
        })
    }, [])

    const [openModal, setOpenModal] = useState(false)
    const oneEllipsisPressed = useCallback((galleryID, index) => {
        setOpenModal(true)
        setTimeout(() => {
            bottomSheetRef.current?.handlePresentModalPress()
        }, 50)
        setDeleteID({ id: galleryID, index: index })
    }, [])

    const closeModal = useCallback(() => {
        setOpenModal(false)
    }, [])

    const itemHeight = useMemo(() => width / 2 + 40)

    const layOut = useCallback(
        (data, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
        }),
        []
    )
    console.log('loaded profile screen')
    const keyExtractor = useCallback((item) => `${item.galleryID}`, [])
    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><LIKED PICS<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    const pics = useSelector((state) => state.galleryReducer.pics)

    const keyExtractorLiked = useCallback((item) => item.id, [])

    const getItemLayoutLiked = useCallback(
        (data, index) => ({
            length: width / 2,
            offset: (width / 2) * index,
            index: index,
        }),
        []
    )

    const renderLiked = useCallback(({ item, index }) => {
        return (
            <ThumbnailSmall
                key={item.id}
                images={item}
                picturePressedHandler={() => {
                    picturePressedHandler(pics, index, item.id, item.fullPath)
                }}
                navigation={props.navigation}
            />
        )
    }, [])

    const itemHeightLiked = useMemo(() => width / 2 + 40)
    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><LIKED PICS<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

    //----------------------------------------------------------------SET BUTTON TYPE----------------------------------------------------------------
    const [buttonType, setButtonType] = useState(profileInfo?.follows)

    useEffect(() => {
        setButtonType(
            profileInfo?.follows === true
                ? 'follows'
                : profileInfo?.follows === false
                ? 'unFollowed'
                : profileInfo?.follows === 'pending'
                ? 'pending'
                : null
        )
    }, [profileInfo?.follows])
    //----------------------------------------------------------------SET BUTTON TYPE----------------------------------------------------------------
    //----------------------------------------------------------------FOLLOW USER----------------------------------------------------------------
    const followPressedHandler = useCallback(async () => {
        try {
            const results = await dispatch(followUnfollow(uniqueID, 'Follow'))
            setButtonType(results)
        } catch (err) {
            console.log('🚨  Error in followPressedHandler', err)
        }
    }, [])
    //----------------------------------------------------------------FOLLOW USER----------------------------------------------------------------

    //----------------------------------------------------------------UNFOLLOW USER----------------------------------------------------------------
    const unfollowPressedHandler = useCallback(async () => {
        try {
            const results = await dispatch(
                followUnfollow(uniqueID, 'unFollow', false)
            )
            setButtonType(results)
        } catch (err) {
            console.log('🚨  Error in unfollowPressedHandler', err)
        }
    }, [])
    //----------------------------------------------------------------UNFOLLOW USER----------------------------------------------------------------

    const FollowButtons = useCallback(() => {
        if (buttonType === 'unFollowed') {
            return (
                <Button
                    style={styles.followButton}
                    text="Follow"
                    onPress={() => {
                        followPressedHandler()
                    }}
                    textStyle={{
                        color: 'white',
                    }}
                />
            )
        }

        if (buttonType === 'pending') {
            return (
                <Button
                    style={styles.pendingButton}
                    text="Pending"
                    onPress={() => {
                        unfollowPressedHandler()
                    }}
                    textStyle={{
                        color: colors.darkGrey,
                    }}
                />
            )
        }

        if (buttonType === 'follows' || buttonType === 'success') {
            return (
                <Button
                    style={styles.followingButton}
                    text="Following"
                    onPress={() => {
                        unfollowPressedHandler()
                    }}
                    textStyle={{
                        color: colors.darkGrey,
                    }}
                />
            )
        }
    }, [buttonType])

    const RenderHeader = useCallback(() => {
        return (
            <ProfileTopElements
                normalizedSource={normalizedSource}
                handleProfilePhotoPressed={handleProfilePhotoPressed}
                profileInfo={profileInfo}
                isCurrentUser={false}
            >
                {buttonType ? <FollowButtons /> : null}

                <StatsContainer
                    followingCount={profileInfo?.followingCount}
                    followersCount={profileInfo?.followersCount}
                    followingsPressedHandler={() => {
                        followingsPressedHandler('following')
                    }}
                    followersPressedHandler={() => {
                        followingsPressedHandler('followers')
                    }}
                />
            </ProfileTopElements>
        )
    }, [profileInfo, buttonType])

    const RenderSectionHeader = useCallback(() => {
        return (
            <OtherProfileTabBar
                ref={animatedTabBarRef}
                onLeftPressed={profileGalleriesPressed}
                onRightPressed={likedContentPressed}
            />
        )
    }, [])

    const onEndReached = useCallback(async () => {
        const nextPage = (page += 1)

        if (activePage === 'galleries') {
            try {
                const moreLoaded = await dispatch(
                    setOtherProfileGalleries(
                        uniqueID,
                        loadNumber,
                        nextPage,
                        false
                    )
                )
                console.log(
                    '🚀 ~ file: OtherProfileScreen.js ~ line 482 ~ onEndReached ~ moreLoaded',
                    moreLoaded.length
                )

                if (moreLoaded.length < 1) return
                const combinedGalleries = [...galleries, ...moreLoaded]
                setGalleries(combinedGalleries)
            } catch (error) {
                // setError(error.message)
            }
        }

        if (activePage === 'likedContent') {
            // try {
            //     const moreLoaded = await dispatch(
            //         setOtherProfileGalleries(uniqueID, loadNumber, nextPage, false)
            //     )
            //     if (!moreLoaded) return
            //     const combinedGalleries = [...galleries, ...moreLoaded]
            //     setGalleries(combinedGalleries)
            // } catch (error) {
            //     // setError(error.message)
            // }
        }
    }, [])
    //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------

    //----------------------------------------------------------------PROFILE PHOTO PRESSED----------------------------------------------------------------
    const handleProfilePhotoPressed = useCallback(() => {
        props.navigation.push('OtherProfilePhotoScreen', {
            id: '1',
            profilePic: profileInfo.avatar,
        })
    }, [profileInfo])
    //----------------------------------------------------------------PROFILE PHOTO PRESSED----------------------------------------------------------------

    //----------------------------------------------------------------FOLLOWINGS PRESSED HANDLER----------------------------------------------------------------
    const followingsPressedHandler = useCallback(
        (followType) => {
            props.navigation.push('OtherFollowsScreen', {
                username: profileInfo.userName,
                userID: profileInfo.uniqueID,
                followType: followType,
            })
        },
        [profileInfo]
    )
    //----------------------------------------------------------------FOLLOWINGS PRESSED HANDLER----------------------------------------------------------------

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = useCallback(() => {
        const imageString = `${profileInfo?.avatarThumb}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return normalizedSource
    }, [profileInfo?.avatarThumb])
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------

    //----------------------------------------------------------------ANIMATED TAB BAR BUTTONS----------------------------------------------------------------
    const profileGalleriesPressed = useCallback(() => {
        pagerScrollViewRef.current?.scrollTo({ x: 0, animated: true })
    }, [])

    const likedContentPressed = useCallback(() => {
        pagerScrollViewRef.current?.scrollTo({ x: width, animated: true })
    }, [])
    //----------------------------------------------------------------ANIMATED TAB BAR BUTTONS----------------------------------------------------------------

    //----------------------------------------------------------------SCROLLVIEW FUNCTIONS----------------------------------------------------------------
    //currently visible slide
    const [activePage, setActivePage] = useState('galleries')

    //bool to control which galleries are shortened
    const [shortenGalleries, setShortenGalleries] = useState()
    const [shortenLikedContent, setShortenLikedContent] = useState()

    //shortenedGalleries
    const [reducedGalleries, setReducedGalleries] = useState()
    const [reducedLikedContent, setReducedLikedContent] = useState()

    const onMomentumScrollEnd = useCallback((ev) => {
        const index = Math.round(ev.nativeEvent.contentOffset.x / width)

        if (index === 0) {
            setActivePage('galleries')
            setShortenGalleries(false)
            setShortenLikedContent(true)
            animatedTabBarRef.current?.animateToLeft()
        }
        if (index === 1) {
            setActivePage('likedContent')
            setShortenLikedContent(false)
            setShortenGalleries(true)
            const allGalleries = [...galleries]
            const reducedGal = allGalleries.slice(0, 8)
            setReducedGalleries(reducedGal)
            animatedTabBarRef.current?.animateToRight()
        }
    }, [])
    //----------------------------------------------------------------SCROLLVIEW FUNCTIONS----------------------------------------------------------------

    return (
        <ScreenWrapper
            style={{
                paddingBottom: tabBarHeight,
            }}
            topColor={{ backgroundColor: colors.currentMainColor }}
        >
            <HeaderBasic
                iconName="chevron-back-outline"
                goBack={() => {
                    props.navigation.goBack()
                }}
                headerColor={{ color: colors.textColor }}
                style={{ backgroundColor: colors.currentMainColor }}
                iconColor="white"
            >
                {/* <Ionicons
                    name="notifications-outline"
                    size={30}
                    style={styles.signOut}
                    onPress={() => {
                        props.navigation.navigate('NotificationsScreen')
                    }}
                /> */}
            </HeaderBasic>
            <FlatList
                StickySectionHeadersEnabled={true}
                nestedScrollEnabled={true}
                stickyHeaderIndices={[2]}
                ListHeaderComponent={RenderHeader}
                contentContainerStyle={{
                    height: height + 100,
                    minHeight: '100%',
                    width: width,
                    backgroundColor: 'white',
                }}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.2}
                data={[{ id: '1' }, { id: '3' }, { id: '4' }]}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                    if (index === 1) {
                        return <RenderSectionHeader />
                    }
                    if (index === 2) {
                        return (
                            <View
                                style={{
                                    width: width,
                                }}
                            >
                                <ScrollView
                                    ref={pagerScrollViewRef}
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width: width,
                                        minHeight: '100%',
                                    }}
                                    horizontal={true}
                                    snapToInterval={width}
                                    snapToAlignment={'start'}
                                    decelerationRate="fast"
                                    bounces={false}
                                    onMomentumScrollEnd={onMomentumScrollEnd}
                                >
                                    <View style={styles.bigList}>
                                        <BigList
                                            data={galleries}
                                            renderItem={render}
                                            itemHeight={itemHeight}
                                            layOut={layOut}
                                            keyExtractor={keyExtractor}
                                            numColumns={2}
                                            contentContainerStyle={{
                                                paddingBottom: 10,
                                            }}
                                            // onRefresh={loadGalleries}
                                            // refreshing={loadingGalleries}
                                            showsVerticalScrollIndicator={false}
                                            scrollEnabled={false}
                                            // onEndReached={() => {
                                            //     console.log('End Reached')
                                            //     onEndReached()
                                            // }}
                                        />
                                    </View>
                                    <View style={styles.bigList}>
                                        <BigList
                                            data={galleries2}
                                            renderItem={
                                                listShown === 'galleries'
                                                    ? render
                                                    : renderLiked
                                            }
                                            itemHeight={
                                                listShown === 'galleries'
                                                    ? itemHeight
                                                    : itemHeightLiked
                                            }
                                            layOut={
                                                listShown === 'galleries'
                                                    ? layOut
                                                    : getItemLayoutLiked
                                            }
                                            keyExtractor={
                                                listShown === 'galleries'
                                                    ? keyExtractor
                                                    : keyExtractorLiked
                                            }
                                            numColumns={2}
                                            // onRefresh={loadGalleries}
                                            // refreshing={loadingGalleries}
                                            showsVerticalScrollIndicator={false}
                                            scrollEnabled={false}
                                            // onEndReached={() => {
                                            //     console.log('End Reached')
                                            //     onEndReached()
                                            // }}
                                        />
                                    </View>
                                </ScrollView>
                            </View>
                        )
                    }
                }}
            />
            <Modal
                style={StyleSheet.absoluteFill}
                visible={openModal}
                animationType="fade"
                transparent
            >
                <ActionBottomSheet
                    ref={bottomSheetRef}
                    showConfirmation={showConfirmation}
                    closeModal={() => {
                        console.log('called')
                        closeModal()
                    }}
                />
                {showConfirmationBool && (
                    <DeleteConfirmation
                        dismissConfirmation={dismissConfirmation}
                        onConfirmPressed={onConfirmPressed}
                        message="This will permanently delete all of the pictures
                            inside this gallery"
                    />
                )}
            </Modal>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    topCont: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.placeHolder,
    },
    header: {
        position: 'absolute',
        top: 0,
    },
    button: {
        width: 100,
        marginTop: 5,
        height: 30,
        borderRadius: 8,
    },
    columCont: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: colors.separatorLine,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginTop: -20,
    },
    bigList: {
        flex: 1,
        width: width,
    },
    bigListContentCont: {
        marginLeft: 10,
        paddingBottom: 15,
    },
    signOut: {
        color: colors.darkColorP1,
        fontFamily: colors.semiBold,
        position: 'absolute',
        top: 0,
        right: 10,
    },
    pendingButton: {
        width: 100,
        marginTop: 5,
        height: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.currentMainColor,
        backgroundColor: 'white',
    },
    followButton: {
        width: 100,
        marginTop: 5,
        height: 30,
        borderRadius: 8,
        backgroundColor: colors.currentMainColor,
    },
    followingButton: {
        width: 100,
        marginTop: 5,
        height: 30,
        borderRadius: 8,
        backgroundColor: 'white',
    },
})

export default OtherProfileScreen
