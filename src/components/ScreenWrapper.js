import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

const { height, width } = Dimensions.get('screen')

const ScreenWrapper = (props) => {
    const insets = useSafeAreaInsets()

    return (
        <View
            style={styles.screen}
            onStartShouldSetResponderCapture={() =>
                props.onStartShouldSetResponderCapture
            }
        >
            <LinearGradient
                colors={['rgba(252,140,250,1)', colors.blue]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View
                    style={{
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                        flex: 1,
                        ...props.style,
                    }}
                >
                    {props.children}
                </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: height,
        width: '100%',
    },
})

export default ScreenWrapper
