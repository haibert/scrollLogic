import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    runOnJS,
    Extrapolate,
    interpolate,
    withDelay,
} from 'react-native-reanimated'

//colors
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CustomActionSheet = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    const paddingBottom = {
        paddingBottom: insets.bottom + 10,
    }

    return (
        <Animated.View
            style={[StyleSheet.absoluteFill, styles.screen, paddingBottom]}
        >
            <View style={styles.outerCont}>
                <Pressable
                    onPress={() => {
                        bottomSheetModalRef.current?.snapTo(2)
                        animate()
                    }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 10,
                        height: 50,
                        backgroundColor: 'white',
                    }}
                >
                    <Text
                        style={styles.deleteText}
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    >
                        Delete
                    </Text>
                </Pressable>
                <View
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: '#e0e0e0',
                    }}
                ></View>
                <Pressable
                    onPress={() => {
                        bottomSheetModalRef.current?.snapTo(2)
                        animate()
                    }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 10,
                        height: 50,
                        backgroundColor: 'white',
                    }}
                >
                    <Text
                        style={styles.darkText}
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    >
                        Make Private
                    </Text>
                </Pressable>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    screen: {
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(32,32,32,0.54)',
    },
    outerCont: {
        height: 100,
        marginHorizontal: 15,
        borderRadius: 15,
    },
})

export default CustomActionSheet
