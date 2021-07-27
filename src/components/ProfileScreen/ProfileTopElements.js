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
                    // uri: props.personalInfo.avatarFullPath,
                }
            }
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
                style={styles.usernameText}
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
        backgroundColor: colors.overallBackground,
        height: 260,
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
        color: 'black',
        fontSize: 17,
        margin: 5,
    },
    usernameText: { color: 'black', fontSize: 15 },
})

export default React.memo(ProfileTopElements)
