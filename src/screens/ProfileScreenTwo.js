import React, { useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Image,
    TouchableWithoutFeedback,
    Linking,
    Alert,
} from 'react-native'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import Button from '../components/Button'
import GalRequestCell from '../components/ProfileScreen/GalRequestCell'
import BottomNavBar from '../components/BottomNavBar'

//paper
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper'

//redux
// import { deletePhoto } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

//colors
import colors from '../constants/colors'
import { fonts } from 'react-native-elements/dist/config'

//reanimated
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useAnimatedScrollHandler,
} from 'react-native-reanimated'

// expo blurview
import { BlurView } from 'expo-blur'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// big list
import BigList from 'react-native-big-list'

// fakeData
import { fakeArray as listData } from '../data/images'

const { width, height } = Dimensions.get('window')

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//expo camera
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'

const ProfileScreenTwo = (props) => {
    //personal info
    const personalInfo = useSelector((state) => state.signupReducer.userInfo)

    //insets
    const insets = useSafeAreaInsets()

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

    const askForQRScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync()
        setShowModal(false)

        setHasCameraPermission(status === 'granted')
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

    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------
    const animatedValue = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            right: animatedValue.value,
            backgroundColor: colors.nPButton,
            width: '33%',
            height: 5,
        }
    })
    const startAnimationRight = () => {
        animatedValue.value = withTiming(-(width - width / 3), {
            duration: 100,
        })
    }
    const startAnimationMiddle = () => {
        animatedValue.value = withTiming(-(width - width / 3 - width / 3), {
            duration: 100,
        })
    }
    const startAnimationLeft = () => {
        animatedValue.value = withTiming(0, { duration: 100 })
    }
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    const render = useCallback(({ item, index }) => {
        return <GalRequestCell />
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

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------

    //----------------------------------------------------------------PROFILE PHOTO PRESSED----------------------------------------------------------------
    const handleProfilePhotoPressed = useCallback(() => {
        props.navigation.navigate('PhotoEditScreen')
    }, [])
    //----------------------------------------------------------------PROFILE PHOTO PRESSED----------------------------------------------------------------

    //----------------------------------------------------------------EDIT PRESSED HANDLER----------------------------------------------------------------
    const editPressedHandler = useCallback(() => {
        props.navigation.navigate('ProfileEditScreen')
    }, [])
    return (
        <ScreenWrapper style={{ paddingTop: 0 }}>
            <ImageBackground
                style={{ ...styles.topCont, paddingTop: insets.top * 2 - 10 }}
                source={{
                    uri: personalInfo.avatar,
                }}
                blurRadius={10}
            >
                <TouchableWithoutFeedback onPress={handleProfilePhotoPressed}>
                    <SharedElement id={1}>
                        <Image
                            source={{
                                uri: personalInfo.avatarThumb,
                            }}
                            style={styles.avatar}
                        />
                    </SharedElement>
                </TouchableWithoutFeedback>
                <Text
                    style={styles.name}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >
                    {personalInfo.firstName} {personalInfo.lastName}
                </Text>
                <Text
                    style={{ color: 'white', fontSize: 15 }}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >{`@${personalInfo.username}`}</Text>
                <Button
                    text="Edit"
                    style={styles.button}
                    onPress={editPressedHandler}
                />
                <ImageBackground
                    style={styles.stats}
                    blurRadius={100}
                    source={require('../../assets/AndroidTransparentPng100by100.png')}
                    resizeMode="stretch"
                >
                    <View style={styles.statCubes1}>
                        <Text style={styles.numbers}>256</Text>
                        <Text style={{ color: 'white' }}>Following</Text>
                    </View>
                    <View style={styles.statCubes2}>
                        <Text style={styles.numbers}>120</Text>
                        <Text style={{ color: 'white' }}>Followers</Text>
                    </View>
                    <View style={styles.statCubes3}>
                        <Text style={styles.numbers}>23,6k</Text>
                        <Text style={{ color: 'white' }}>Likes Received</Text>
                    </View>
                </ImageBackground>
                <View height={20}></View>
            </ImageBackground>
            <HeaderBasic
                iconName="menu-outline"
                goBack={() => {
                    props.navigation.toggleDrawer()
                }}
                headerColor={{ color: colors.textColor }}
                style={{ ...styles.header, marginTop: insets.top }}
            >
                <Text style={styles.signOut}>Sign Out</Text>
            </HeaderBasic>
            <View style={styles.requestsColumCont}>
                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationLeft()
                    }}
                >
                    <Text style={styles.requestsText}>Requests</Text>
                </View>
                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationMiddle()
                    }}
                >
                    <Text style={styles.requestsText}>Invites</Text>
                </View>
                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationRight()
                    }}
                >
                    <Text style={styles.requestsText}>Friends</Text>
                </View>
                <View style={styles.animatingBar}>
                    <Animated.View style={animatedStyle}></Animated.View>
                </View>
            </View>
            <BigList
                data={listData}
                renderItem={render}
                keyExtractor={keyExtractor}
                itemHeight={width}
                getItemLayout={layOut}
                style={styles.bigList}
                showsVerticalScrollIndicator={true}
            />
            <BottomNavBar
                onPlusPressed={() => {
                    setShowModal(true)
                }}
                onCameraPressed={cameraPressedHandler}
                onSearchPressed={() => {
                    props.navigation.navigate('SearchScreen')
                }}
                onHomePressed={() => {
                    props.navigation.navigate('DashboardScreen')
                }}
            />
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    topCont: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.placeHolder,
        // position: 'absolute',
        // top: 0,
    },
    header: {
        position: 'absolute',
        top: 0,
    },
    signOut: {
        color: colors.darkColorP1,
        fontWeight: 'bold',
        fontSize: 17,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    avatar: {
        marginTop: 10,
        borderRadius: 30,
        height: 60,
        width: 60,
    },
    name: {
        color: 'white',
        fontSize: 17,
        margin: 5,
    },
    button: {
        width: 100,
        marginTop: 5,
        height: 30,
        borderRadius: 8,
    },
    stats: {
        height: 60,
        marginHorizontal: 10,
        flexDirection: 'row',
        // borderColor: colors.separatorLine,
        borderRadius: colors.borderRadius,
        backgroundColor: 'rgba(145,145,145,0.85)',
        overflow: 'hidden',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    statCubes1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'white',
    },
    statCubes2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'white',
    },
    statCubes3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numbers: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },
    requestsColumCont: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: colors.separatorLine,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginTop: -20,
    },
    requestsText: {
        color: colors.darkColorP1,
        fontSize: 17,
    },
    requestsColumButtons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatingBar: {
        height: 5,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    bigList: {
        flex: 1,
    },
})

export default ProfileScreenTwo
