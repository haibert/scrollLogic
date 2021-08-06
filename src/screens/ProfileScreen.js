import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { StyleSheet, Dimensions, Linking, Alert } from 'react-native'

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

//redux
import { loadPermissions } from '../store/permissions/actions'
import { setGalleries, shouldRefreshSet } from '../store/event/action'
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

const { width } = Dimensions.get('window')

//expo camera
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'

//useFocus InteractionManager
import { InteractionManager } from 'react-native'
import { useIsFocused, useFocusEffect } from '@react-navigation/native'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'

const ProfileScreen = (props) => {
    //personal info
    const personalInfo = useSelector((state) => state.signupReducer.userInfo)

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    // //----------------------------------------------------------------CONDITIONAL PROFILE REFRESH----------------------------------------------------------------

    // const loadProfileHandler = useCallback(async () => {
    //     try {
    //         await dispatch(loadProfile(null))
    //     } catch (error) {
    //         // setError(error.message)
    //         console.log(error)
    //     }
    // }, [dispatch])

    // useFocusEffect(() => {
    //     const refreshConditionally = async () => {
    //         if (shouldRefreshProfile) {
    //             console.log('conditionally refresh profile')
    //             const task = InteractionManager.runAfterInteractions(
    //                 async () => {
    //                     loadProfileHandler()
    //                     await dispatch(setShouldRefreshProfile(false))
    //                 }
    //             )
    //             return () => task.cancel()
    //         }
    //     }
    //     refreshConditionally()
    // })
    // //----------------------------------------------------------------CONDITIONAL PROFILE REFRESH----------------------------------------------------------------

    //----------------------------------------------------------------LOAD GALLERIES----------------------------------------------------------------
    const [loadingGalleries, setLoadingGalleries] = useState(false)

    const galleries = useSelector((state) => state.galleryReducer.galleries)

    const shouldRefresh = useSelector(
        (state) => state.galleryReducer.shouldRefresh
    )

    const loadGalleries = useCallback(async () => {
        // setLoadingGalleries(true)
        // setError(null)
        try {
            await dispatch(setGalleries(userID))
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
                    galleryPressedHandler(
                        item.galleryID,
                        item.thumbnail,
                        item.galleryName
                    )
                }}
                navigation={props.navigation}
                galleryName={item.galleryName}
                onActionsPressed={onActionsPressed.bind(this, item, index)}
                key={item.galleryID}
                imageURI={`${item.thumbnail}`}
            />
        )
    }, [])

    const galleryPressedHandler = useCallback(
        (galleryID, thumbnail, galName) => {
            props.navigation.navigate('GalleryView', {
                galleryID,
                thumbnail,
                galName,
            })
        },
        []
    )

    const onActionsPressed = useCallback((item, index) => {
        bottomSheetRef.current?.handlePresentModalPress()
        setDeleteID({ id: item.galleryID, index: index })
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
                personalInfo={personalInfo}
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
                onLeftPressed={() => {
                    setListShown('galleries')
                }}
                onMiddlePressed={() => {
                    setListShown('liked')
                }}
            />
        )
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
        props.navigation.navigate('FollowersScreen', {
            username: personalInfo.userName,
            userID: personalInfo.userID,
            followType: followType,
        })
    }, [])
    //----------------------------------------------------------------FOLLOWINGS PRESSED HANDLER----------------------------------------------------------------

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = useCallback(() => {
        const imageString = `${personalInfo.avatarThumbPath}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return normalizedSource
    }, [personalInfo.avatarThumbPath])
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------

    //----------------------------------------------------------------NAV BAR FUNCTIONS----------------------------------------------------------------
    const onSearchPressed = useCallback(() => {
        props.navigation.navigate('SearchScreen')
    }, [])

    const onFeedPressed = useCallback(() => {
        props.navigation.navigate('DashboardScreen')
    }, [])
    //----------------------------------------------------------------NAV BAR FUNCTIONS----------------------------------------------------------------

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
            <ScrollView
                StickySectionHeadersEnabled={true}
                stickyHeaderIndices={[1]}
                contentContainerStyle={{
                    minHeight: '100%',
                }}
                showsVerticalScrollIndicator={false}
            >
                <RenderHeader />
                <RenderSectionHeader />
                <BigList
                    data={listShown === 'galleries' ? galleries : pics}
                    renderItem={
                        listShown === 'galleries' ? render : renderLiked
                    }
                    itemHeight={
                        listShown === 'galleries' ? itemHeight : itemHeightLiked
                    }
                    layOut={
                        listShown === 'galleries' ? layOut : getItemLayoutLiked
                    }
                    keyExtractor={
                        listShown === 'galleries'
                            ? keyExtractor
                            : keyExtractorLiked
                    }
                    numColumns={listShown === 'galleries' ? 2 : 3}
                    // onRefresh={loadGalleries}
                    // refreshing={loadingGalleries}
                    removeClippedSubviews={
                        Platform.OS === 'android' ? true : false
                    }
                    showsVerticalScrollIndicator={false}
                    //header components
                    // headerHeight={260}
                    // sectionHeaderHeight={50}
                    // renderHeader={renderHeader}
                    // renderSectionHeader={renderSectionHeader}
                    // stickySectionHeadersEnabled={true}
                />
            </ScrollView>
            <NuemorphicNavBar
                onCameraPressed={cameraPressedHandler}
                onSearchPressed={onSearchPressed}
                onFeedPressed={onFeedPressed}
                profileFocused={true}
            />
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
    },
    bigListContentCont: {
        marginLeft: 10,
        paddingBottom: 15,
    },
    signOut: {
        color: colors.darkColorP1,
        fontWeight: 'bold',
        position: 'absolute',
        top: 0,
        right: 10,
    },
})

export default ProfileScreen
