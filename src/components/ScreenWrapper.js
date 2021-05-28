import React from 'react'
import { View, StyleSheet, Dimensions, Platform } from 'react-native'

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
        // <View
        //     style={{
        //         flex: 1,
        //         paddingTop: Platform.OS === 'android' ? insets.top : null,
        //     }}
        // >
        <LinearGradient
            colors={['rgba(252,140,250,1)', colors.blue]}
            style={{
                flex: 1,
                paddingTop: Platform.OS === 'android' ? insets.top : null,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            onStartShouldSetResponderCapture={
                props.onStartShouldSetResponderCapture
            }
        >
            <View
                style={{
                    flex: 1,
                    ...props.style,
                    paddingTop: insets.top,
                }}
            >
                {props.children}
            </View>
        </LinearGradient>
        // </View>
    )
}

const styles = StyleSheet.create({})

export default ScreenWrapper
