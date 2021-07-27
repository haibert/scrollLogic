import React, { useState, useRef } from 'react'
import {
    AppRegistry,
    StyleSheet,
    View,
    Animated,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Pressable,
    Platform,
} from 'react-native'
import Reanimated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    interpolate,
} from 'react-native-reanimated'
//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//custom components
import NeumorphicButton from './NeumorphicButton'
import ScaleButton from './TouchableScale'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

//expo qr scanner
import { BarCodeScanner } from 'expo-barcode-scanner'

const { width } = Dimensions.get('screen')

const FloatingButton = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    const tabBarBottomPosition = insets.bottom > 0 ? insets.bottom + 5 : 5

    const reanimatedValue = useSharedValue(0)

    const reOpen = useSharedValue(false)

    const reToggleOpen = () => {
        const toValue = reOpen.value ? 0 : 1
        reanimatedValue.value = withTiming(toValue, {
            duration: 200,
        })
        reOpen.value = !reOpen.value
    }

    const reReloadStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: reanimatedValue.value,
                },
                {
                    translateY: interpolate(
                        reanimatedValue.value,
                        [0, 1],
                        [0, -70]
                    ),
                },
            ],
        }
    })

    const reOrderStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: reanimatedValue.value,
                },
                {
                    translateY: interpolate(
                        reanimatedValue.value,
                        [0, 1],
                        [0, -140]
                    ),
                },
            ],
        }
    })

    const reLabelStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        reanimatedValue.value,
                        [0, 1],
                        [-30, -90]
                    ),
                },
            ],
            opacity: interpolate(reanimatedValue.value, [0, 0.5, 1], [0, 0, 1]),
        }
    })

    const reLabelStyle2 = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        reanimatedValue.value,
                        [0, 1],
                        [-30, -90]
                    ),
                },
            ],
            opacity: interpolate(reanimatedValue.value, [0, 0.5, 1], [0, 0, 1]),
        }
    })

    const reBgStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(reanimatedValue.value, [0, 1], [0, 35]),
                },
            ],
        }
    })

    return (
        <View style={{ ...styles.container, ...props.style }}>
            <Reanimated.View
                style={[styles.background, reBgStyle]}
                onTouchStart={reToggleOpen}
            ></Reanimated.View>
            <TouchableWithoutFeedback
                onPress={() => {
                    reToggleOpen()
                    props.onCreateEventPressed()
                }}
            >
                <Reanimated.View
                    style={[styles.button, styles.other, reReloadStyle]}
                >
                    <Reanimated.Text style={[styles.label, reLabelStyle]}>
                        Create Gallery
                    </Reanimated.Text>
                    <Ionicons
                        name="images-outline"
                        size={20}
                        color={colors.nPButton}
                    ></Ionicons>
                </Reanimated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
                onPress={() => {
                    reToggleOpen()
                    props.onJoinEventPressed()
                }}
            >
                <Reanimated.View
                    style={[styles.button, styles.other, reOrderStyle]}
                >
                    <Reanimated.Text style={[styles.label, reLabelStyle2]}>
                        Join Gallery
                    </Reanimated.Text>

                    <Ionicons
                        name="qr-code-outline"
                        size={20}
                        color={colors.nPButton}
                    ></Ionicons>
                </Reanimated.View>
            </TouchableWithoutFeedback>

            <ScaleButton
                activeScale={0.8}
                onPress={reToggleOpen}
                contentContainerStyle={[styles.button, styles.pay]}
            >
                <LinearGradient
                    colors={[colors.mainColorP3, colors.nPButton]}
                    style={styles.buttonBorder}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.3, y: 0.3 }}
                >
                    <LinearGradient
                        colors={[colors.mainColorP3, colors.nPButton]}
                        style={styles.button}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0.3, y: 0.3 }}
                    >
                        <Icon
                            name="plus"
                            type="material-community"
                            size={38}
                            color={'white'}
                        />
                    </LinearGradient>
                </LinearGradient>
            </ScaleButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //uncomment this for the old nav bar to work
    },
    background: {
        backgroundColor: 'rgba(0,0,0,.5)',
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    button: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 1,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
    },
    buttonBorder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#333',
        shadowOpacity: 1,
        shadowOffset: { x: 2, y: 0 },
        shadowRadius: 2,
    },
    other: {
        backgroundColor: '#FFF',
    },
    payText: {
        color: '#FFF',
    },
    pay: {
        backgroundColor: colors.nPButton,
        shadowColor: 'black',
        shadowRadius: 14,
        shadowOpacity: 0.26,
        shadowOffset: {
            width: 14,
            height: 14,
        },
        elevation: 14,
    },
    label: {
        color: 'white',
        position: 'absolute',
        fontSize: 18,
        backgroundColor: 'transparent',
        width: 120,
    },
})

export default FloatingButton
