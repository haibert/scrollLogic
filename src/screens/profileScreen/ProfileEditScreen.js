import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Pressable,
    Alert,
    Linking,
    TouchableOpacity,
} from 'react-native'

//custom components
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'

//colors
import colors from '../../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//dimensions
const { width, height } = Dimensions.get('window')

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//image picker
import * as ImagePicker from 'expo-image-picker'

// expo image manipulator
import * as ImageManipulator from 'expo-image-manipulator'

//redux
import { changeAvatar } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//fast image
import FastImage from 'react-native-fast-image'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

const ProfileEditScreen = ({ route, ...props }) => {
    //picture source
    const userInfo = useSelector((state) => state.signupReducer.userInfo)

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    //----------------------------------------------------------------PERMISSION LOGIC----------------------------------------------------------------

    const openSettings = useCallback(async () => {
        Platform.OS === 'android' ? Linking.openSettings() : null
        if (Platform.OS === 'ios') {
            const supported = await Linking.canOpenURL('app-settings:')
            try {
                if (!supported) {
                    console.log("Can't handle settings url")
                } else {
                    return Linking.openURL('app-settings:')
                }
            } catch (err) {
                console.error('An error occurred', err)
            }
        }
    }, [])

    function sendUserToSettingsHandler() {
        const alertMessage =
            'We need access to your photos to be able to upload a profile picture'
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
    }

    const askForPermission = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()

        if (status === 'granted') {
            return true
        } else if (status === 'undetermined') {
            const results =
                await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (results.status === 'granted') {
                return true
            } else if (results.status === 'denied') {
                sendUserToSettingsHandler()
                return false
            }
        } else if (status || audioResults.status === 'denied') {
            const results2 =
                await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (results2.status === 'granted') {
                return true
            } else {
                sendUserToSettingsHandler()
                return false
            }
        }
    }
    //----------------------------------------------------------------PERMISSION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------EDIT PRESSED----------------------------------------------------------------
    const [chosenImage, setChosenImage] = useState(null)
    const editPressedHandler = async () => {
        const havePermission = await askForPermission()

        if (havePermission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: Platform.OS === 'ios' ? 0 : 1,
                base64: true,
            })
            //then create compressed version to save
            if (!result.cancelled) {
                const compressedPhoto = await ImageManipulator.manipulateAsync(
                    result.uri,
                    [{ resize: { height: 500 } }],
                    { compress: 1, format: 'jpeg', base64: true }
                )
                await dispatch(
                    changeAvatar(`data:image/jpeg;base64,${result.base64}`)
                )
                setChosenImage(compressedPhoto.uri)
            }
        }
    }
    //----------------------------------------------------------------EDIT PRESSED----------------------------------------------------------------

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = () => {
        const imageString = userInfo.avatarThumbPath
            ? `${userInfo.avatarThumbPath}`
            : `${chosenImage}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return normalizedSource
    }
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------

    return (
        <ScreenWrapper style={{ paddingBottom: insets.bottom }}>
            <HeaderBasic
                iconName="chevron-down-outline"
                goBack={() => {
                    props.navigation.goBack()
                }}
                header="Edit Profile"
                headerColor={{ color: colors.darkestColorP1 }}
            />
            <View style={styles.imageCont}>
                <SharedElement id={'1'}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                            uri: normalizedSource(),
                            priority: FastImage.priority.normal,
                        }}
                        style={styles.image}
                    />
                </SharedElement>
                <Pressable onPress={editPressedHandler}>
                    <Text style={styles.changeButton}>Change Photo</Text>
                </Pressable>
            </View>
            <View style={styles.changesCont}>
                <Pressable
                    android_ripple={{
                        center: true,
                        color: colors.placeHolder,
                    }}
                    style={styles.changeButtons}
                    onPress={() => {
                        props.navigation.navigate('EditNameScreen')
                    }}
                >
                    <Text style={styles.text}>Name</Text>
                    <View style={styles.arrowAndTextCont}>
                        <Text style={styles.text}>
                            {`${userInfo.firstName} ` + `${userInfo.lastName}`}
                        </Text>
                        <Ionicons
                            name="chevron-forward-outline"
                            size={20}
                            color={'black'}
                            style={{ bottom: -2 }}
                        />
                    </View>
                </Pressable>

                <Pressable
                    android_ripple={{
                        center: true,
                        color: colors.placeHolder,
                    }}
                    style={styles.changeButtons}
                >
                    <Text style={styles.text}>Username</Text>
                    <View style={styles.arrowAndTextCont}>
                        <Text style={styles.text}>{userInfo.username}</Text>
                        <Ionicons
                            name="chevron-forward-outline"
                            size={20}
                            color={'black'}
                            style={{ bottom: -2 }}
                        />
                    </View>
                </Pressable>

                <Pressable
                    android_ripple={{
                        center: true,
                        color: colors.placeHolder,
                    }}
                    style={styles.changeButtons}
                    onPress={() => {
                        props.navigation.navigate('EditBirthdayScreen')
                    }}
                >
                    <Text style={styles.text}>Birthday</Text>
                    <View style={styles.arrowAndTextCont}>
                        <Text style={styles.text}>{userInfo.birthday}</Text>
                        <Ionicons
                            name="chevron-forward-outline"
                            size={20}
                            color={'black'}
                            style={{ bottom: -2 }}
                        />
                    </View>
                </Pressable>

                <Pressable
                    android_ripple={{
                        center: true,
                        color: colors.placeHolder,
                    }}
                    style={styles.changeButtons}
                >
                    <Text style={styles.text}>Phone Number</Text>
                    <View style={styles.arrowAndTextCont}>
                        <Text style={styles.text}>{userInfo.phone}</Text>
                        <Ionicons
                            name="chevron-forward-outline"
                            size={20}
                            color={'black'}
                            style={{ bottom: -2 }}
                        />
                    </View>
                </Pressable>
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    imageCont: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    changeButton: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    changesCont: {},
    changeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    arrowAndTextCont: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 15,
    },
})

export default ProfileEditScreen
