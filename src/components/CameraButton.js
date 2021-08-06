import React, { useRef } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import {
    LongPressGestureHandler,
    TapGestureHandler,
    TapGestureHandlerStateChangeEvent,
    LongPressGestureHandlerStateChangeEvent,
    State,
} from 'react-native-gesture-handler'
import Animated, {
    useSharedValue,
    useAnimatedRef,
    withTiming,
    useAnimatedProps,
    cancelAnimation,
    useAnimatedStyle,
    withSequence,
    runOnJS,
} from 'react-native-reanimated'
import Svg, { Circle, G } from 'react-native-svg'

import colors from '../constants/colors'

const { width } = Dimensions.get('window')

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
let percentage = 100
let max = 100
const radius = 45
const strokeWidth = 8
const halfCircle = radius + strokeWidth
const circleCircumference = 2 * Math.PI * radius
const maxValue = (100 * percentage) / max

const CameraButton = (props) => {
    const longRef = useRef()
    const tapRef = useRef()

    //animation
    const circleRef = useAnimatedRef()
    const animatedValue = useSharedValue(circleCircumference)
    const animatedScale = useSharedValue(1)
    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: animatedValue.value,
        }
    })
    const startAnim = () => {
        animatedValue.value = circleCircumference
        const toValue =
            circleCircumference - (circleCircumference * maxValue) / 100
        animatedValue.value = withTiming(
            toValue,
            {
                duration: 9500,
            },
            (finished) => {
                if (finished) {
                    console.log('ANIMATION ENDED')
                    stopRecording()
                }
            }
        )
        animatedScale.value = withSequence(
            withTiming(0.9, {
                duration: 100,
            }),
            withTiming(1.2, {
                duration: 300,
            })
        )
    }
    const stopRecording = () => {
        'worklet'
        runOnJS(props.onEndPress)()
    }
    const stopAnim = () => {
        cancelAnimation(animatedValue)
        animatedValue.value = circleCircumference
        animatedScale.value = withTiming(1, {
            duration: 200,
        })
    }
    const outerCont = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: animatedScale.value,
                },
            ],
        }
    })
    // Gesture Handlers
    const onTapStateChange = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            console.log('Tap active')
        }

        if (event.nativeEvent.state === State.END) {
            console.log('Tap End')
            props.onTap()
        }
    }
    const onLongStateChange = (event, duration) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            props.onLongPress()
            startAnim()
        }
        if (event.nativeEvent.state === State.END) {
            stopAnim()
            props.onEndPress()
        }
        if (event.nativeEvent.state === State.CANCELLED) {
            stopAnim()
            props.onEndPress()
        }
    }

    return (
        <View
            style={{
                ...styles.floatingPlusCont,
                ...props.style,
            }}
        >
            <TapGestureHandler
                onHandlerStateChange={onTapStateChange}
                ref={tapRef}
                maxDeltaX={1000}
                maxDeltaY={1000}
                style={styles.floatingPlusCont}
            >
                <LongPressGestureHandler
                    ref={longRef}
                    minDurationMs={200}
                    maxDist={1000}
                    onHandlerStateChange={onLongStateChange}
                    shouldCancelWhenOutside={false}
                >
                    <Animated.View style={outerCont}>
                        <Svg
                            width={radius * 2}
                            height={radius * 2}
                            viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
                        >
                            <G
                                rotation="-90"
                                origin={`${halfCircle}, ${halfCircle}`}
                            >
                                <AnimatedCircle
                                    strokeWidth={strokeWidth}
                                    r={radius}
                                    cx="50%"
                                    cy="50%"
                                    fill="none"
                                    stroke="white"
                                    strokeOpacity={1}
                                    // strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                                />
                                <AnimatedCircle
                                    ref={circleRef}
                                    strokeWidth={13}
                                    r={radius}
                                    cx="50%"
                                    cy="50%"
                                    fill="none"
                                    stroke={colors.lightTint}
                                    strokeDasharray={circleCircumference}
                                    strokeDashoffset={circleCircumference}
                                    strokeLinecap="butt"
                                    animatedProps={animatedProps}
                                />
                            </G>
                        </Svg>
                    </Animated.View>
                </LongPressGestureHandler>
            </TapGestureHandler>
        </View>
    )
}

const styles = StyleSheet.create({
    bigPlusButton: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 7,
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingPlusCont: {
        width: 180,
        height: 180,
        borderRadius: 90,
    },
})

export default CameraButton
