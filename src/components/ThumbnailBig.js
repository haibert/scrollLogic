import React, { useState, useRef, useCallback } from 'react'
import {
    StyleSheet,
    View,
    Image,
    TouchableNativeFeedback,
    Text,
    Dimensions,
    ImageBackground,
    Platform,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated'
//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//custom components
import ScaleButton from './TouchableScale'
// import CachedImage from '../components/CachedImage'
import Comp from '../components/Comp'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

const { width, height } = Dimensions.get('window')

const CELL_WIDTH = width / 2

//ionicons
import { Ionicons } from '@expo/vector-icons'

const ThumbnailBig = (props) => {
    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    //----------------------------------------------------------------OPTIMIZATION----------------------------------------------------------------
    const onPress = useCallback(() => {
        animatedOpacity.value = withDelay(300, withTiming(0))
        galleryPressedHandler()
    }, [])
    //----------------------------------------------------------------OPTIMIZATION----------------------------------------------------------------
    return (
        <View style={styles.cont}>
            <Image
                style={styles.image}
                resizeMode="cover"
                source={{
                    uri: props.images.fullPath,
                }}
            />
            <LinearGradient
                colors={['rgba(252,140,250,1)', colors.blue]}
                style={styles.actions}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            ></LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    cont: { height: height + 80, width: width },

    image: {
        height: height,
    },
    actions: {
        height: 80,
    },
})

export default React.memo(ThumbnailBig)
