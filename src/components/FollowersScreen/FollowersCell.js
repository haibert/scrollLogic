import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

//colors
import colors from '../../constants/colors'

//components
import ButtonFlatlist2 from '../../components/ButtonFlatlist2'

//ionicons
import { Ionicons } from '@expo/vector-icons'

const FollowersCell = (props) => {
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

            <ButtonFlatlist2
                buttonContStyle={styles.buttonContStyle}
                style={styles.followBack}
                title="Follow"
            />

            <Ionicons
                name="ellipsis-horizontal-outline"
                size={25}
                style={styles.icon}
                color={colors.lightestColorP1}
                onPress={props.oneEllipsisPressed}
            />
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
    buttonContStyle: {
        position: 'absolute',
        height: 30,
        right: 0,
    },
    button: {
        height: 30,
        width: 70,
        position: 'absolute',
        right: 90,
    },
    galleryName: {
        fontWeight: 'bold',
    },
    username: {},
    icon: {
        position: 'absolute',
        right: 15,
    },
    followBack: {
        height: 30,
        width: 70,
        position: 'absolute',
        right: 60,
    },
})

export default FollowersCell
