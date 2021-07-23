import React from 'react'
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
    Pressable,
} from 'react-native'

//fast image
import FastImage from 'react-native-fast-image'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//colors
import colors from '../../constants/colors'

const ProfileTopElements = (props) => {
    //insets
    const insets = useSafeAreaInsets()
    return (
        <ImageBackground
            style={{ ...styles.topCont, paddingTop: insets.top * 2 - 10 }}
            source={{
                uri: props.personalInfo.avatarFullPath,
            }}
            blurRadius={10}
        >
            <TouchableWithoutFeedback onPress={props.handleProfilePhotoPressed}>
                <SharedElement id={'1'}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                            uri: props.normalizedSource(),
                            priority: FastImage.priority.normal,
                        }}
                        style={styles.avatar}
                    />
                </SharedElement>
            </TouchableWithoutFeedback>
            <Text
                style={styles.name}
                maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
            >
                {props.personalInfo.firstName} {props.personalInfo.lastName}
            </Text>
            <Text
                style={{ color: 'white', fontSize: 15 }}
                maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
            >{`@${props.personalInfo.username}`}</Text>
            {props.children}
            <View height={20}></View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    topCont: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.placeHolder,
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
})

export default ProfileTopElements
