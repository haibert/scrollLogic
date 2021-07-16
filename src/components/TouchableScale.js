import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withSpring,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
const ScaleButton = ({
    haptics,
    children,
    onPress = () => {},
    activeScale = 0.9,
    springConfig = {
        damping: 20,
        mass: 1,
        stiffness: 500,
    },
    contentContainerStyle,
    animatedStyle,
}) => {
    const scale = useSharedValue(1)
    const sz = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: scale.value,
                },
            ],
        }
    })
    function runOnJSPlease() {
        'worklet'
        runOnJS(onPress)()
    }
    const animateIn = () => {
        scale.value = activeScale
    }
    const animateOut = () => {
        scale.value = withSpring(1, springConfig)
    }
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                runOnJSPlease()
                if (haptics) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
            }}
            onPressIn={animateIn}
            onPressOut={animateOut}
        >
            <Animated.View style={[sz, contentContainerStyle, animatedStyle]}>
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}
const s = StyleSheet.create()
export default ScaleButton
