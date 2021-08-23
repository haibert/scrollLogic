import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

import colors from '../../constants/colors'

//components
import ButtonFlatlist2 from '../../components/ButtonFlatlist2'

//redux
import { followUnfollow } from '../../store/signup-auth/actions'
import { useDispatch } from 'react-redux'

// rename to common following cell if no changes between profile and other profile uses
const OtherFollowingCell = ({ data, onPress, isCurrentUser, follows }) => {
    //dispatch
    const dispatch = useDispatch()
    // console.log('rendered cell')
    //----------------------------------------------------------------SET BUTTON TYPE----------------------------------------------------------------
    const [buttonType, setButtonType] = useState(follows)

    useEffect(() => {
        setButtonType(follows)
    }, [follows])
    //----------------------------------------------------------------SET BUTTON TYPE----------------------------------------------------------------

    //----------------------------------------------------------------FOLLOW USER----------------------------------------------------------------
    const followPressedHandler = useCallback(async (userID) => {
        try {
            const results = await dispatch(followUnfollow(userID, 'Follow'))
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
                followUnfollow(data.userID, 'unFollow', false)
            )
            setButtonType(results)
        } catch (err) {
            console.log('🚨  Error in unfollowPressedHandler', err)
        }
    }, [])
    //----------------------------------------------------------------UNFOLLOW USER----------------------------------------------------------------
    if (isCurrentUser) {
        return (
            <Pressable onPress={onPress} style={styles.cellOuter}>
                <View style={styles.imageCont}></View>
                <View style={styles.namesCont}>
                    <Text
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        style={styles.galleryName}
                    >
                        {data.userName}
                    </Text>
                    <Text
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        style={styles.username}
                    >
                        {`${data.firstName} ` + `${data.lastName}`}
                    </Text>
                </View>
            </Pressable>
        )
    }
    return (
        <Pressable onPress={onPress} style={styles.cellOuter}>
            <View style={styles.imageCont}></View>
            <View style={styles.namesCont}>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.galleryName}
                >
                    {data.userName}
                </Text>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.username}
                >
                    {`${data.firstName} ` + `${data.lastName}`}
                </Text>
            </View>

            {buttonType === 'unFollowed' ? (
                <ButtonFlatlist2
                    buttonContStyle={styles.followButtonCont}
                    style={styles.followButton}
                    title="Follow"
                    onPress={() => {
                        followPressedHandler(data.userID)
                    }}
                    textStyle={{
                        color: 'white',
                    }}
                />
            ) : null}

            {buttonType === 'pending' ? (
                <ButtonFlatlist2
                    buttonContStyle={styles.followButtonCont}
                    style={styles.pendingButton}
                    title="Pending"
                    onPress={() => {
                        unfollowPressedHandler(data.userID)
                    }}
                    textStyle={{
                        color: colors.darkGrey,
                    }}
                />
            ) : null}

            {buttonType === 'follows' || buttonType === 'success' ? (
                <ButtonFlatlist2
                    buttonContStyle={styles.buttonCont}
                    style={styles.buttonSecondaryStyle}
                    title="Following"
                    onPress={() => {
                        unfollowPressedHandler(data.userID)
                    }}
                    textStyle={{
                        color: colors.darkGrey,
                    }}
                />
            ) : null}
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
    galleryName: {
        fontWeight: 'bold',
    },
    username: {},
    buttonCont: {
        position: 'absolute',
        height: 30,
        right: 15,
        width: 90,
    },
    button: {
        height: 30,
        width: 90,
        position: 'absolute',
        right: 90,
    },
    buttonPrimaryStyle: {
        height: 30,
        width: 90,
        backgroundColor: colors.currentMainColor,
    },
    buttonSecondaryStyle: {
        height: 30,
        width: 90,
        borderWidth: 1,
    },
    followButtonCont: {
        position: 'absolute',
        height: 30,
        width: 90,
        right: 15,
    },
    pendingButton: {
        height: 30,
        width: 90,
        borderWidth: 1,
        borderColor: colors.currentMainColor,
    },
    followButton: {
        height: 30,
        width: 90,
        backgroundColor: colors.currentMainColor,
    },
})

export default OtherFollowingCell
