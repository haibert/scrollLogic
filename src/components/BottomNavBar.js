import React, { useCallback } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    // TouchableWithoutFeedback,
    Pressable,
    Text,
} from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

//custom components
import ScaleButton from '../components/TouchableScale'

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

const BottomNavBar = (props) => {
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

    return (
        <View
            style={{
                ...styles.tabBarShadow,
                width: width,
                height: 60 + insets.bottom,
            }}
        >
            <View
                style={{
                    position: 'absolute',
                    top: 3,
                    right: (width - 26) / 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Ionicons
                    name="camera"
                    color={colors.lightestColorP1}
                    size={28}
                />
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={{
                        color: colors.lightestColorP1,
                        fontSize: 13,
                        textAlign: 'center',
                    }}
                >
                    Camera
                </Text>
            </View>

            <View
                style={{
                    position: 'absolute',
                    top: 3,
                    right: (width - 26) / 3.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Ionicons
                    name="person"
                    color={
                        props.profileActive ? 'white' : colors.lightestColorP1
                    }
                    size={27}
                />
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={{
                        color: props.profileActive
                            ? 'white'
                            : colors.lightestColorP1,
                        fontSize: 13,
                        textAlign: 'center',
                    }}
                >
                    Profile
                </Text>
            </View>

            <View
                style={{
                    position: 'absolute',
                    top: 3,
                    left: (width - 26) / 3.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Ionicons
                    name="search"
                    size={28}
                    color={
                        props.searchActive ? 'white' : colors.lightestColorP1
                    }
                />
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={{
                        color: props.searchActive
                            ? 'white'
                            : colors.lightestColorP1,
                        fontSize: 13,
                        textAlign: 'center',
                    }}
                >
                    Search
                </Text>
            </View>

            <View
                style={{
                    position: 'absolute',
                    top: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    left: (width - 26) / 12,
                }}
            >
                <Ionicons
                    name="home"
                    size={28}
                    color={props.homeActive ? 'white' : colors.lightestColorP1}
                />
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={{
                        color: props.homeActive
                            ? 'white'
                            : colors.lightestColorP1,
                        fontSize: 13,
                        textAlign: 'center',
                    }}
                >
                    Feed
                </Text>
            </View>

            <View style={styles.tabButton}>
                <Pressable onPress={props.onHomePressed}>
                    <View style={styles.buttonPlaceHolder} />
                </Pressable>
            </View>

            <View style={styles.tabButton}>
                <Pressable onPress={props.onSearchPressed}>
                    <View style={styles.buttonPlaceHolder} />
                </Pressable>
            </View>

            {/* <View style={{ width: 50 }} /> */}

            <FloatingButton
                style={styles.animatedButton}
                onJoinEventPressed={joinEventHandler}
                onCreateEventPressed={createEventHandler}
            />

            <View style={styles.tabButton}>
                <Pressable onPress={props.onPersonPressed}>
                    <View style={styles.buttonPlaceHolder} />
                </Pressable>
            </View>

            <View style={styles.tabButton}>
                <Pressable onPress={props.onCameraPressed}>
                    <View style={styles.buttonPlaceHolder} />
                </Pressable>
            </View>

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
    tabBar: {
        height: 60,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginHorizontal: 10,
        position: 'absolute',
        alignItems: 'center',
        overflow: 'hidden',
    },
    innerCont: {
        flex: 1,
        flexDirection: 'row',
    },
    tabBarImage: {
        height: 50,
        marginHorizontal: 10,
        position: 'absolute',
    },
    tabBarGradient: {
        flex: 1,
    },
    tabButton: {
        flex: 1,
        minHeight: '100%',
        // borderWidth: 2,
        // borderColor: 'red',
    },

    tabLabel: {
        color: 'white',
        fontSize: 10,
    },
    tabLabel2: {
        color: 'white',
        fontSize: 10,
    },
    tabBarShadow: {
        backgroundColor: colors.darkColorP1,
        flexDirection: 'row',
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
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
})

export default BottomNavBar
