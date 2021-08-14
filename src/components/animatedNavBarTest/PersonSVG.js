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

const PersonSVG = ({ color, size }) => {
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
            <Svg width={size} height={size} viewBox="-20 -20 400 400">
                <G>
                    <Circle
                        class="cls-1"
                        cx="156.49"
                        cy="75.86"
                        r="73.36"
                        stroke={color}
                        strokeWidth={31}
                    />
                    <Path
                        class="cls-2"
                        d="M354,371.89a154,154,0,0,0-308,0"
                        transform="translate(-43.51 -25.61)"
                        stroke={color}
                        strokeWidth={31}
                    />
                </G>
            </Svg>
        </View>
    )
}

export default PersonSVG
