import React, { useCallback } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
    color,
} from 'react-native-reanimated'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//colors
import colors from '../constants/colors'

const Heart = (props) => {
    const animatedOpacity = useSharedValue(0)

    const opacity = useAnimatedStyle(() => {
        return { opacity: animatedOpacity.value }
    })

    const changeOpacity = useCallback(() => {
        if (animatedOpacity.value === 0) {
            animatedOpacity.value = 1
            return
        }
        animatedOpacity.value = 0
    }, [])

    return (
        <Pressable
            style={{ ...styles.cont, ...props.style }}
            onPress={changeOpacity}
        >
            <Ionicons name="heart-outline" size={25} color={'red'} />
            <Animated.View style={[styles.heart, opacity]}>
                <Ionicons name="heart" size={25} color={'red'} />
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cont: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heart: {
        position: 'absolute',
    },
})

export default React.memo(Heart)
