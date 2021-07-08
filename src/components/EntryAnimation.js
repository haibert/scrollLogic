import React, { useEffect } from 'react'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useDerivedValue,
    interpolate,
    withDelay,
    withTiming,
    InteractionManager,
} from 'react-native-reanimated'

//focus effect
import { useFocusEffect } from '@react-navigation/native'

export const EntryAnimation = ({ children, index, ...props }) => {
    const play = useSharedValue(false)
    const progress = useDerivedValue(() => {
        return play.value
            ? withDelay(110 * (index ?? 0), withTiming(1, { duration: 500 }))
            : 0
    })

    useEffect(() => {
        play.value = true
    }, [])

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(progress.value, [0, 1], [0, 1])
        const translateX = interpolate(progress.value, [0, 1], [80, 0])

        return {
            opacity,
            transform: [{ translateX }],
        }
    })

    return (
        <Animated.View style={[animatedStyle, props.style]}>
            {children}
        </Animated.View>
    )
}
