import React, { useCallback } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
//reanimated
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'

//width height
const { width, height } = Dimensions.get('window')

//ionicons
import { Ionicons } from '@expo/vector-icons'

//colors
import colors from '../../constants/colors'

const AnimatedTabBar = (props) => {
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------
    const animatedValue = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            right: animatedValue.value,
            backgroundColor: colors.nPButton,
            width: '33%',
            height: 5,
        }
    })
    const startAnimationRight = useCallback(() => {
        animatedValue.value = withTiming(-(width - width / 3), {
            duration: 0,
        })
    }, [])
    const startAnimationMiddle = useCallback(() => {
        animatedValue.value = withTiming(-(width - width / 3 - width / 3), {
            duration: 0,
        })
    }, [])
    const startAnimationLeft = useCallback(() => {
        animatedValue.value = withTiming(0, { duration: 0 })
    }, [])
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------
    return (
        <View style={styles.columCont}>
            <View
                style={styles.requestsColumButtons}
                onTouchStart={() => {
                    startAnimationLeft()
                    props.onLeftPressed()
                }}
            >
                <Ionicons name="images-outline" size={30} />
            </View>
            <View
                style={styles.requestsColumButtons}
                onTouchStart={() => {
                    startAnimationMiddle()
                    props.onMiddlePressed()
                }}
            >
                <Ionicons name="heart-outline" size={30} />
            </View>
            <View
                style={styles.requestsColumButtons}
                onTouchStart={() => {
                    startAnimationRight()
                }}
            >
                <Ionicons name="lock-closed-outline" size={30} />
            </View>
            <View style={styles.animatingBar}>
                <Animated.View style={animatedStyle}></Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    columCont: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: colors.separatorLine,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    requestsColumButtons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatingBar: {
        height: 5,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
})

export default AnimatedTabBar
