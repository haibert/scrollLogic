import React, { useState } from 'react'
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

import ScaleButton from './TouchableScale'

import colors from '../constants/colors'

import { useFocusEffect } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

const CELL_WIDTH = width / 2

//ionicons
import { Ionicons } from '@expo/vector-icons'

const ThumbNail = ({
    galleryName,
    galleryPressedHandler,
    navigation,
    images,
    onActionsPressed,
}) => {
    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }
    const animatedOpacity = useSharedValue(1)

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity.value,
        }
    })
    useFocusEffect(() => {
        if (navigation.isFocused()) {
            animatedOpacity.value = withDelay(200, withTiming(1))
        }
    })

    return (
        <Animated.View style={[styles.container, opacityStyle]}>
            <ScaleButton
                // activeOpacity={0.9}
                activeScale={0.93}
                onPress={() => {
                    // setOpacity(0)
                    animatedOpacity.value = withDelay(300, withTiming(0))
                    galleryPressedHandler()
                }}
                contentContainerStyle={styles.contentContainerStyle}
            >
                <SharedElement
                    id={images.galleryID}
                    style={{
                        backgroundColor: 'transparent',
                    }}
                >
                    <ImageBackground
                        style={styles.image}
                        imageStyle={{
                            borderRadius: 9,
                            backgroundColor: 'transparent',
                        }}
                        resizeMode="cover"
                        source={{ uri: images.thumbnail }}
                    />
                </SharedElement>
                <View style={styles.insideTopCont}>
                    <Text style={styles.eventTitle}>{galleryName}</Text>
                </View>
                <View style={styles.bottomActions}>
                    <Ionicons
                        name="ellipsis-horizontal-circle-outline"
                        size={25}
                        color="white"
                        style={styles.actionsStyle}
                        onPress={onActionsPressed}
                    />
                </View>
            </ScaleButton>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: width / 2 - 15,
        height: 260,
        marginRight: 10,
        borderRadius: 9,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    contentContainerStyle: {
        width: width / 2 - 15,
        height: 260,
        borderRadius: 9,
        backgroundColor: 'transparent',
    },
    image: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flex: 1,
        width: width / 2 - 15,
        height: 260,
        borderRadius: 9,
        shadowColor: 'black',
        shadowRadius: 4,
        shadowOpacity: 1,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    insideTopCont: {
        flex: 1,
        padding: 10,
    },
    eventTitle: {
        color: 'white',
        fontSize: 19,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 1,
        padding: 2,
    },
    bottomActions: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        padding: 10,
    },
    actionsStyle: {
        shadowColor: 'black',
        shadowRadius: 0.9,
        shadowOpacity: 0.8,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
})

export default ThumbNail
