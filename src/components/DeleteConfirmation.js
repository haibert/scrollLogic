import React, { useCallback } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useDerivedValue,
    interpolate,
    withDelay,
    withTiming,
} from 'react-native-reanimated'

import { EntryAnimation } from './EntryAnimation'

const DeleteConfirmation = (props) => {
    //------------------------------------------------------------EXIT ANIMATION------------------------------------------------------------
    const play = useSharedValue(false)
    const progress = useDerivedValue(() => {
        return play.value
            ? withDelay(0 * 0, withTiming(1, { duration: 100 }))
            : 0
    })

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(progress.value, [0, 1], [1, 0])
        const scale = interpolate(progress.value, [0, 1], [1, 0.8])

        return {
            opacity,
            transform: [
                {
                    scale,
                },
            ],
        }
    })

    const opacityStyle = useAnimatedStyle(() => {
        const opacity = interpolate(progress.value, [0, 1], [1, 0])
        return {
            opacity,
        }
    })

    const exitAnimation = useCallback(() => {
        play.value = true
    }, [])
    //------------------------------------------------------------EXIT ANIMATION------------------------------------------------------------

    //------------------------------------------------------------BUTTONS LOGIC------------------------------------------------------------
    const confirmPressedHandler = useCallback(() => {
        exitAnimation()
        props.onConfirmPressed()
    }, [])

    const cancelPressedHandler = useCallback(() => {
        exitAnimation()
        props.dismissConfirmation()
    }, [])
    //------------------------------------------------------------BUTTONS LOGIC------------------------------------------------------------

    return (
        <Animated.View style={[styles.container, opacityStyle]}>
            <EntryAnimation>
                <Animated.View style={[animatedStyle]}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Are you sure?</Text>
                        <Text style={styles.body}>{props.message}</Text>
                        <View style={styles.buttonCont}>
                            <Pressable
                                style={styles.buttonCommon}
                                onPress={confirmPressedHandler}
                            >
                                <Text style={styles.buttonConfirm}>
                                    Confirm
                                </Text>
                            </Pressable>
                            <View style={styles.separator} />
                            <Pressable
                                style={styles.buttonCommon}
                                onPress={cancelPressedHandler}
                            >
                                <Text style={styles.buttonCancel}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>
            </EntryAnimation>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        top: 0,
        backgroundColor: 'rgba(32,32,32,0.54)',
    },
    card: {
        marginHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 19,
        margin: 15,
    },
    body: {
        fontSize: 16,
        paddingBottom: 10,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    separator: {
        backgroundColor: 'black',
        height: 1,
        width: 1,
        height: '100%',
    },
    buttonCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonCommon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    buttonCancel: {
        fontWeight: 'bold',
        fontSize: 19,
    },
    buttonConfirm: {
        fontSize: 19,
    },
})

export default DeleteConfirmation
