import React from 'react'
import { View } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from 'react-native-reanimated'
import Svg, { Path, Image, G } from 'react-native-svg'

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

const SearchSVG = ({ color, size }) => {
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
            <Svg width={size} height={size} viewBox="0 0 1387.51 1405.03">
                <G>
                    <AnimatedPath
                        d="M3113.07,3393.37l-317.32-317.32a557.28,557.28,0,0,0,89.67-303.61c0-309.22-251.56-560.78-560.77-560.78s-560.78,251.56-560.78,560.78,251.56,560.77,560.78,560.77a557.17,557.17,0,0,0,281.93-76.33l321.49,321.49a130.81,130.81,0,0,0,185-185ZM1938.29,2772.44c0-213,173.32-386.36,386.36-386.36S2711,2559.4,2711,2772.44s-173.31,386.35-386.35,386.35S1938.29,2985.47,1938.29,2772.44Z"
                        transform="translate(-1763.87 -2211.66)"
                        strokeWidth={1}
                        fill={color}
                        fillRule="evenodd"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        // animatedProps={animatedProps}
                    />
                    <AnimatedPath
                        d="M2638.33,2772.44A312.8,312.8,0,0,0,2378,2463.29a43.6,43.6,0,1,0-14.75,85.95,225.8,225.8,0,0,1,187.83,223.2,43.61,43.61,0,0,0,87.21,0Z"
                        transform="translate(-1763.87 -2211.66)"
                        strokeWidth={1}
                        fill={color}
                        fillRule="evenodd"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        // animatedProps={animatedProps}
                    />
                </G>
            </Svg>
        </View>
    )
}

export default SearchSVG
