import React, { useCallback, useRef, useEffect } from 'react'
import { View, StyleSheet, Dimensions, Pressable } from 'react-native'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import colors from '../constants/colors'

const { width } = Dimensions.get('screen')

//floating Button
import FloatingButton from './FloatingButton'

//lottie
import LottieView from 'lottie-react-native'

//all SVGs
import HomeSVG from './animatedNavBarTest/HomeSVG'
import SearchSVG from './animatedNavBarTest/SearchSVG'
import PersonSVG from './animatedNavBarTest/PersonSVG'
import CameraSVG from './animatedNavBarTest/CameraSVG'

    //expo qr scanner
    import { BarCodeScanner } from 'expo-barcode-scanner'

//nav hooks
import { useNavigation } from '@react-navigation/native'

//custom screen options
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

//redux
import {
    shouldAnimateProfile,
    shouldAnimateSearch,
    shouldAnimateFeed,
} from '../store/signup-auth/actions'
import { useSelector, useDispatch } from 'react-redux'

import { useIsFocused } from '@react-navigation/native'

const NuemorphicNavBar = ({ route }) => {
    console.log(
        '🚀 ~ file: NuemorphicNavBar.js ~ line 43 ~ NuemorphicNavBar ~ route',
        route
    )
    //insets
    const insets = useSafeAreaInsets()

    //navigation
    const navigation = useNavigation()

    //dispatch
    const dispatch = useDispatch()

    const isFocused = useIsFocused()

    //lottie refs
    const homeLottieRef = useRef()
    const searchLottieRef = useRef()
    const profileLottieRef = useRef()

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
    const shadowRadius = 1.5
    const shadowOffset = 2
    const contentPadding = 10
    const plugButtonBottomSpace = insets.bottom + 10

    const animateFeed = useSelector(
        (state) => state.signupReducer.navBarAnimations.animateFeed
    )
    const animateSearch = useSelector(
        (state) => state.signupReducer.navBarAnimations.animateSearch
    )
    const animateProfile = useSelector(
        (state) => state.signupReducer.navBarAnimations.animateProfile
    )
    // useEffect(() => {
    //     if (props.feedFocused && animateFeed && homeLottieRef.current) {
    //         homeLottieRef.current.play()
    //         dispatch(shouldAnimateFeed(false))
    //     }
    //     if (props.searchFocused && animateSearch && searchLottieRef.current) {
    //         searchLottieRef.current.play()
    //         dispatch(shouldAnimateSearch(false))
    //     }
    //     if (
    //         props.profileFocused &&
    //         animateProfile &&
    //         profileLottieRef.current
    //     ) {
    //         profileLottieRef.current.play()
    //         dispatch(shouldAnimateProfile(false))
    //     }
    // }, [props.feedFocused, props.profileFocused, props.searchFocused])

    const feedPressed = useCallback(() => {
        homeLottieRef.current.play()
        // props.onFeedPressed()
    }, [])
    const searchPressed = useCallback(() => {
        searchLottieRef.current.play()
        // props.onSearchPressed()
    }, [])
    const profilePressed = useCallback(() => {
        profileLottieRef.current.play()
        // props.onProfilePressed()
    }, [])

    // const routeName = getFocusedRouteNameFromRoute(route) ?? 'FeedScreen'

    return (
        <View
            style={{
                // ...props.style,
                ...styles.outerCont,
                height: 50 + insets.bottom,
            }}
        >
            <View style={styles.squareButtonsCont}>
                <Pressable style={styles.pressable} onPress={feedPressed}>
                    {isFocused ? null : (
                        <HomeSVG size={30} color={colors.grey} />
                    )}
                    {isFocused ? (
                        <LottieView
                            ref={homeLottieRef}
                            style={{
                                width: 30,
                                height: 30,
                            }}
                            source={require('../../assets/homeLottie.json')}
                            loop={false}
                            autoPlay={false}
                            speed={1}
                        />
                    ) : null}
                </Pressable>

                <Pressable style={styles.pressable} onPress={searchPressed}>
                    {isFocused ? null : (
                        <SearchSVG size={24} color={colors.grey} />
                    )}
                    {isFocused ? (
                        <LottieView
                            ref={searchLottieRef}
                            style={{
                                width: 30,
                                height: 30,
                            }}
                            source={require('../../assets/searchLottie.json')}
                            loop={false}
                            autoPlay={false}
                            speed={1.5}
                        />
                    ) : null}
                </Pressable>

                <View style={styles.circlePlaceHolder}></View>
                <Pressable style={styles.pressable} onPress={profilePressed}>
                    {isFocused ? null : (
                        <PersonSVG size={24} color={colors.grey} />
                    )}
                    {isFocused ? (
                        <LottieView
                            ref={profileLottieRef}
                            style={{
                                width: 30,
                                height: 30,
                            }}
                            source={require('../../assets/personLottie.json')}
                            loop={false}
                            autoPlay={false}
                            speed={1}
                        />
                    ) : null}
                </Pressable>

                <Pressable
                    style={styles.pressable}
                    // onPress={props.onCameraPressed}
                >
                    <CameraSVG size={40} color={colors.grey} />
                </Pressable>
            </View>

            <FloatingButton
                style={{
                    ...styles.animatedButton,
                    // bottom: plugButtonBottomSpace,
                }}
                onJoinEventPressed={joinEventHandler}
                onCreateEventPressed={createEventHandler}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    outerCont: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 0.2,
        borderTopColor: colors.grey,
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
        paddingTop: 5,
        flex: 1,
        backgroundColor: 'transparent',
    },
    circlePlaceHolder: {
        width: 60,
        height: 60,
    },
    animatedButton: {
        width: 60,
        alignItems: 'center',
        height: '100%',
        marginTop: 5,
    },
    pressable: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default NuemorphicNavBar
