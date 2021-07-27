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
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'
import Button from '../../components/Button'
import RequestCell from '../../components/ProfileScreen/RequestCell'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

//colors
import colors from '../../constants/colors'

// big list
import BigList from 'react-native-big-list'

//redux
import {
    getFollowRequests,
    friendRequestResponse,
    setShouldRefreshProfile,
} from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

const NotificationsScreen = (props) => {
    //notifications
    const friendsRequests = useSelector(
        (state) => state.signupReducer.friendRequests
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
    const loadFollows = useCallback(async () => {
        try {
            showLoader()
            await dispatch(getFollowRequests())
        } catch (err) {
            console.log(err)
        }
        setTimeout(hideLoader, 100)
    }, [dispatch, getFollowRequests])

    useEffect(() => {
        loadFollows()
    }, [loadFollows])

    //----------------------------------------------------------------LOAD DATA----------------------------------------------------------------
    //----------------------------------------------------------------ACCEPT / REJECT FRIEND REQUEST----------------------------------------------------------------
    const acceptFriendRequest = useCallback(
        async (followerID, requestID, status) => {
            try {
                await dispatch(setShouldRefreshProfile(true))
                await dispatch(
                    friendRequestResponse(followerID, requestID, status)
                )
            } catch (err) {
                console.log(err)
            }
        },
        [dispatch]
    )

    const rejectFriendRequest = useCallback(
        async (followerID, requestID, status) => {
            console.log('reject friend request')
            try {
                await dispatch(
                    friendRequestResponse(followerID, requestID, status)
                )
            } catch (err) {
                console.log(err)
            }
        },
        [dispatch]
    )
    //----------------------------------------------------------------ACCEPT / REJECT FRIEND REQUEST----------------------------------------------------------------

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    const render = useCallback(({ item, index }) => {
        return (
            <RequestCell
                data={item}
                onAccept={() => {
                    acceptFriendRequest(item.userID, item.id, 'accepted')
                }}
                onReject={() => {
                    rejectFriendRequest(item.userID, item.id, 'rejected')
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
                header="Notifications"
                goBack={goBack}
                headerColor={{ color: colors.darkestColorP1 }}
            />

            <BigList
                data={friendsRequests}
                renderItem={render}
                keyExtractor={keyExtractor}
                itemHeight={width}
                getItemLayout={layOut}
                style={styles.bigList}
                showsVerticalScrollIndicator={true}
            />
            {/* <Animated.View
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
            </Animated.View> */}
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({})

export default NotificationsScreen
