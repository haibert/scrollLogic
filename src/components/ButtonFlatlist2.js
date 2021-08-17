import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

//colors
import colors from '../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

const ButtonFlatlist2 = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={{ ...styles.const, ...props.buttonContStyle }}
        >
            <View style={{ ...styles.button, ...props.style }}>
                <Text
                    style={{ ...styles.text, ...props.textStyle }}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    const: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        padding: 3,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: colors.darkGrey,
        fontSize: 14,
        textAlign: 'center',
    },
})

export default ButtonFlatlist2
