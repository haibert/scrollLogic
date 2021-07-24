import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import colors from '../../constants/colors'

//components
import ButtonFlatlist from '../ButtonFlatlist'

//fast image
import FastImage from 'react-native-fast-image'

//bottom sheet
// import {
//     TouchableOpacity,
//     TouchableWithoutFeedback,
// } from '@gorhom/bottom-sheet'

//ionicons
import { Ionicons } from '@expo/vector-icons'

const RequestCell = (props) => {
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = () => {
        const imageString = `${props.data.avatar}`
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
        <View onPress={() => {}} style={styles.cellOuter}>
            <FastImage
                style={styles.imageCont}
                resizeMode={FastImage.resizeMode.cover}
                source={{
                    uri: normalizedSource(),
                    priority: FastImage.priority.normal,
                }}
            />
            <View style={styles.namesCont}>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.galleryName}
                >
                    {`${props.data.firstName} ` + `${props.data.lastName}`}
                </Text>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.username}
                >
                    {`@${props.data.userName}`}
                </Text>
            </View>
            <ButtonFlatlist
                buttonContStyle={styles.buttonContStyle}
                style={styles.button}
                title="Accept"
                iconName="checkmark-outline"
                onPress={props.onAccept}
            />
            <ButtonFlatlist
                buttonContStyle={styles.buttonContStyle}
                style={styles.buttonReject}
                title="Cancel"
                iconName="close-outline"
                onPress={props.onReject}
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
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageCont: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(235,235,235,1)',
        position: 'absolute',
        left: 10,
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
        right: 10,
        backgroundColor: colors.lightestColorP1,
    },
    galleryName: {
        fontWeight: 'bold',
    },
    username: {},
})

export default RequestCell
