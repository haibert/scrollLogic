import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import colors from '../../constants/colors'

//components
import ButtonFlatlist from '../../components/ButtonFlatlist'

//bottom sheet
// import {
//     TouchableOpacity,
//     TouchableWithoutFeedback,
// } from '@gorhom/bottom-sheet'

//ionicons
import { Ionicons } from '@expo/vector-icons'

const GalRequestCell = (props) => {
    const [checked, setChecked] = useState()
    return (
        <View
            onPress={() => {
                setChecked((prevState) => !prevState)
            }}
            style={styles.cellOuter}
        >
            <View style={styles.imageCont}></View>
            <View style={styles.namesCont}>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.galleryName}
                >
                    Gallery Name
                </Text>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.username}
                >
                    @username
                </Text>
            </View>
            <ButtonFlatlist
                buttonContStyle={styles.buttonContStyle}
                style={styles.button}
                title="Confirm"
                iconName="checkmark-outline"
            />
            <ButtonFlatlist
                buttonContStyle={styles.buttonContStyle}
                style={styles.buttonReject}
                title="Cancel"
                iconName="close-outline"
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

export default GalRequestCell
