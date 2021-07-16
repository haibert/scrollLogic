import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Text } from 'react-native'

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

const InputComponent = (props) => {
    return (
        <View style={styles.cellOuter}>
            <View style={styles.imageCont}></View>
            <View style={styles.inputWrapper}>
                <TextInput
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.input}
                    multiline
                    onFocus={props.onFocus}
                />
                <Text style={styles.postFaker}>Post</Text>
                <Text style={styles.post}>Post</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cellOuter: {
        height: 90,
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderTopColor: colors.inputBorderColor,
        borderTopWidth: 1,
    },
    imageCont: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(235,235,235,1)',
        position: 'absolute',
        left: 10,
        top: 15,
    },
    button: {
        height: 30,
        width: 70,
        position: 'absolute',
        right: 90,
    },
    inputWrapper: {
        position: 'absolute',
        top: 10,
        left: 60,
        bottom: 10,
        right: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: colors.inputBorderColor,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    input: {
        fontSize: 13,
        flexWrap: 'wrap',
        flex: 1,
    },
    postFaker: {
        color: 'transparent',
    },
    post: {
        color: colors.nPButton,
        position: 'absolute',
        right: 10,
    },
})

export default InputComponent
