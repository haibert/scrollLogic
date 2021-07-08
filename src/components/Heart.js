import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
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

    const changeOpacity = () => {
        if (animatedOpacity.value === 0) {
            animatedOpacity.value = 1
            return
        }
        animatedOpacity.value = 0
    }
    return (
        <View
            style={{ ...styles.cont, ...props.style }}
            onTouchStart={changeOpacity}
        >
            <Ionicons
                name="heart-outline"
                size={30}
                color={colors.darkestColorP1}
                style={styles.heart}
            />
            <Animated.View style={[styles.heart, opacity]}>
                <Ionicons
                    name="heart"
                    size={30}
                    color={colors.darkestColorP1}
                />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    cont: {
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
    },
    heart: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
})

export default Heart
