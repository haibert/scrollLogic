import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

import { useTheme } from '@react-navigation/native'

//colors
import colors from '../constants/colors'

const { height, width } = Dimensions.get('screen')

const screenHeight = Dimensions.get('screen').height
const windowHeight = Dimensions.get('window').height
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight

const ScreenWrapper = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    // const { colors } = useTheme()
    return (
        // <View
        //     style={{
        //         flex: 1,
        //         paddingTop: Platform.OS === 'android' ? insets.top : null,
        //     }}
        // >
        <View
            // colors={['rgba(252,140,250,1)', colors.blue]}
            // colors={['white', 'white']}
            style={{
                flex: 1,
                width: width,
                paddingTop:
                    Platform.OS === 'android' || props.paddingTop
                        ? insets.top
                        : null,
                paddingBottom: props.paddingBottom ? insets.bottom : null,
                backgroundColor: 'white',
                // ...props.style,
            }}
            // start={{ x: 0, y: 0 }}
            // end={{ x: 1, y: 0 }}
            onStartShouldSetResponderCapture={
                props.onStartShouldSetResponderCapture
            }
        >
            <View
                style={{
                    flex: 1,
                    paddingTop: insets.top,
                    ...props.style,
                }}
            >
                <View style={{ ...styles.topColor, ...props.topColor }}></View>
                {props.children}
            </View>
        </View>
        // </View>
    )
}

const styles = StyleSheet.create({
    topColor: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 500,
    },
})

export default React.memo(ScreenWrapper)
