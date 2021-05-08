import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

// colors
import colors from '../constants/colors'

const CustomInput = (props) => {
    return (
        <View style={{ height: 50, ...props.viewStyle }}>
            <View style={styles.view}>
                <TextInput
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={{ ...styles.input, ...props.textStyle }}
                    keyboardType={props.keyboardType}
                    placeholder={props.placeholder}
                    placeholderTextColor={colors.placeHolder}
                    selectionColor={colors.lightTint}
                    underlineColorAndroid="rgba(255,255,255,0)"
                    onChangeText={props.onChangeText}
                    value={props.value}
                    autoFocus={props.autoFocus}
                ></TextInput>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        borderBottomWidth: 1,
        borderBottomColor: colors.bottomBorderTint,
        flex: 1,
        width: '100%',
        minWidth: '100%',
    },
    input: {
        height: 50,
        padding: 10,
        color: colors.textColor,
        fontSize: 17,
    },
})

export default CustomInput
