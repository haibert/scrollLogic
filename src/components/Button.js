import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    Platform,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

// colors
import colors from '../constants/colors'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

const Button = (props) => {
    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    return (
        <View style={{ ...styles.button, ...props.style }}>
            <TouchableCmp
                style={styles.touchable}
                onPress={props.onPress}
                activeOpacity={0.5}
            >
                <LinearGradient
                    // colors={['rgba(252,140,250,1)', 'rgba(155,97,234,1)']}
                    colors={[colors.mediumTint, 'rgba(155,97,234,1)']}
                    // colors={[colors.blue3, colors.blue]}
                    style={styles.touchable}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons
                        name={props.iconName ? props.iconName : null}
                        size={20}
                        color="white"
                        style={{ marginRight: 7 }}
                    />
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
        borderRadius: 5,
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
        borderRadius: 5,
        height: 50,
        flexDirection: 'row',
    },
    text: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
})

export default Button
