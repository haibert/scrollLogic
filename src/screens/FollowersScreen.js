import React, { useCallback, useEffect, useState } from 'react'
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
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import Button from '../components/Button'
import FollowCell from '../components/FollowCell'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

//colors
import colors from '../constants/colors'

// big list
import BigList from 'react-native-big-list'

//fakeData
// import { fakeArray as listData } from '../data/images'

//redux
import { loadFollowersFollowing } from '../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

const FollowersScreen = (props) => {
    const { username, userID, followType } = props.route.params
    //data
    const followingsData = useSelector(
        (state) => state.signupReducer.followings
    )

    //dispatch
    const dispatch = useDispatch()

    //insets
    const insets = useSafeAreaInsets()

    // go back
    const goBack = useCallback(() => {
        props.navigation.goBack()
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
    const animatedValue = useSharedValue(
        followType === 'following' ? 0 : -(width - width / 2)
    )
    const animatedStyle = useAnimatedStyle(() => {
        return {
            right: animatedValue.value,
            backgroundColor: colors.nPButton,
            width: '50%',
            height: 5,
        }
    })
    const startAnimationRight = async () => {
        animatedValue.value = withTiming(-(width - width / 2), {
            duration: 100,
        })
        await loadFollows(userID, 'followers')
    }
    const startAnimationMiddle = () => {
        animatedValue.value = withTiming(-(width - width / 2 - width / 3), {
            duration: 100,
        })
    }
    const startAnimationLeft = async () => {
        animatedValue.value = withTiming(0, { duration: 100 })
        await loadFollows(userID, 'followings')
    }
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    const render = useCallback(({ item, index }) => {
        return <FollowCell data={item} />
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
                renderItem={render}
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

export default FollowersScreen
