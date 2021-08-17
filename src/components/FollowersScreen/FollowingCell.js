import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

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

const FollowingCell = (props) => {
    //dispatch
    const dispatch = useDispatch()
    //----------------------------------------------------------------FOLLOW USER----------------------------------------------------------------
    const [buttonType, setButtonType] = useState(null)
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

            {!props.data.follows || buttonType === 'success' ? (
                <ButtonFlatlist2
                    buttonContStyle={styles.followButtonCont}
                    style={
                        buttonType === 'pending'
                            ? styles.pendingButton
                            : buttonType === 'success'
                            ? styles.buttonSecondaryStyle
                            : styles.followButton
                    }
                    title={
                        buttonType === 'pending'
                            ? 'Pending'
                            : buttonType === 'success'
                            ? 'Following'
                            : 'Follow'
                    }
                    onPress={() => {
                        followPressedHandler(props.data.userID)
                    }}
                    textStyle={{
                        color:
                            buttonType === 'pending' || buttonType === 'success'
                                ? colors.darkGrey
                                : 'white',
                    }}
                />
            ) : null}

            {props.data.follows ? (
                <ButtonFlatlist2
                    buttonContStyle={styles.buttonCont}
                    style={
                        props.data.follows
                            ? styles.buttonSecondaryStyle
                            : styles.buttonPrimaryStyle
                    }
                    title="Following"
                    onPress={props.onUnfollowPressed}
                    textStyle={{
                        color: props.data.follows ? colors.darkGrey : 'white',
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

export default FollowingCell
