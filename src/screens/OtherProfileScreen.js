import React, { useCallback, useState, useEffect, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Image,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Pressable,
} from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import Button from '../components/Button'
import Thumbnail from '../components/Thumbnail'
import BottomNavBar from '../components/BottomNavBar'
import ActionBottomSheet from '../components/ActionBottomSheet'

//paper
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper'

//redux
import { loadProfile, followUnfollow } from '../store/signup-auth/actions'

import { setGalleries, shouldRefreshSet } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

//useFocus InteractionManager
import { InteractionManager } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

//constants
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

// big list
import BigList from 'react-native-big-list'

// fakeData
import { fakeArray as listData } from '../data/images'

//fast image
import FastImage from 'react-native-fast-image'

const { width, height } = Dimensions.get('window')

const OtherProfileScreen = (props) => {
    //uniqueID
    const uniqueID = props.route.params?.uniqueID
    console.log(
        '🚀 ~ file: OtherProfileScreen.js ~ line 64 ~ OtherProfileScreen ~ uniqueID',
        uniqueID
    )

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    //profile info
    const profileInfo = useSelector(
        (state) => state.signupReducer.loadedProfile
    )
    console.log(
        '🚀 ~ file: OtherProfileScreen.js ~ line 71 ~ OtherProfileScreen ~ profileInfo',
        profileInfo
    )

    //tabBarBottomPosition
    let tabBarBottomPosition = useMemo(
        () => (insets.bottom > 0 ? insets.bottom / 2 + 2 : 10),
        []
    )

    // useEffect(() => {
    //     const task = InteractionManager.runAfterInteractions(() => {
    //         dispatch(loadProfile(uniqueID))
    //     })

    //     return () => task.cancel()
    // }, [])

    //----------------------------------------------------------------LOAD PROFILE----------------------------------------------------------------

    const loadProfileInfo = useCallback(async () => {
        // setLoadingGalleries(true)
        // setError(null)
        try {
            await dispatch(loadProfile(uniqueID))
        } catch (error) {
            // setError(error.message)
        }
        // setLoadingGalleries(false)
    }, [])

    useEffect(() => {
        loadProfileInfo()
    }, [loadProfileInfo, uniqueID])
    //----------------------------------------------------------------LOAD PROFILE----------------------------------------------------------------

    //----------------------------------------------------------------FOLLOW PRESSED----------------------------------------------------------------
    const followPressedHandler = useCallback(async () => {
        try {
            await dispatch(followUnfollow(profileInfo.uniqueID, 'Follow'))
        } catch (err) {
            console.log('🚨  Error in followPressedHandler', err)
            // setError(error.message)
        }
    }, [profileInfo])
    //----------------------------------------------------------------FOLLOW PRESSED----------------------------------------------------------------

    //----------------------------------------------------------------LOADING ANIMATIONS----------------------------------------------------------------
    const loadingOpacity = useSharedValue(1)
    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: loadingOpacity.value,
        }
    })
    const startOpacityAnim = useCallback(() => {
        loadingOpacity.value = withDelay(200, withTiming(0, { duration: 0 }))
    }, [])
    //----------------------------------------------------------------LOADING ANIMATIONS----------------------------------------------------------------

    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------
    const animatedValue = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            right: animatedValue.value,
            backgroundColor: colors.nPButton,
            width: '50%',
            height: 5,
        }
    })
    const startAnimationRight = () => {
        animatedValue.value = withTiming(-(width - width / 2), {
            duration: 100,
        })
    }
    const startAnimationMiddle = () => {
        animatedValue.value = withTiming(-(width - width / 2 - width / 3), {
            duration: 100,
        })
    }
    const startAnimationLeft = () => {
        animatedValue.value = withTiming(0, { duration: 100 })
    }
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------PROFILE PHOTO PRESSED----------------------------------------------------------------
    const handleProfilePhotoPressed = useCallback(() => {
        props.navigation.navigate('OtherProfilePhotoScreen', {
            profilePic: profileInfo.avatar,
        })
    }, [profileInfo])
    //----------------------------------------------------------------PROFILE PHOTO PRESSED----------------------------------------------------------------

    //----------------------------------------------------------------FOLLOWERS PRESSED HANDLER----------------------------------------------------------------
    const followingsPressedHandler = useCallback((followType) => {
        props.navigation.navigate('FollowersScreen', {
            username: profileInfo.userName,
            userID: profileInfo.uniqueID,
            followType: followType,
        })
    }, [])
    //----------------------------------------------------------------FOLLOWERS PRESSED HANDLER----------------------------------------------------------------
    //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------
    const render = useCallback(({ item, index }) => {
        return (
            <Thumbnail
                images={item}
                galleryPressedHandler={() => {
                    galleryPressedHandler(
                        item.galleryID,
                        item.thumbnail,
                        item.galleryName,
                        uniqueID
                    )
                }}
                navigation={props.navigation}
                galleryName={item.galleryName}
                onActionsPressed={onActionsPressed.bind(this, item, index)}
                key={item.galleryID}
                imageURI={item.thumbnail}
            />
        )
    }, [])

    const galleryPressedHandler = useCallback(
        (galleryID, thumbnail, galName, userID) => {
            props.navigation.navigate('OtherGalleryView', {
                galleryID,
                thumbnail,
                galName,
                userID,
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

    //----------------------------------------------------------------LOAD GALLERIES----------------------------------------------------------------
    const [loadingGalleries, setLoadingGalleries] = useState(false)
    // states
    const galleries = useSelector(
        (state) => state.galleryReducer.otherGalleries
    )

    console.log('Other Profile Screen Rendered')

    const shouldRefresh = useSelector(
        (state) => state.galleryReducer.shouldRefresh
    )

    const loadGalleries = useCallback(async () => {
        // setLoadingGalleries(true)
        // setError(null)
        try {
            await dispatch(setGalleries(uniqueID))
        } catch (error) {
            // setError(error.message)
        }
        // setLoadingGalleries(false)
    }, [setLoadingGalleries, dispatch, uniqueID])

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            loadGalleries()
        })
        return () => task.cancel()
    }, [loadGalleries])

    //----------------------------------------------------------------LOAD GALLERIES----------------------------------------------------------------

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = () => {
        const imageString = `${profileInfo?.avatarThumb}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return normalizedSource
    }
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------

    return (
        <ScreenWrapper style={{ paddingTop: 0 }}>
            <ImageBackground
                style={{ ...styles.topCont, paddingTop: insets.top * 2 - 10 }}
                source={{
                    uri: profileInfo?.avatar,
                }}
                blurRadius={10}
            >
                <TouchableWithoutFeedback onPress={handleProfilePhotoPressed}>
                    <SharedElement id={'2'}>
                        <FastImage
                            style={styles.avatar}
                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                                uri: normalizedSource(),
                                priority: FastImage.priority.normal,
                            }}
                        />
                    </SharedElement>
                </TouchableWithoutFeedback>
                <Text
                    style={styles.name}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >
                    {profileInfo?.firstName} {profileInfo?.lastName}
                </Text>
                <Text
                    style={{ color: 'white', fontSize: 15 }}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >{`@${profileInfo?.userName}`}</Text>
                <Button
                    text="Follow"
                    style={styles.button}
                    onPress={followPressedHandler}
                />
                <View style={styles.stats}>
                    <Pressable
                        style={styles.statCubes1}
                        onPress={() => {
                            followingsPressedHandler('following')
                        }}
                    >
                        <Text style={styles.numbers}>
                            {profileInfo?.followingCount}
                        </Text>
                        <Text style={{ color: 'white' }}>Following</Text>
                    </Pressable>
                    <Pressable
                        style={styles.statCubes2}
                        onPress={() => {
                            followingsPressedHandler('followers')
                        }}
                    >
                        <Text style={styles.numbers}>
                            {profileInfo?.followersCount}
                        </Text>
                        <Text style={{ color: 'white' }}>Followers</Text>
                    </Pressable>
                    <View style={styles.statCubes3}>
                        <Text style={styles.numbers}>23,6k</Text>
                        <Text style={{ color: 'white' }}>Likes Received</Text>
                    </View>
                </View>
                <View height={20}></View>
            </ImageBackground>
            <HeaderBasic
                iconName="chevron-back-outline"
                goBack={() => {
                    props.navigation.goBack()
                }}
                headerColor={{ color: colors.textColor }}
                style={{ ...styles.header, marginTop: insets.top }}
            ></HeaderBasic>
            <View style={styles.requestsColumCont}>
                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationLeft()
                    }}
                >
                    <Text style={styles.requestsText}>Galleries</Text>
                </View>

                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationRight()
                    }}
                >
                    <Text style={styles.requestsText}>Liked</Text>
                </View>
                <View style={styles.animatingBar}>
                    <Animated.View style={animatedStyle}></Animated.View>
                </View>
            </View>
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
                style={styles.flatList}
                onRefresh={loadGalleries}
                refreshing={loadingGalleries}
                // ListEmptyComponent={}
            />
            {/* <Animated.View
                pointerEvents={'none'}
                style={[
                    styles.loadingView,
                    opacityStyle,
                    {
                        top: insets.top + 40,
                    },
                ]}
            >
                <ActivityIndicator />
            </Animated.View> */}
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
    topCont: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.placeHolder,
        // position: 'absolute',
        // top: 0,
    },
    header: {
        position: 'absolute',
        top: 0,
    },
    signOut: {
        color: colors.darkColorP1,
        fontWeight: 'bold',
        fontSize: 17,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    avatar: {
        marginTop: 10,
        borderRadius: 30,
        height: 60,
        width: 60,
    },
    name: {
        color: 'white',
        fontSize: 17,
        margin: 5,
    },
    button: {
        width: 100,
        marginTop: 5,
        height: 30,
        borderRadius: 8,
    },
    stats: {
        height: 60,
        marginHorizontal: 10,
        flexDirection: 'row',
        // borderColor: colors.separatorLine,
        borderRadius: colors.borderRadius,
        backgroundColor: 'rgba(145,145,145,0.6)',
        overflow: 'hidden',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    statCubes1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'white',
    },
    statCubes2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'white',
    },

    statCubes3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statCubeInner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    numbers: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },
    requestsColumCont: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: colors.separatorLine,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginTop: -20,
    },
    requestsText: {
        color: colors.darkColorP1,
        fontSize: 17,
    },
    requestsColumButtons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatingBar: {
        height: 5,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    bigListContentCont: {
        marginLeft: 10,
    },
})

export default OtherProfileScreen
