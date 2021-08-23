import React, { useState, useCallback } from 'react'
import {
    AppRegistry,
    StyleSheet,
    View,
    Animated,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
    Pressable,
    Platform,
} from 'react-native'
import Reanimated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    interpolate,
} from 'react-native-reanimated'
import { TapGestureHandler } from 'react-native-gesture-handler'
//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//custom components
import NeumorphicButton from './NeumorphicButton'
import ScaleButton from './TouchableScale'

//SVG
import PlusSVG from './animatedNavBarTest/PlusSVG'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

//expo qr scanner
import { BarCodeScanner } from 'expo-barcode-scanner'

//nav hooks
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('screen')

const FloatingButton = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    //navigation
    const navigation = useNavigation()

    const tabBarBottomPosition = insets.bottom > 0 ? insets.bottom + 5 : 5

    const reanimatedValue = useSharedValue(0)

    const reOpen = useSharedValue(false)

    const reToggleOpen = () => {
        console.log('toggled plus button content')
        const toValue = reOpen.value ? 0 : 1
        reanimatedValue.value = withTiming(toValue, {
            duration: 200,
        })
        reOpen.value = !reOpen.value
    }

    const reReloadStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: reanimatedValue.value,
                },
                {
                    translateY: interpolate(
                        reanimatedValue.value,
                        [0, 1],
                        [0, -70]
                    ),
                },
            ],
        }
    })

    const reOrderStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: reanimatedValue.value,
                },
                {
                    translateY: interpolate(
                        reanimatedValue.value,
                        [0, 1],
                        [0, -140]
                    ),
                },
            ],
        }
    })

    const reLabelStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        reanimatedValue.value,
                        [0, 1],
                        [-30, -90]
                    ),
                },
            ],
            opacity: interpolate(reanimatedValue.value, [0, 0.5, 1], [0, 0, 1]),
        }
    })

    const reLabelStyle2 = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        reanimatedValue.value,
                        [0, 1],
                        [-30, -90]
                    ),
                },
            ],
            opacity: interpolate(reanimatedValue.value, [0, 0.5, 1], [0, 0, 1]),
        }
    })

    const reBgStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(reanimatedValue.value, [0, 1], [0, 50]),
                },
            ],
        }
    })

    //----------------------------------------------------------------JOIN EVENT PRESSED--------------------------------------------------------------
    const askForQRScannerPermissions = useCallback(async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync()

        if (status === 'granted') {
            navigation.navigate('JoinEventScreen', {
                permission: status,
            })
        } else {
            navigation.navigate('JoinEventScreen', {
                permission: status,
            })
        }
    }, [])

    const joinEventHandler = useCallback(() => {
        askForQRScannerPermissions()
    }, [])
    //----------------------------------------------------------------JOIN EVENT PRESSED--------------------------------------------------------------

    //----------------------------------------------------------------CREATE EVENT PRESSED--------------------------------------------------------------
    const createEventHandler = useCallback(() => {
        navigation.navigate('CreateEventScreen')
    }, [])

    //----------------------------------------------------------------CREATE EVENT PRESSED--------------------------------------------------------------
    return (
        <View style={{ ...styles.container, ...props.style }}>
            <TapGestureHandler onActivated={reToggleOpen}>
                <Reanimated.View
                    style={[styles.background, reBgStyle]}
                    // onTouchStart={reToggleOpen}
                ></Reanimated.View>
            </TapGestureHandler>
            <TapGestureHandler
                onActivated={() => {
                    reToggleOpen()
                    createEventHandler()
                }}
            >
                <Reanimated.View
                    style={[styles.button, styles.other, reReloadStyle]}
                >
                    <Reanimated.Text style={[styles.label, reLabelStyle]}>
                        Create Gallery
                    </Reanimated.Text>
                    <Ionicons
                        name="images-outline"
                        size={20}
                        color={colors.nPButton}
                    ></Ionicons>
                </Reanimated.View>
            </TapGestureHandler>
            <TapGestureHandler
                onActivated={() => {
                    reToggleOpen()
                    joinEventHandler()
                }}
            >
                <Reanimated.View
                    style={[styles.button, styles.other, reOrderStyle]}
                >
                    <Reanimated.Text style={[styles.label, reLabelStyle2]}>
                        Join Gallery
                    </Reanimated.Text>

                    <Ionicons
                        name="qr-code-outline"
                        size={20}
                        color={colors.nPButton}
                    ></Ionicons>
                </Reanimated.View>
            </TapGestureHandler>

            <ScaleButton
                activeScale={0.8}
                onPress={reToggleOpen}
                contentContainerStyle={[styles.button, styles.pay]}
            >
                <PlusSVG size={35} color="blue" color={colors.grey} />
            </ScaleButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    background: {
        backgroundColor: 'rgba(0,0,0,.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        position: 'absolute',
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        // shadowColor: 'black',
        // shadowRadius: 5,
        // shadowOpacity: 1,
        // backgroundColor: 'white',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // elevation: 5,
    },
    buttonBorder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#333',
        shadowOpacity: 1,
        shadowOffset: { x: 2, y: 0 },
        shadowRadius: 2,
    },
    other: {
        backgroundColor: '#FFF',
    },
    payText: {
        color: '#FFF',
    },
    pay: {
        // backgroundColor: colors.grey,
        // shadowColor: 'black',
        // shadowRadius: 14,
        // shadowOpacity: 0.26,
        // shadowOffset: {
        //     width: 0,
        //     height: 14,
        // },
        // elevation: 14,
    },
    label: {
        color: 'white',
        position: 'absolute',
        fontSize: 18,
        backgroundColor: 'transparent',
        width: 120,
    },
})

export default FloatingButton
