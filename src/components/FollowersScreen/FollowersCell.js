import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

//colors
import colors from '../../constants/colors'

//components
import ButtonFlatlist2 from '../../components/ButtonFlatlist2'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//redux
import {
    loadFollowersFollowing,
    followUnfollow,
} from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

const FollowersCell = (props) => {
    //dispatch
    const dispatch = useDispatch()
    // if you are going to use props to set the initial state make sure to use useEffect like you did in OtherFollowingCell
    //----------------------------------------------------------------SET BUTTON TYPE----------------------------------------------------------------
    const [buttonType, setButtonType] = useState(null)
    console.log(
        '🚀 ~ file: FollowersCell.js ~ line 26 ~ FollowersCell ~ buttonType',
        buttonType
    )

    useEffect(() => {
        setButtonType(props.follows)
    }, [props.follows])
    //----------------------------------------------------------------SET BUTTON TYPE----------------------------------------------------------------

    //----------------------------------------------------------------FOLLOW USER----------------------------------------------------------------
    const followPressedHandler = useCallback(async (userID) => {
        try {
            const results = await dispatch(followUnfollow(userID, 'Follow'))
            setButtonType(results)
        } catch (err) {
            console.log('🚨  Error in followPressedHandler', err)
            // setError(error.message)
        }
    }, [])
    //----------------------------------------------------------------FOLLOW USER----------------------------------------------------------------

    //----------------------------------------------------------------UNFOLLOW USER----------------------------------------------------------------
    const unfollowPressedHandler = useCallback(async () => {
        try {
            const results = await dispatch(
                followUnfollow(props.data.userID, 'unFollow', false)
            )
            setButtonType(results)
        } catch (err) {
            console.log('🚨  Error in unfollowPressedHandler', err)
        }
    }, [])
    //----------------------------------------------------------------UNFOLLOW USER----------------------------------------------------------------

    return (
        <Pressable onPress={props.onPress} style={styles.cellOuter}>
            <View style={styles.imageCont}></View>
            <View style={styles.namesCont}>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.galleryName}
                >
                    {props.data.userName}
                </Text>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.username}
                >
                    {`${props.data.firstName} ` + `${props.data.lastName}`}
                </Text>
            </View>

            {/* <Pressable style={styles.followButton}>
                <Text>
                    Follow
                </Text>
            </Pressable> */}

            {props.data.follows ||
            buttonType === 'success' ||
            buttonType === 'pending' ? null : (
                <ButtonFlatlist2
                    buttonContStyle={styles.followButtonCont}
                    style={styles.followButton}
                    title={'Follow'}
                    onPress={() => {
                        followPressedHandler(props.data.userID)
                    }}
                    textStyle={{
                        color: 'white',
                    }}
                />
            )}

            {buttonType === 'pending' ? (
                <ButtonFlatlist2
                    buttonContStyle={styles.followButtonCont}
                    style={styles.pendingButton}
                    title="Pending"
                    onPress={() => {
                        unfollowPressedHandler(props.data.userID)
                    }}
                    textStyle={{
                        color: colors.darkGrey,
                    }}
                />
            ) : null}

            {buttonType === 'unFollowed' ? (
                <ButtonFlatlist2
                    buttonContStyle={styles.followButtonCont}
                    style={styles.followButton}
                    title={'Follow'}
                    onPress={() => {
                        followPressedHandler(props.data.userID)
                    }}
                    textStyle={{
                        color: 'white',
                    }}
                />
            ) : null}

            <ButtonFlatlist2
                buttonContStyle={styles.removeButtonCont}
                style={styles.removeButton}
                title="Remove"
                onPress={() => {
                    props.onRemovePressed()
                }}
            />

            {/* <Ionicons
                name="ellipsis-horizontal"
                size={25}
                style={styles.icon}
                color={colors.lightestColorP1}
                onPress={props.oneEllipsisPressed}
            /> */}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cont: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(235,235,235,1)',
    },
    cellOuter: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    galleryName: {
        fontWeight: 'bold',
    },
    username: {},
    imageCont: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(235,235,235,1)',
        position: 'absolute',
        left: 15,
    },
    namesCont: {
        height: 60,
        position: 'absolute',
        top: 0,
        left: 60,
        justifyContent: 'center',
    },
    followButtonCont: {
        position: 'absolute',
        height: 30,
        width: 70,
        right: 95,
    },
    followButton: {
        height: 30,
        width: 70,
        backgroundColor: colors.currentMainColor,
    },
    removeButtonCont: {
        position: 'absolute',
        height: 30,
        width: 70,
        right: 15,
    },
    removeButton: {
        height: 30,
        width: 70,
        // position: 'absolute',
        borderWidth: 1,
        borderColor: colors.darkGrey,
    },
    pendingButton: {
        height: 30,
        width: 70,
        borderWidth: 1,
        borderColor: colors.currentMainColor,
    },
    emptyButton: {
        height: 0,
        width: 0,
    },
})

export default FollowersCell
