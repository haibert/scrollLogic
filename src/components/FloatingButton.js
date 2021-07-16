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

//colors
import colors from '../constants/colors'

const { width } = Dimensions.get('screen')

const FloatingButton = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    const tabBarBottomPosition = insets.bottom > 0 ? insets.bottom + 5 : 5

    const AnimatedValue = useState(new Animated.Value(0))[0]
    const reanimatedValue = useSharedValue(0)

    let open = useRef(false).current
    const reOpen = useSharedValue(false)

    const toggleOpen = () => {
        const toValue = open ? 0 : 1
        Animated.timing(AnimatedValue, {
            toValue,
            duration: 200,
            useNativeDriver: false,
        }).start()

        open = !open
    }

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
                    scale: interpolate(reanimatedValue.value, [0, 1], [0, 50]),
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
            <TouchableWithoutFeedback onPress={props.onCreateEventPressed}>
                <Reanimated.View
                    style={[styles.button, styles.other, reReloadStyle]}
                >
                    <Reanimated.Text style={[styles.label, reLabelStyle]}>
                        Create Gallery
                    </Reanimated.Text>
                    <Ionicons
                        name="images-outline"
                        size={20}
                        color="#555"
                    ></Ionicons>
                </Reanimated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={props.onJoinEventPressed}>
                <Reanimated.View
                    style={[styles.button, styles.other, reOrderStyle]}
                >
                    <Reanimated.Text style={[styles.label, reLabelStyle2]}>
                        Join Gallery
                    </Reanimated.Text>

                    <Ionicons
                        name="qr-code-outline"
                        size={20}
                        color="#555"
                    ></Ionicons>
                </Reanimated.View>
            </TouchableWithoutFeedback>

            <View style={[styles.button, styles.pay]}>
                <TouchableWithoutFeedback onPress={reToggleOpen}>
                    <View>
                        {/* <Animated.Text style={[styles.label, labelStyle]}>
                            Pay
                        </Animated.Text> */}

                        <Icon
                            name="plus"
                            type="material-community"
                            size={38}
                            // color={colors.textColor}
                            color={'white'}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: {
        backgroundColor: 'rgba(0,0,0,.5)',
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 20,
        right: 20,
        borderRadius: 30,
    },
    button: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#333',
        shadowOpacity: 0.1,
        shadowOffset: { x: 2, y: 0 },
        shadowRadius: 2,
        borderRadius: 30,
        position: 'absolute',
    },
    other: {
        backgroundColor: '#FFF',
    },
    payText: {
        color: '#FFF',
    },
    pay: {
        backgroundColor: colors.nPButton,
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
