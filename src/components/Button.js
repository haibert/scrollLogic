import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native'
import * as IosTouchable from 'react-native-gesture-handler'

// colors
import colors from '../constants/colors'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

const Button = (props) => {
    let TouchableCmp = IosTouchable.TouchableOpacity

    if (Platform.OS === 'android') {
        TouchableCmp = TouchableOpacity
    }

    return (
        <View style={{ ...styles.button, ...props.style }}>
            <TouchableCmp
                style={{
                    ...styles.touchable,
                    borderRadius: props.style?.borderRadius
                        ? props.style?.borderRadius
                        : 15,
                }}
                onPress={props.onPress}
                activeOpacity={0.5}
            >
                <LinearGradient
                    // colors={['rgba(252,140,250,1)', 'rgba(155,97,234,1)']}
                    colors={[colors.nPButton, colors.nPButton]}
                    // colors={[colors.mediumTint, 'rgba(155,97,234,1)']}
                    // colors={[colors.blue3, colors.blue]}
                    style={{
                        ...styles.touchable,
                        borderRadius: props.style?.borderRadius
                            ? props.style?.borderRadius
                            : 15,
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {props.iconName ? (
                        <Ionicons
                            name={props.iconName ? props.iconName : null}
                            size={20}
                            color="white"
                            style={{ marginRight: 7 }}
                        />
                    ) : null}
                    <Text
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        style={{ ...styles.text, ...props.textStyle }}
                    >
                        {props.text}
                    </Text>
                </LinearGradient>
            </TouchableCmp>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: colors.buttonColor,
        borderRadius: 15,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.4,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 5,
    },
    touchable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minWidth: '100%',
        borderRadius: 15,
        height: '100%',
        flexDirection: 'row',
    },
    text: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
})

export default Button
