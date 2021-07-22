import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import colors from '../constants/colors'

//components
import ButtonFlatlist2 from '../components/ButtonFlatlist2'

//ionicons
import { Ionicons } from '@expo/vector-icons'

const FollowCell = (props) => {
    return (
        <View onPress={() => {}} style={styles.cellOuter}>
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
                style={styles.buttonReject}
                title="Follow"
            />
        </View>
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
    buttonReject: {
        height: 30,
        width: 70,
        position: 'absolute',
        right: 15,
        // backgroundColor: colors.lightestColorP1,
    },
    galleryName: {
        fontWeight: 'bold',
    },
    username: {},
})

export default FollowCell
