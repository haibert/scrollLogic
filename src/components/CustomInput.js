import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

// colors
import colors from '../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

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
                    selectionColor={props.selectionColor}
                    underlineColorAndroid="rgba(255,255,255,0)"
                    onChangeText={props.onChangeText}
                    onChange={props.onChange}
                    value={props.value}
                    autoFocus={props.autoFocus}
                    keyboardAppearance={props.keyboardAppearance}
                    autoCapitalize={props.autoCapitalize}
                    maxLength={props.maxLength}
                />
                <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.darkestColorP1}
                    style={{ opacity: 1 }}
                    onPress={props.onXPressed}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        borderBottomWidth: 1,
        // borderBottomColor: colors.bottomBorderTint,
        flex: 1,
        width: '100%',
        minWidth: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 50,
        padding: 10,
        color: colors.textColor,
        fontSize: 17,
        flex: 1,
    },
})

export default CustomInput
