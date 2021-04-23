import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

// colors
import colors from '../constants/colors'

const CustomInput = (props) => {
    return (
        <View style={{ ...styles.button, ...props.viewStyle }}>
            <TextInput
                maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                style={{ ...styles.text, ...props.textStyle }}
                keyboardType={props.keyboardType}
                placeholder={props.placeholder}
                placeholderTextColor={colors.placeHolder}
                selectionColor={colors.lightTint}
                underlineColorAndroid="rgba(255,255,255,0)"
            >
                {props.children}
            </TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        height: 50,
    },

    Input: {
        input: {
            height: 50,
            borderRadius: 5,
            padding: 10,
            color: colors.textColor,
            fontSize: 17,
        },
    },
})

export default CustomInput
