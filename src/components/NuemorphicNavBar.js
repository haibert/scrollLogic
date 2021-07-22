import React, { useCallback } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    // TouchableWithoutFeedback,
    Pressable,
    Text,
} from 'react-native'

//custom components
import ScaleButton from '../components/TouchableScale'

import NeumorphicButton from './NeumorphicButton'

//colors
import colors from '../constants/colors'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

const { width } = Dimensions.get('screen')

//floating Button
import FloatingButton from './FloatingButton'

//expo qr scanner
import { BarCodeScanner } from 'expo-barcode-scanner'

const NuemorphicNavBar = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    const tabBarBottomPosition = insets.bottom > 0 ? insets.bottom + 5 : 5
    console.log(
        '🚀 ~ file: BottomNavBar.js ~ line 32 ~ BottomNavBar ~ tabBarBottomPosition',
        tabBarBottomPosition
    )

    //----------------------------------------------------------------JOIN EVENT PRESSED--------------------------------------------------------------
    const askForQRScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync()
        // setShowModal(false)

        if (status === 'granted') {
            props.navigation.navigate('JoinEventScreen', {
                permission: status,
            })
        } else {
            props.navigation.navigate('JoinEventScreen', {
                permission: status,
            })
        }
    }

    const joinEventHandler = useCallback(() => {
        askForQRScannerPermissions()
    }, [])
    //----------------------------------------------------------------JOIN EVENT PRESSED--------------------------------------------------------------

    //----------------------------------------------------------------CREATE EVENT PRESSED--------------------------------------------------------------
    const createEventHandler = useCallback(() => {
        props.navigation.navigate('CreateEventScreen')
    }, [])

    //----------------------------------------------------------------CREATE EVENT PRESSED--------------------------------------------------------------
    const shadowRadius = 1.5
    const shadowOffset = 2
    const contentPadding = 10

    return (
        <View
            style={{
                ...props.style,
                ...styles.outerCont,
                height: 70 + insets.bottom,
            }}
        >
            <View style={styles.squareButtonsCont}>
                <NeumorphicButton
                    // style={{
                    //     // position: 'absolute',
                    //     // top: 3,
                    //     // right: (width - 26) / 15,
                    //     alignItems: 'center',
                    //     justifyContent: 'center',
                    // }}
                    onPress={() => {
                        props.onFeedPressed()
                    }}
                    iconName="home"
                    contentPadding={contentPadding}
                    shadowOffset={shadowOffset}
                    shadowRadius={shadowRadius}
                    isFocused={props.feedFocused}
                />

                <NeumorphicButton
                    // style={{
                    //     // position: 'absolute',
                    //     // top: 3,
                    //     // right: (width - 26) / 3.8,
                    //     alignItems: 'center',
                    //     justifyContent: 'center',
                    // }}
                    onPress={props.onSearchPressed}
                    iconName="search"
                    contentPadding={contentPadding}
                    shadowOffset={shadowOffset}
                    shadowRadius={shadowRadius}
                    isFocused={props.searchFocused}
                />

                <View style={styles.circlePlaceHolder}></View>
                <NeumorphicButton
                    // style={{
                    //     // position: 'absolute',
                    //     // top: 3,
                    //     // left: (width - 26) / 3.8,
                    //     alignItems: 'center',
                    //     justifyContent: 'center',
                    // }}
                    onPress={props.onPersonPressed}
                    iconName="person"
                    contentPadding={contentPadding}
                    shadowOffset={shadowOffset}
                    shadowRadius={shadowRadius}
                    isFocused={props.profileFocused}
                />

                <NeumorphicButton
                    // style={{
                    //     // position: 'absolute',
                    //     // top: 3,
                    //     // left: (width - 26) / 15,
                    //     alignItems: 'center',
                    //     justifyContent: 'center',
                    // }}
                    onPress={props.onCameraPressed}
                    iconName="camera"
                    contentPadding={contentPadding}
                    shadowOffset={shadowOffset}
                    shadowRadius={shadowRadius}
                />
            </View>

            <FloatingButton
                style={styles.animatedButton}
                onJoinEventPressed={joinEventHandler}
                onCreateEventPressed={createEventHandler}
            />
            {/* <View
                style={{
                    ...styles.floatingPlusCont,
                    left: width / 2 - 20,
                    bottom: tabBarBottomPosition,
                }}
            >
                <ScaleButton
                    onPress={props.onPlusPressed}
                    activeScale={0.87}
                    // contentContainerStyle={styles.cellOuter}
                >
                    <View style={styles.bigPlusButton}>
                        <LinearGradient
                            colors={[colors.nPButton, colors.nPButton]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.bigPlusButton}
                        >
                            <Icon
                                name="plus"
                                type="material-community"
                                size={38}
                                // color={colors.textColor}
                                color={'white'}
                            />
                        </LinearGradient>
                    </View>
                </ScaleButton>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    outerCont: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    squareButtonsCont: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: width,
        overflow: 'hidden',
        paddingTop: 10,
        flex: 1,
        backgroundColor: 'transparent',
    },
    squareButtonsConWithOverFlow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        flexDirection: 'row',
        // justifyContent: 'space-around',
        // alignItems: 'center',
        width: width,
        paddingTop: 10,
        flex: 1,
        backgroundColor: 'transparent',
    },
    circlePlaceHolder: {
        width: 60,
        height: 60,
    },
    bigPlusButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    floatingPlusCont: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        elevation: 10,
    },
    floatingTouchable: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    buttonPlaceHolder: {
        height: '100%',
        width: '100%',
    },
    animatedButton: {
        height: 60,
        width: 60,
        alignItems: 'center',
        height: '100%',
        marginTop: Platform.OS === 'android' ? 10 : 20,
    },
})

export default NuemorphicNavBar
