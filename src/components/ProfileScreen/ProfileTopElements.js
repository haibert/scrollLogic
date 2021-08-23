import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableWithoutFeedback,
} from 'react-native'

//fast image
import FastImage from 'react-native-fast-image'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//colors
import colors from '../../constants/colors'

const ProfileTopElements = (props) => {
    return (
        <ImageBackground
            style={{ ...styles.topCont }}
            source={
                {
                    // uri: props?.profileInfo?.avatarFullPath,
                }
            }
            blurRadius={10}
        >
            <TouchableWithoutFeedback onPress={props.handleProfilePhotoPressed}>
                <SharedElement id={props.isCurrentUser ? '1' : '2'}>
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
                {props?.profileInfo?.firstName} {props?.profileInfo?.lastName}
            </Text>
            <Text
                style={styles.usernameText}
                maxFontSizeMultiplier={colors?.maxFontSizeMultiplier}
            >{`@${props?.profileInfo?.userName}`}</Text>
            <View style={styles.bottomWhiteBar}></View>
            {props.children}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    topCont: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 250,
        backgroundColor: colors.currentMainColor,
    },
    signOut: {
        color: colors.darkColorP1,
        fontFamily: colors.semiBold,
        fontSize: 17,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    avatar: {
        borderRadius: 30,
        height: 60,
        width: 60,
        borderWidth: 3,
        borderColor: 'white',
    },
    name: {
        color: 'white',
        fontSize: 19,
        marginTop: 5,
        fontFamily: colors.semiBold,
    },
    usernameText: { color: 'white', fontSize: 15, fontFamily: colors.font },
    bottomWhiteBar: {
        position: 'absolute',
        backgroundColor: 'white',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
    },
})

export default ProfileTopElements
