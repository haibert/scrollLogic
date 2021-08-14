import React from 'react'
import { View } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from 'react-native-reanimated'
import Svg, { Path, Image, G, Line } from 'react-native-svg'

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

const CameraSVG = ({ color, size }) => {
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
                    <Path
                        d="M292.47,225.18a74.84,74.84,0,1,1-74.84-74.83A74.87,74.87,0,0,1,292.47,225.18Z"
                        transform="translate(-67.99 -97.34)"
                        stroke={color}
                        strokeWidth={18}
                    />
                    <Path
                        d="M263.92,225.18a46.29,46.29,0,1,1-46.29-46.29A46.34,46.34,0,0,1,263.92,225.18Z"
                        transform="translate(-67.99 -97.34)"
                        stroke={color}
                        strokeWidth={18}
                    />
                    <Line
                        x1="26.44"
                        y1="10.92"
                        x2="49.78"
                        y2="10.92"
                        stroke={color}
                        strokeWidth={18}
                    />
                    <Path
                        d="M138.87,279.73H113.31c-30.37,0-42.82-24.72-42.82-48.38V170.6c0-33.55,20.75-37.52,27.63-37.52H150s21.41-33.24,32.76-33.24h72.49c17.24,0,31.95,33.24,31.95,33.24,18.33,0,42.32,6.4,42.32,37.39v54.78c0,50.25-23.55,54.48-30.43,54.48H296"
                        transform="translate(-67.99 -97.34)"
                        stroke={color}
                        strokeWidth={18}
                    />
                    <Path
                        d="M77.81,152.17a4.38,4.38,0,1,1-4.37-4.38A4.36,4.36,0,0,1,77.81,152.17Z"
                        transform="translate(-22.93 -62.5)"
                        fill={color}
                        strokeWidth={18}
                        stroke={color}
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

export default CameraSVG
