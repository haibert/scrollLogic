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
            <Svg width={size} height={size} viewBox="0 0 1100 824.51">
                <G>
                    <Path
                        d="M1441.75,662.23h-401a58.32,58.32,0,0,0-58.25,58.26v44.14H550.61A50.68,50.68,0,0,0,500,815.28V1336.1a50.68,50.68,0,0,0,50.61,50.64h898.78A50.68,50.68,0,0,0,1500,1336.1V720.49A58.32,58.32,0,0,0,1441.75,662.23Zm-242,601.68a266.57,266.57,0,1,1,78-188.42A264.53,264.53,0,0,1,1199.75,1263.91Zm274.29-478c0,23.17-16.9,42-37.67,42H1294.13c-20.78,0-37.68-18.84-37.68-42V728.23c0-23.16,16.9-42,37.68-42h142.24c20.77,0,37.67,18.85,37.67,42Z"
                        transform="translate(-450 -612.23)"
                        fill={color}
                    />
                    <Path
                        class="f03ae4db-0c8d-4916-9a56-6a00944deb5a"
                        d="M1011.41,842c-128.67,0-233.35,104.74-233.35,233.48S882.74,1309,1011.41,1309s233.35-104.74,233.35-233.48S1140.08,842,1011.41,842Zm126,359.61a178.45,178.45,0,1,1,52.22-126.13A177,177,0,0,1,1137.45,1201.62Z"
                        transform="translate(-450 -612.23)"
                        fill={color}
                    />
                    <Path
                        d="M1011.41,809a266.41,266.41,0,1,0,188.34,78A264.53,264.53,0,0,0,1011.41,809Zm0,500c-128.67,0-233.35-104.74-233.35-233.48S882.74,842,1011.41,842s233.35,104.74,233.35,233.48S1140.08,1309,1011.41,1309Z"
                        transform="translate(-450 -612.23)"
                        // fill="red"
                    />
                    <Path
                        d="M1011.41,897.12a178.31,178.31,0,1,0,126,52.23A177,177,0,0,0,1011.41,897.12Z"
                        transform="translate(-450 -612.23)"
                        // fill="red"
                    />
                    <Path
                        d="M1441.75,612.23h-401a108.39,108.39,0,0,0-108.1,102.4h-382A100.74,100.74,0,0,0,450,815.28V1336.1a100.74,100.74,0,0,0,100.61,100.64h898.78A100.74,100.74,0,0,0,1550,1336.1V720.49A108.26,108.26,0,0,0,1441.75,612.23ZM1500,1336.1a50.68,50.68,0,0,1-50.61,50.64H550.61A50.68,50.68,0,0,1,500,1336.1V815.28a50.68,50.68,0,0,1,50.61-50.65H982.48V720.49a58.32,58.32,0,0,1,58.25-58.26h401A58.32,58.32,0,0,1,1500,720.49Z"
                        transform="translate(-450 -612.23)"
                        fill={color}
                    />
                    <Path
                        class="f03ae4db-0c8d-4916-9a56-6a00944deb5a"
                        d="M1436.37,719.22H1294.13c-1.61,0-4.68,3.51-4.68,9v57.68c0,5.5,3.07,9,4.68,9h142.24c1.6,0,4.67-3.51,4.67-9V728.23C1441,722.73,1438,719.22,1436.37,719.22Z"
                        transform="translate(-450 -612.23)"
                        fill={color}
                    />
                    <Path
                        d="M1436.37,686.22H1294.13c-20.78,0-37.68,18.85-37.68,42v57.68c0,23.17,16.9,42,37.68,42h142.24c20.77,0,37.67-18.84,37.67-42V728.23C1474,705.07,1457.14,686.22,1436.37,686.22Zm4.67,99.69c0,5.5-3.07,9-4.67,9H1294.13c-1.61,0-4.68-3.51-4.68-9V728.23c0-5.5,3.07-9,4.68-9h142.24c1.6,0,4.67,3.51,4.67,9Z"
                        transform="translate(-450 -612.23)"
                        fill={color}
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
