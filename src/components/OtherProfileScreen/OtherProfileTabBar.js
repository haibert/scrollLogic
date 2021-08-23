import React, { useCallback, forwardRef, useImperativeHandle } from 'react'
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

//SVG icons
import PersonsSVG from '../SVGIcons/PersonsSVG'

const OtherProfileTabBar = forwardRef((props, ref) => {
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------
    const animatedValue = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            right: animatedValue.value,
            backgroundColor: colors.currentMainColor,
            width: '50%',
            height: 5,
        }
    })
    const startAnimationRight = useCallback(() => {
        animatedValue.value = withTiming(-(width - width / 2), {
            duration: 0,
        })
    }, [])
    const startAnimationMiddle = useCallback(() => {
        animatedValue.value = withTiming(-(width - width / 2 - width / 2), {
            duration: 0,
        })
    }, [])
    const startAnimationLeft = useCallback(() => {
        animatedValue.value = withTiming(0, { duration: 0 })
    }, [])
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------IMPERATIVE HANDLE----------------------------------------------------------------

    useImperativeHandle(ref, () => ({
        animateToLeft: () => {
            startAnimationLeft()
        },
        animateToMiddle: () => {
            startAnimationMiddle()
        },
        animateToRight: () => {
            startAnimationRight()
        },
    }))
    //----------------------------------------------------------------IMPERATIVE HANDLE----------------------------------------------------------------

    return (
        <View style={styles.columCont}>
            <View
                style={styles.requestsColumButtons}
                onTouchStart={() => {
                    startAnimationLeft()
                    props.onLeftPressed()
                }}
            >
                <Ionicons name="images-outline" size={25} />
            </View>
            <View
                style={styles.requestsColumButtons}
                onTouchStart={() => {
                    startAnimationRight()
                    props.onRightPressed()
                }}
            >
                {/* <Ionicons name="lock-closed-outline" size={30} /> */}
                <Ionicons name="heart-outline" size={25} />
            </View>

            <View style={styles.animatingBar}>
                <Animated.View style={animatedStyle}></Animated.View>
            </View>
        </View>
    )
})

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

export default OtherProfileTabBar
