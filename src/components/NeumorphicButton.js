import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableWithoutFeedback,
} from 'react-native'
import PropTypes from 'prop-types'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//custom components
import NavTouchableScale from './NavTouchableScale'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//colors
import colors from '../constants/colors'
import { color } from 'react-native-reanimated'

const NeumorphicButton = (props) => {
    const { size = 7, shadowRadius = 10, shadowOffset = 14, isFocused } = props
    const [isDown, setDown] = useState(false)
    const handlePressIn = useCallback(() => {
        setDown(true)
    }, [setDown])
    const handlePressOut = useCallback(() => {
        setDown(false)
    }, [setDown])

    const gradColors = isFocused
        ? ['#f3f3f3', '#c2c2c2']
        : ['#d1d1d1', '#eeeeee']

    const shaDownOffsetState = isFocused ? -shadowOffset : shadowOffset

    const borderColors = isFocused
        ? ['#dddddd', '#f5f5f5']
        : ['#f5f5f5', '#dddddd']
    const borderEnd = isDown || isFocused ? { x: 1, y: 1 } : { x: 0.5, y: 0.5 }
    const borderStart = isFocused ? { x: 0.5, y: 0.5 } : { x: 0, y: 0 }

    //#F2F2F2

    const buttonCommonStyle = {
        shadowRadius: shadowRadius,
    }
    const buttonOuterStyle = {
        shadowOffset: { width: shaDownOffsetState, height: shaDownOffsetState },
    }
    const buttonInnerStyle = {
        shadowOffset: {
            width: -shaDownOffsetState,
            height: -shaDownOffsetState,
        },
    }
    const buttonFaceStyle = {
        borderRadius: 13,
        padding: props.contentPadding,
        alignItems: 'center',
        justifyContent: 'center',
    }
    return (
        <NavTouchableScale
            activeScale={0.7}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={props.onPress}
            contentContainerStyle={props.style}
        >
            <View
                style={[
                    styles.buttonOuter,
                    buttonCommonStyle,
                    buttonOuterStyle,
                ]}
            >
                <View
                    style={[
                        styles.buttonInner,
                        buttonCommonStyle,
                        buttonInnerStyle,
                    ]}
                >
                    {/* <LinearGradient
                        style={{
                            padding: 3,
                            borderRadius: 15,
                        }}
                        colors={borderColors}
                        start={borderStart}
                        end={borderEnd}
                    > */}
                    <LinearGradient
                        colors={gradColors}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0.3, y: 0.3 }}
                        style={buttonFaceStyle}
                    >
                        {props.iconName ? (
                            <Ionicons
                                name={props.iconName}
                                color={colors.mainColorP2}
                                size={28}
                            />
                        ) : null}
                        {props.text ? (
                            <Text
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                                style={styles.text}
                            >
                                {props.text}
                            </Text>
                        ) : null}
                    </LinearGradient>
                    {/* </LinearGradient> */}
                </View>
            </View>
        </NavTouchableScale>
    )
}

const styles = StyleSheet.create({
    buttonOuter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 15,
        shadowOffset: { width: 12, height: 12 },
        shadowColor: '#c9c9c9',
        shadowOpacity: 1.0,
        shadowRadius: 30,
        elevation: 3,
    },
    buttonInner: {
        backgroundColor: '#dbdbdb',
        borderRadius: 15,
        shadowOffset: { width: -12, height: -12 },
        shadowColor: '#ffffff',
        shadowOpacity: 0.9,
        shadowRadius: 30,
        elevation: 3,
    },
    buttonFace: {
        borderRadius: 15,
        padding: 12,
        flex: 1,
    },
    text: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.mainColorP2,
    },
})

NeumorphicButton.propTypes = {
    shadowOffset: PropTypes.number.isRequired,
    contentPadding: PropTypes.number.isRequired,
    shadowRadius: PropTypes.number.isRequired,
}

export default NeumorphicButton
