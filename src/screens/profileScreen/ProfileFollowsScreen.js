import React, { useCallback, useEffect, useState, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Pressable,
} from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
} from 'react-native-reanimated'

//custom components
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'
import OtherFollowingCell from '../../components/FollowersScreen/OtherFollowingCell'
import FollowersCell from '../../components/FollowersScreen/FollowersCell'
import FollowersActionSheet from '../../components/FollowersScreen/FollowersActionSheet'
import FollowingActionSheet from '../../components/FollowersScreen/FollowingActionSheet'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

//colors
import colors from '../../constants/colors'

// big list
import BigList from 'react-native-big-list'

//fakeData
// import { fakeArray as listData } from '../data/images'

//redux
import {
    loadFollowersFollowing,
    followUnfollow,
} from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

const ProfileFollowsScreen = (props) => {
    const { username, userID, followType } = props.route.params
    //data
    const followingsData = useSelector(
        (state) => state.signupReducer.followings
    )
    // console.log(
    //     '🚀 ~ file: FollowersScreen.js ~ line 47 ~ FollowersScreen ~ followingsData',
    //     followingsData
    // )

    //dispatch
    const dispatch = useDispatch()

    //insets
    const insets = useSafeAreaInsets()

    // go back
    const goBack = useCallback(() => {
        props.navigation.goBack()
    }, [])

    // sheet ref
    const followersActionSheet = useRef()
    const followingActionSheet = useRef()

    //----------------------------------------------------------------REMOVE FOLLOWER----------------------------------------------------------------
    const [followerID, setFollowerID] = useState()
    const onRemovePressed = useCallback((userID) => {
        followersActionSheet.current?.handlePresentModalPress()
        setFollowerID(userID)
    }, [])
    //----------------------------------------------------------------REMOVE FOLLOWER----------------------------------------------------------------

    //----------------------------------------------------------------UNFOLLOW USER---------------------------------------------------------------
    const [followingID, setFollowingID] = useState()
    const onUnfollowPressed = useCallback((userID) => {
        followingActionSheet.current?.handlePresentModalPress()
        setFollowingID(userID)
    }, [])

    const unfollowConfirmed = useCallback(async () => {
        followingActionSheet.current?.closeActionSheet()
        try {
            await dispatch(followUnfollow(followingID, 'unFollow', true))
        } catch (err) {
            console.log('🚨  Error in followPressedHandler', err)
            // setError(error.message)
        }
    }, [followingID])
    //----------------------------------------------------------------UNFOLLOW USER----------------------------------------------------------------

    //----------------------------------------------------------------UNFOLLOW USER---------------------------------------------------------------

    //----------------------------------------------------------------UNFOLLOW USER----------------------------------------------------------------

    //----------------------------------------------------------------CELL PRESSED----------------------------------------------------------------
    const onCellPressed = useCallback((userID) => {
        props.navigation.push('OtherProfileScreen', {
            uniqueID: userID,
        })
    }, [])

    //----------------------------------------------------------------LOADING ANIMATION----------------------------------------------------------------
    const loadingOpacity = useSharedValue(0)
    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: loadingOpacity.value,
        }
    })
    const showLoader = useCallback(() => {
        loadingOpacity.value = withTiming(1, { duration: 0 })
    }, [])
    const hideLoader = useCallback(() => {
        loadingOpacity.value = withTiming(0, { duration: 0 })
    }, [])
    //----------------------------------------------------------------LOADING ANIMATION----------------------------------------------------------------

    //----------------------------------------------------------------LOAD DATA----------------------------------------------------------------
    const loadFollows = useCallback(
        async (userIDPassed, followTypePassed) => {
            try {
                showLoader()
                await dispatch(
                    loadFollowersFollowing(userIDPassed, followTypePassed)
                )
            } catch (err) {
                console.log(err)
            }
            setTimeout(hideLoader, 100)
        },
        [dispatch, userID, followType]
    )

    useEffect(() => {
        loadFollows(userID, followType)
    }, [loadFollows, userID, followType])

    //----------------------------------------------------------------LOAD DATA----------------------------------------------------------------

    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------
    const [switchData, setSwitchData] = useState(followType)
    const animatedSwitchData = useSharedValue(switchData)

    const animatedValue = useSharedValue(
        followType === 'following' ? 0 : -(width - width / 2)
    )
    const animatedStyle = useAnimatedStyle(() => {
        return {
            right: animatedValue.value,
            backgroundColor: colors.currentMainColor,
            width: '50%',
            height: 5,
        }
    })
    const startAnimationRight = async () => {
        animatedValue.value = withTiming(-(width - width / 2), {
            duration: 100,
        })
        animatedSwitchData.value = 'followers'
        // setSwitchData('followers')
        await loadFollows(userID, 'followers')
    }
    const startAnimationMiddle = () => {
        animatedValue.value = withTiming(-(width - width / 2 - width / 3), {
            duration: 100,
        })
    }
    const startAnimationLeft = async () => {
        animatedValue.value = withTiming(0, { duration: 100 })
        animatedSwitchData.value = 'following'
        // setSwitchData('following')
        await loadFollows(userID, 'followings')
    }
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    const renderFollowing = useCallback(({ item, index }) => {
        return (
            <OtherFollowingCell
                follows={item.follows === true ? 'Follows' : 'unFollowed'}
                data={item}
                onPress={() => {
                    onCellPressed(item.userID)
                }}
                onUnfollowPressed={() => {
                    onUnfollowPressed(item.userID)
                }}
            />
        )
    }, [])

    const renderFollowers = useCallback(({ item, index }) => {
        return (
            <FollowersCell
                data={item}
                onPress={() => {
                    onCellPressed(item.userID)
                }}
                onRemovePressed={() => {
                    onRemovePressed(item.userID)
                }}
                onFollowPressed={() => {
                    followPressedHandler(item.userID)
                }}
            />
        )
    }, [])

    const layOut = useCallback(
        (data, index) => ({
            length: 60,
            offset: 60 * index,
            index,
        }),
        []
    )

    const keyExtractor = useCallback((item) => item.userID, [])

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    return (
        <ScreenWrapper>
            <HeaderBasic
                header={username}
                goBack={goBack}
                headerColor={{ color: colors.darkestColorP1 }}
            />
            <View style={styles.requestsColumCont}>
                <Pressable
                    style={styles.requestsColumButtons}
                    onPress={() => {
                        startAnimationLeft()
                    }}
                >
                    <Text style={styles.requestsText}>Following</Text>
                </Pressable>

                <Pressable
                    style={styles.requestsColumButtons}
                    onPress={() => {
                        startAnimationRight()
                    }}
                >
                    <Text style={styles.requestsText}>Followers</Text>
                </Pressable>
                <View style={styles.animatingBar}>
                    <Animated.View style={animatedStyle}></Animated.View>
                </View>
            </View>
            <BigList
                data={followingsData}
                renderItem={
                    animatedSwitchData.value === 'following'
                        ? renderFollowing
                        : renderFollowers
                }
                keyExtractor={keyExtractor}
                itemHeight={width}
                getItemLayout={layOut}
                style={styles.bigList}
                showsVerticalScrollIndicator={true}
            />
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.loadingView,
                    opacityStyle,
                    {
                        top: insets.top + 40 + 50,
                    },
                ]}
            >
                <ActivityIndicator color={colors.nPButton} />
            </Animated.View>

            <FollowersActionSheet
                ref={followersActionSheet}
                followerID={followerID}
            />
            {/* 
            <FollowingActionSheet
                ref={followingActionSheet}
                userID={followingID}
                unfollowConfirmed={unfollowConfirmed}
            /> */}
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    bigList: {
        flex: 1,
    },
    requestsColumCont: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: colors.separatorLine,
        flexDirection: 'row',
        backgroundColor: 'white',
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
    loadingView: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
        position: 'absolute',
        width: '100%',
        bottom: 0,
        backgroundColor: colors.overallBackground,
    },
})

export default ProfileFollowsScreen
