import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    TextInput,
    Keyboard,
    Text,
    TouchableOpacity,
    Linking,
    Alert,
    ActivityIndicator,
} from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated'

//custom components
import ScreenWrapper from '../components/ScreenWrapper'
import SearchCell from '../components/SearchScreen/SearchCell'
import BottomNavBar from '../components/BottomNavBar'
import NuemorphicNavBar from '../components/NuemorphicNavBar'
import useDidMountEffect from '../hooks/useDidMountEffect'

//colors
import colors from '../constants/colors'

//dimensions
const { width, height } = Dimensions.get('window')

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//image picker
import * as ImagePicker from 'expo-image-picker'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//redux
import { loadPermissions } from '../store/permissions/actions'
import { search, emptyProfile } from '../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

// big list
import BigList from 'react-native-big-list'

//expo camera
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'

//useFocus InteractionManager
import { InteractionManager } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

//isFocused
import { useIsFocused } from '@react-navigation/native'

const SearchScreen = ({ route, ...props }) => {
    const isAndroid = useMemo(() => {
        if (Platform.OS === 'android') {
            return true
        } else {
            return false
        }
    }, [])

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    //isfocused
    const isFocused = useIsFocused()

    //searches
    const searches = useSelector((state) => state.signupReducer.searches)
    // console.log(
    //     '🚀 ~ file: SearchScreen.js ~ line 59 ~ SearchScreen ~ searches',
    //     searches
    //)

    useFocusEffect(
        useCallback(() => {
            startOpacityAnim2()
        }, [])
    )

    //----------------------------------------------------------------KEYBOARD STATUS~----------------------------------------------------------------
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {}
        )
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                moveCancelButton()
                expandSearchBar()
            }
        )

        return () => {
            keyboardDidHideListener.remove()
            keyboardDidShowListener.remove()
        }
    }, [])
    //----------------------------------------------------------------KEYBOARD STATUS~----------------------------------------------------------------

    //----------------------------------------------------------------EMPTY PROFILE----------------------------------------------------------------
    useEffect(() => {
        dispatch(emptyProfile())
    }, [])
    //----------------------------------------------------------------EMPTY PROFILE----------------------------------------------------------------

    //----------------------------------------------------------------HIDE NAVIGATION BAR ANIMATION----------------------------------------------------------------

    const animatedOpacity = useSharedValue(1)

    const bottomNavStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity.value,
        }
    })

    const startOpacityAnim = useCallback(() => {
        if (animatedOpacity.value === 1) {
            animatedOpacity.value = withDelay(
                50,
                withTiming(0, { duration: 0 })
            )
        } else {
            animatedOpacity.value = withDelay(
                200,
                withTiming(1, { duration: 100 })
            )
        }
    }, [])
    const startOpacityAnim2 = useCallback(() => {
        animatedOpacity.value = withTiming(1, { duration: 0 })
    }, [])
    //----------------------------------------------------------------HIDE NAVIGATION BAR ANIMATION----------------------------------------------------------------

    //----------------------------------------------------------------REVEAL NAV BAR AFTER BLUR----------------------------------------------------------------
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('blur', () => {
            isAndroid && animatedOpacity.value === 0 ? startOpacityAnim() : null
        })

        return unsubscribe
    }, [props.navigation])
    //----------------------------------------------------------------REVEAL NAV BAR AFTER BLUR----------------------------------------------------------------

    //----------------------------------------------------------------CANCEL BUTTON ANIMATION----------------------------------------------------------------
    const animatedWidth = useSharedValue(width - 20)

    const searchContStyle = useAnimatedStyle(() => {
        return {
            width: animatedWidth.value,
        }
    })

    const startWidthAnim = useCallback(() => {
        if (animatedWidth.value === width - 20) {
            console.log(animatedWidth.value)
            console.log('colaps')
            moveCancelButton()
            const newWidth = width - 80
            animatedWidth.value = withDelay(
                50,
                withTiming(newWidth, { duration: 100 })
            )
        }
    }, [])
    console.log('rerendered')
    const expandSearchBar = useCallback(() => {
        if (animatedWidth.value !== width - 20) {
            Keyboard.dismiss()
            moveCancelButton()
            animatedWidth.value = withTiming(width - 20, { duration: 100 })
        }
    }, [])

    const animatedRight = useSharedValue(-70)

    const cancelStyle = useAnimatedStyle(() => {
        return {
            right: animatedRight.value,
        }
    })

    const moveCancelButton = useCallback(() => {
        if (animatedWidth.value !== width - 20) {
            animatedRight.value = withTiming(-70, { duration: 100 })
            isAndroid ? startOpacityAnim() : null
            console.log('moveCancelButton Ran')
        } else {
            animatedRight.value = withDelay(
                60,
                withTiming(-5, { duration: 100 })
            )
            isAndroid ? startOpacityAnim() : null
            console.log('moveCancelButton Ran')
        }
    }, [isAndroid])
    //----------------------------------------------------------------CANCEL BUTTON ANIMATION----------------------------------------------------------------

    //----------------------------------------------------------------LOADING ANIMATION----------------------------------------------------------------
    const loadingOpacity = useSharedValue(0)
    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: loadingOpacity.value,
        }
    })
    const showLoader = useCallback(() => {
        loadingOpacity.value = withTiming(1, { duration: 0 })
    }, [])
    const hideLoader = useCallback(() => {
        loadingOpacity.value = withTiming(0, { duration: 0 })
    }, [])
    //----------------------------------------------------------------LOADING ANIMATION----------------------------------------------------------------

    //----------------------------------------------------------------SEARCH HTTP CALL--------------------------------------------------------
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        if (searchTerm.length === 0) return
        const delayDebounceFn = setTimeout(async () => {
            showLoader()
            await dispatch(search(searchTerm))
            hideLoader()
        }, 200)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const onChange = useCallback((text) => {
        console.log(text)
        if (text.length !== 0) {
            setSearchTerm(text)
        }
    }, [])

    //----------------------------------------------------------------SEARCH HTTP CALL--------------------------------------------------------

    //----------------------------------------------------------------CAMERA PRESSED HANDLER----------------------------------------------------------------
    const greenLightOnPermissions = useSelector(
        (state) => state.permissionsReducer.permissions.camera
    )

    const cameraPressedHandler = async () => {
        if (greenLightOnPermissions === 'granted') {
            props.navigation.navigate('CameraScreen')
        } else {
            const { status } = await Camera.getPermissionsAsync()
            const audioStatus = await Audio.getPermissionsAsync()

            // setHasCameraPermission(status === 'granted')
            if (status && audioStatus.status === 'granted') {
                dispatch(loadPermissions('granted'))
                props.navigation.navigate('CameraScreen')
            } else if (status || audioStatus.status === 'undetermined') {
                const results = await Camera.requestPermissionsAsync()
                const audioResults = await Audio.requestPermissionsAsync()
                if (results.status && audioResults.status === 'granted') {
                    props.navigation.navigate('CameraScreen')
                } else if (results.status || audioResults.status === 'denied') {
                    sendUserToSettingsHandler()
                    return
                }
            } else if (status || audioResults.status === 'denied') {
                const results2 = await Camera.requestPermissionsAsync()
                const audioResults2 = await Audio.requestPermissionsAsync()
                if (results2.status && audioResults2 === 'granted') {
                    props.navigation.navigate('CameraScreen')
                } else {
                    sendUserToSettingsHandler()
                    return
                }
            }
        }
    }

    const openSettings = useCallback(() => {
        Platform.OS === 'android'
            ? Linking.openSettings()
            : Linking.canOpenURL('app-settings:')
                  .then((supported) => {
                      if (!supported) {
                          console.log("Can't handle settings url")
                      } else {
                          return Linking.openURL('app-settings:')
                      }
                  })
                  .catch((err) => console.error('An error occurred', err))
    }, [])

    const sendUserToSettingsHandler = useCallback(() => {
        const alertMessage =
            'Turn On Camera Permissions to Allow Event Share to Scan QR Codes'
        Platform.OS === 'android' ? androidAlert() : IOSAlert()

        function IOSAlert() {
            Alert.alert(alertMessage, '', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Settings',
                    onPress: () => {
                        openSettings()
                    },
                },
            ])
        }
        function androidAlert() {
            Alert.alert('', alertMessage, [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Settings',
                    onPress: () => {
                        openSettings()
                    },
                },
            ])
        }
    }, [])
    //----------------------------------------------------------------CAMERA PRESSED HANDLER----------------------------------------------------------------

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------

    const render = useCallback(({ item, index }) => {
        return <SearchCell searchResults={item} navigation={props.navigation} />
    }, [])

    const layOut = useCallback(
        (data, index) => ({
            length: 60,
            offset: 60 * index,
            index,
        }),
        []
    )

    const keyExtractor = useCallback((item) => item.id, [])

    const onScroll = useCallback(() => {
        console.log('onScroll Ran')
        isAndroid && animatedOpacity.value === 0 ? startOpacityAnim() : null
        Keyboard.dismiss()
    }, [isAndroid])

    const onTouchStart = useCallback(() => {
        if (searches.length === 0) {
            // moveCancelButton()
            // expandSearchBar()
        }
    }, [searches])

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    return (
        <ScreenWrapper
            style={{
                paddingBottom: Platform.OS === 'android' ? insets.bottom : null,
            }}
        >
            <View style={styles.searchCont}>
                <View style={styles.cancelButtonCont}>
                    <Animated.View style={[cancelStyle]}>
                        <TouchableOpacity onPress={expandSearchBar}>
                            <Text
                                style={styles.cancelButton}
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <Animated.View style={[styles.searchCompCont, searchContStyle]}>
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color={'rgba(124,124,124,1)'}
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    />
                    <TextInput
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        style={styles.input}
                        placeholder="Search"
                        placeholderTextColor={'rgba(124,124,124,1)'}
                        underlineColorAndroid="rgba(255,255,255,0)"
                        onFocus={startWidthAnim}
                        // onBlur={startWidthAnim}
                        // placeholderTextColor={colors.placeHolder}
                        // selectionColor={colors.lightTint}
                        // value={props.value}
                        // autoFocus={props.autoFocus}
                        onChangeText={onChange}
                        // onChange={onChange}
                    ></TextInput>
                </Animated.View>
            </View>

            <BigList
                onTouchStart={onTouchStart}
                data={searches}
                renderItem={render}
                keyExtractor={keyExtractor}
                itemHeight={width}
                getItemLayout={layOut}
                style={styles.bigList}
                showsVerticalScrollIndicator={true}
                onScrollBeginDrag={onScroll}
                contentContainerStyle={{ paddingBottom: insets.bottom + 50 }}
            />
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.loadingView,
                    opacityStyle,
                    {
                        top: insets.top + 60,
                        bottom: insets.bottom + 50,
                    },
                ]}
            >
                <ActivityIndicator color={colors.nPButton} />
            </Animated.View>
            <Animated.View style={bottomNavStyle}>
                <NuemorphicNavBar
                    onFeedPressed={() => {
                        props.navigation.navigate('DashboardScreen')
                    }}
                    onPlusPressed={() => {
                        setShowModal(true)
                    }}
                    onCameraPressed={cameraPressedHandler}
                    onPersonPressed={() => {
                        props.navigation.navigate('ProfileScreen')
                    }}
                    navigation={props.navigation}
                    searchFocused={isFocused ? true : false}
                />
            </Animated.View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    searchCont: {
        width: '100%',
        padding: 10,
    },
    searchCompCont: {
        backgroundColor: 'rgba(233,233,233,1)',
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        minHeight: 50,
        height: 50,
        padding: 5,
        backgroundColor: 'rgba(233,233,233,1)',
    },
    cancelButtonCont: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    cancelButton: {
        color: colors.darkColorP1,
        fontSize: 15,
    },
    loadingView: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
        position: 'absolute',
        width: '100%',
        bottom: 0,
        backgroundColor: colors.overallBackground,
    },
})

export default SearchScreen
