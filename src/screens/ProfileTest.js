import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import {
    StyleSheet,
    Dimensions,
    Linking,
    Alert,
    View,
    Text,
    // FlatList,
    Modal,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

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
import ProfileTabBar from '../components/ProfileScreen/ProfileTabBar'
import DeleteConfirmation from '../components/DeleteConfirmation'
import ActionBottomSheet from '../components/ActionBottomSheet'

//redux
import { loadPermissions } from '../store/permissions/actions'
import {
    setGalleries,
    shouldRefreshSet,
    setTaggedGalleries,
} from '../store/event/action'
import {
    setShouldRefreshProfile,
    loadProfile,
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

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'

const loadNumber = 15
let page = 1

const ProfileTest = (props) => {
    //personal info
    const personalInfo = useSelector((state) => state.signupReducer.userInfo)
    // console.log(
    //     '🚀 ~ file: ProfileScreen.js ~ line 53 ~ ProfileScreen ~ personalInfo',
    //     personalInfo
    // )

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    // sheet ref
    const bottomSheetRef = useRef()

    //is focused
    const isFocused = useIsFocused()

    // for animating tabBar
    const animatedTabBarRef = useRef()

    //for scrolling To X position
    const pagerScrollViewRef = useRef()

    let shouldAnimateProfile
    shouldAnimateProfile = props.route.params?.shouldAnimateProfile

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

    const galleries = useSelector((state) => state.galleryReducer.galleries)

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

    const loadGalleries = useCallback(async () => {
        // setLoadingGalleries(true)
        // setError(null)
        page = 1
        try {
            dispatch(setGalleries(null, loadNumber, page, true))
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

    //----------------------------------------------------------------LOAD TAGGED GALLERIES----------------------------------------------------------------
    // const [loadingGalleries, setLoadingGalleries] = useState(false)

    const taggedGalleries = useSelector(
        (state) => state.galleryReducer.galleries
    )

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
    //----------------------------------------------------------------LOAD TAGGED GALLERIES----------------------------------------------------------------

    //----------------------------------------------------------------CAMERA PRESSED HANDLER----------------------------------------------------------------
    const greenLightOnPermissions = useSelector(
        (state) => state.permissionsReducer.permissions.camera
    )

    const cameraPressedHandler = async () => {
        if (greenLightOnPermissions === 'granted') {
            props.navigation.navigate('CameraScreen')
        } else {
            const { status } = await Camera.getPermissionsAsync()
            const audioStatus = await Audio.getPermissionsAsync()

            if (status && audioStatus.status === 'granted') {
                dispatch(loadPermissions('granted'))
                props.navigation.navigate('CameraScreen')
            } else if (status || audioStatus.status === 'undetermined') {
                const results = await Camera.requestPermissionsAsync()
                const audioResults = await Audio.requestPermissionsAsync()
                if (results.status && audioResults.status === 'granted') {
                    props.navigation.navigate('CameraScreen')
                } else if (results.status || audioResults.status === 'denied') {
                    sendUserToSettingsHandler()
                    return
                }
            } else if (status || audioResults.status === 'denied') {
                const results2 = await Camera.requestPermissionsAsync()
                const audioResults2 = await Audio.requestPermissionsAsync()
                if (results2.status && audioResults2 === 'granted') {
                    props.navigation.navigate('CameraScreen')
                } else {
                    sendUserToSettingsHandler()
                    return
                }
            }
        }
    }

    const openSettings = useCallback(async () => {
        Platform.OS === 'android' ? Linking.openSettings() : null
        if (Platform.OS === 'ios') {
            const supported = await Linking.canOpenURL('app-settings:')
            try {
                if (!supported) {
                    console.log("Can't handle settings url")
                } else {
                    return Linking.openURL('app-settings:')
                }
            } catch (err) {
                console.error('An error occurred', err)
            }
        }
    }, [])

    const sendUserToSettingsHandler = useCallback(() => {
        const alertMessage =
            'Turn On Camera Permissions to Allow Event Share to Scan QR Codes'
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
    }, [])
    //----------------------------------------------------------------CAMERA PRESSED HANDLER----------------------------------------------------------------

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
        props.navigation.navigate('GalleryView', {
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

    const itemHeight = useMemo(() => width / 2 - 5)

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

    const itemHeightLiked = useMemo(() => width / 2)
    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><LIKED PICS<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

    const RenderHeader = useCallback(() => {
        return (
            <ProfileTopElements
                normalizedSource={normalizedSource}
                handleProfilePhotoPressed={handleProfilePhotoPressed}
                profileInfo={personalInfo}
            >
                <Button
                    text="Edit"
                    style={styles.button}
                    onPress={editPressedHandler}
                />
                <StatsContainer
                    followingCount={personalInfo?.followingCount}
                    followersCount={personalInfo?.followersCount}
                    followingsPressedHandler={() => {
                        followingsPressedHandler('following')
                    }}
                    followersPressedHandler={() => {
                        followingsPressedHandler('followers')
                    }}
                />
            </ProfileTopElements>
        )
    }, [personalInfo])

    const RenderSectionHeader = useCallback(() => {
        return (
            <ProfileTabBar
                ref={animatedTabBarRef}
                onLeftPressed={() => {
                    setListShown('galleries')
                    myGalleriesPressed()
                }}
                onMiddlePressed={() => {
                    // setListShown('liked')
                    taggedGalleriesPressed()
                }}
            />
        )
    }, [])

    const onEndReached = useCallback(async () => {
        const nextPage = (page += 1)
        try {
            await dispatch(setGalleries(null, loadNumber, nextPage))
        } catch (error) {
            // setError(error.message)
        }
    }, [])
    //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------

    //----------------------------------------------------------------PROFILE PHOTO PRESSED----------------------------------------------------------------
    const handleProfilePhotoPressed = useCallback(() => {
        props.navigation.navigate('PhotoEditScreen', { id: '1' })
    }, [])
    //----------------------------------------------------------------PROFILE PHOTO PRESSED----------------------------------------------------------------

    //----------------------------------------------------------------EDIT PRESSED HANDLER----------------------------------------------------------------
    const editPressedHandler = useCallback(() => {
        props.navigation.navigate('ProfileEditScreen', { id: '1' })
    }, [])
    //----------------------------------------------------------------EDIT PRESSED HANDLER----------------------------------------------------------------

    //----------------------------------------------------------------FOLLOWINGS PRESSED HANDLER----------------------------------------------------------------
    const followingsPressedHandler = useCallback((followType) => {
        props.navigation.navigate('ProfileFollowsScreen', {
            username: personalInfo?.userName,
            userID: personalInfo?.userID,
            followType: followType,
        })
    }, [])
    //----------------------------------------------------------------FOLLOWINGS PRESSED HANDLER----------------------------------------------------------------

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = useCallback(() => {
        const imageString = `${personalInfo?.avatarThumbPath}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return normalizedSource
    }, [personalInfo?.avatarThumb])
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const [disableFirstGallery, setDisableFirstGallery] = useState()

    const [shorterGallery, setShorterGallery] = useState()
    const onMomentumScrollEnd = useCallback((ev) => {
        const index = Math.round(ev.nativeEvent.contentOffset.x / width)
        console.log(
            '🚀 ~ file: ProfileTest.js ~ line 496 ~ onMomentumScrollEnd ~ index',
            index
        )
        if (index === 0) {
            setDisableFirstGallery(false)
            animatedTabBarRef.current?.animateToLeft()
        }
        if (index === 1) {
            setDisableFirstGallery(true)
            console.log(typeof galleries)
            const shorterGal = [...galleries]
            const reducedGal = shorterGal.slice(0, 8)
            setShorterGallery(reducedGal)
            animatedTabBarRef.current?.animateToMiddle()
        }
    }, [])

    const myGalleriesPressed = useCallback(() => {
        pagerScrollViewRef.current?.scrollTo({ x: 0, animated: true })
    }, [])

    const taggedGalleriesPressed = useCallback(() => {
        pagerScrollViewRef.current?.scrollTo({ x: width, animated: true })
    }, [])

    return (
        <ScreenWrapper>
            <HeaderBasic
                iconName="menu-outline"
                goBack={() => {
                    props.navigation.toggleDrawer()
                }}
                headerColor={{ color: colors.textColor }}
            >
                <Ionicons
                    name="notifications-outline"
                    size={30}
                    style={styles.signOut}
                    onPress={() => {
                        props.navigation.navigate('NotificationsScreen')
                    }}
                />
            </HeaderBasic>
            <FlatList
                stickyHeaderIndices={[2]}
                ListHeaderComponent={() => <RenderHeader />}
                contentContainerStyle={{
                    minHeight: '100%',
                    width: width,
                }}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                // onEndReached={onEndReached}
                onEndReached={() => {
                    console.log('end reahced')
                }}
                onEndReachedThreshold={0.1}
                data={[{ id: '1' }, { id: '3' }, { id: '4' }]}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                    if (index === 1) {
                        return <RenderSectionHeader />
                    }
                    if (index === 2) {
                        return (
                            <ScrollView
                                ref={pagerScrollViewRef}
                                showsHorizontalScrollIndicator={false}
                                style={{
                                    left: 0,
                                    width: width,
                                    minHeight: '100%',
                                }}
                                horizontal={true}
                                snapToInterval={width}
                                snapToAlignment={'start'}
                                decelerationRate="fast"
                                onMomentumScrollEnd={onMomentumScrollEnd}
                            >
                                <View style={styles.bigList}>
                                    <FlatList
                                        style={styles.bigList}
                                        data={
                                            !disableFirstGallery
                                                ? galleries
                                                : shorterGallery
                                        }
                                        renderItem={
                                            listShown === 'galleries'
                                                ? render
                                                : renderLiked
                                        }
                                        contentContainerStyle={{
                                            minHeight: '100%',
                                            width: width,
                                        }}
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
                                        showsVerticalScrollIndicator={false}
                                        scrollEnabled={false}
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
                                        scrollEnabled={false}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            </ScrollView>
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
})

export default ProfileTest
