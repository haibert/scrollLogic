import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

// colors
import colors from '../constants/colors'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

const Button = (props) => {
    return (
        <View style={{ ...styles.button, ...props.style }}>
            <TouchableOpacity
                style={styles.touchable}
                onPress={props.onPress}
                activeOpacity={0.5}
            >
                <LinearGradient
                    colors={['rgba(252,140,250,1)', 'rgba(155,97,234,1)']}
                    style={styles.touchable}
                >
                    <Text
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        style={{ ...styles.text, ...props.textStyle }}
                    >
                        {props.text}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: colors.buttonColor,
        borderRadius: 5,
    },
    touchable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minWidth: '100%',
        borderRadius: 5,
        height: 50,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
})

export default Button
