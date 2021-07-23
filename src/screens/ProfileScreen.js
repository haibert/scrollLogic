import React, { useCallback, useMemo, useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Image,
    TouchableWithoutFeedback,
    Linking,
    Alert,
    Pressable,
} from 'react-native'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import Button from '../components/Button'
import GalRequestCell from '../components/ProfileScreen/GalRequestCell'
import BottomNavBar from '../components/BottomNavBar'
import NuemorphicNavBar from '../components/NuemorphicNavBar'
import StatsContainer from '../components/ProfileScreen/StatsContainer'
import AnimatedTabBAr from '../components/ProfileScreen/AnimatedTabBAr'
import ProfileTopElements from '../components/ProfileScreen/ProfileTopElements'
import Thumbnail from '../components/Thumbnail'

//redux
import { loadPermissions } from '../store/permissions/actions'
import { setGalleries, shouldRefreshSet } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

//colors
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// big list
import BigList from 'react-native-big-list'

// fakeData
import { fakeArray as listData } from '../data/images'

const { width, height } = Dimensions.get('window')

//expo camera
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'

//useFocus InteractionManager
import { InteractionManager } from 'react-native'
import { useIsFocused, useFocusEffect } from '@react-navigation/native'

const ProfileScreen = (props) => {
    //personal info
    const personalInfo = useSelector((state) => state.signupReducer.userInfo)

    //insets
    const insets = useSafeAreaInsets()

    //isFocused
    const isFocused = useIsFocused()

    //dispatch
    const dispatch = useDispatch()

    //tab bar position
    let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10

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
    }, [setLoadingGalleries, dispatch])

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

    const keyExtractor = useCallback((item) => `${item.galleryID}`, [])

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
    }, [personalInfo])
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------

    return (
        <ScreenWrapper style={{ paddingTop: 0 }}>
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
            <HeaderBasic
                iconName="menu-outline"
                goBack={() => {
                    props.navigation.toggleDrawer()
                }}
                headerColor={{ color: colors.textColor }}
                style={{ ...styles.header, marginTop: insets.top }}
            >
                <Text style={styles.signOut}>Sign Out</Text>
            </HeaderBasic>
            <AnimatedTabBAr />
            <BigList
                data={galleries}
                renderItem={render}
                itemHeight={itemHeight}
                layOut={layOut}
                keyExtractor={keyExtractor}
                contentContainerStyle={{
                    ...styles.bigListContentCont,
                    paddingBottom: tabBarBottomPosition + 80,
                }}
                numColumns={2}
                onRefresh={loadGalleries}
                refreshing={loadingGalleries}
                removeClippedSubviews={Platform.OS === 'android' ? true : false}
                // ListEmptyComponent={}
            />
            <NuemorphicNavBar
                onCameraPressed={cameraPressedHandler}
                onSearchPressed={() => {
                    props.navigation.navigate('SearchScreen')
                }}
                onFeedPressed={() => {
                    props.navigation.navigate('DashboardScreen')
                }}
                navigation={props.navigation}
                profileFocused={isFocused ? true : false}
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
    },
    signOut: {
        color: colors.darkColorP1,
        fontWeight: 'bold',
        fontSize: 17,
        position: 'absolute',
        top: 10,
        right: 10,
    },
})

export default ProfileScreen
