import React, { useMemo } from 'react'
import { useBottomSheet } from '@gorhom/bottom-sheet'
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'
//----------------------------------------------------------------BACKDROP COMPONENT----------------------------------------------------------------
const BottomSheetBackDrop = ({ animatedIndex, style }) => {
    const animatedOpacity = useSharedValue(0)

    const { close } = useBottomSheet()

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 1],
            Extrapolate.CLAMP
        ),
    }))
    const containerStyle = useMemo(
        () => [
            style,
            {
                backgroundColor: 'rgba(32,32,32,0.54)',
            },
            containerAnimatedStyle,
        ],
        [style, containerAnimatedStyle]
    )
    return (
        <Animated.View
            style={containerStyle}
            onTouchStart={() => {
                animatedOpacity.value = 0
                close()
            }}
        />
    )
}
//----------------------------------------------------------------BACKDROP COMPONENT----------------------------------------------------------------

export default BottomSheetBackDrop
