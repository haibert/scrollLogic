import React from 'react'
import { View } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from 'react-native-reanimated'
import Svg, { Path, Circle, G } from 'react-native-svg'

import { parse } from 'react-native-redash'

// import { interpolatePath } from 'd3-interpolate-path'

const AnimatedPath = Animated.createAnimatedComponent(Path)

Animated.addWhitelistedNativeProps({
    stroke: true,
})

// const PATH1 =
//     'M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 11 21 L 11 15 L 13 15 L 13 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z M 12 4.7910156 L 18 10.191406 L 18 11 L 18 19 L 15 19 L 15 13 L 9 13 L 9 19 L 6 19 L 6 10.191406 L 12 4.7910156 z'

// const PATH2 =
//     'M 12 2.0996094 L 1 15 L 4 12 L 4 21 L 20 21 L 20 15 L 13 15 L 15 21 L 20 21 L 20 12 L 23 12 L 15 2.0996094 z M 12 4.7910156 L 18 10.191406 L 18 11 L 18 19 L 15 19 L 15 13 L 9 13 L 9 19 L 6 19 L 6 10.191406 L 12 4.7910156 z'

const PATH1 =
    'M3363.23,2773.47l-558.41-298.09a79.54,79.54,0,0,0-75.15,0l-558.39,298.09a79.76,79.76,0,1,0,75.15,140.72l520.82-278,520.82,278a79.77,79.77,0,0,0,75.16-140.72Z'
const PATH2 = 'M0,0 L10,10'

const PersonsSVG = ({ color, size }) => {
    const progress = useSharedValue(0)

    // const interpolator = interpolatePath(PATH1, PATH2)

    const animatedProps = useAnimatedProps(() => {
        const d = PATH1
        return { d }
    })

    return (
        <View
            onTouchStart={() => {
                progress.value = withTiming(progress.value ? 0 : 1, {
                    duration: 100,
                    easing: Easing.inOut(Easing.cubic),
                })
            }}
        >
            <Svg
                width={size}
                height={size}
                viewBox="-60 -110 400 400"
                style={
                    {
                        // borderWidth: 1,
                    }
                }
            >
                <G>
                    <Circle
                        class="cls-1"
                        cx="128.95"
                        cy="156.08"
                        r="43.69"
                        transform="translate(-107.34 56.53) rotate(-45)"
                        stroke={color}
                        strokeWidth={24}
                    />
                    <Path
                        class="cls-2"
                        d="M37.24,317.14a91.71,91.71,0,0,1,183.42,0"
                        transform="translate(-34.74 -80.36)"
                        stroke={color}
                        strokeWidth={24}
                    />
                    <Circle
                        class="cls-1"
                        cx="271.05"
                        cy="126.55"
                        r="43.69"
                        transform="translate(-51.51 -35.31) rotate(-9.22)"
                        stroke={color}
                        strokeWidth={24}
                    />
                    <Path
                        class="cls-2"
                        d="M362.76,287.61a91.71,91.71,0,0,0-91.71-91.71s-32.46,0-54.39,22.13"
                        transform="translate(-34.74 -80.36)"
                        stroke={color}
                        strokeWidth={24}
                    />
                    {/* <AnimatedPath
                        d="M3363.23,2773.47l-558.41-298.09a79.54,79.54,0,0,0-75.15,0l-558.39,298.09a79.76,79.76,0,1,0,75.15,140.72l520.82-278,520.82,278a79.77,79.77,0,0,0,75.16-140.72Z"
                        transform="translate(-2129.07 -2465.95)"
                        stroke="black"
                        strokeWidth={1}
                        fill="red"
                        fillRule="evenodd"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        // animatedProps={animatedProps}
                    />
                    <AnimatedPath
                        d="M2767.25,2762.75,2275,3025.55v415.19c0,52.66,43.07,95.73,95.73,95.73h793.1c52.66,0,95.73-43.07,95.73-95.73V3025.55Z"
                        transform="translate(-2129.07 -2465.95)"
                        stroke="black"
                        strokeWidth={1}
                        fill="red"
                        fillRule="evenodd"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        // animatedProps={animatedProps}
                    /> */}
                </G>
            </Svg>
        </View>
    )
}

export default PersonsSVG
