import React, { useCallback, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    Pressable,
} from 'react-native'

//nav hooks
import { useFocusEffect, useNavigation } from '@react-navigation/native'

//custom components
import ScaleButton from '../TouchableScale'
import Heart from '../Heart'

//fast image
import FastImage from 'react-native-fast-image'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//linear gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../../constants/colors'

//moment
import moment from 'moment'

const { width, height } = Dimensions.get('window')

const textMargins = Platform.select({
    ios: {
        marginTop: -2,
    },
    android: {
        marginTop: -10,
    },
})

const FeedCell = ({
    galleryData,
    galleryPressedHandler,
    oneEllipsisPressed,
}) => {
    //----------------------------------------------------------------ON PRESS------------------------------------------------------
    const onPress = useCallback(() => {
        // animatedOpacity.value = withDelay(300, withTiming(0))
        galleryPressedHandler()
    }, [])
    //----------------------------------------------------------------ON PRESS------------------------------------------------------

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = useCallback(() => {
        const imageString = `${galleryData.thumbnail}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return galleryData.thumbnail ? normalizedSource : galleryData.thumbnail
    }, [])

    const springConfig = useMemo(() => {
        return { damping: 10, mass: 1, stiffness: 100 }
    }, [])
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------

    //----------------------------------------------------------------PLATFORM SPECIFIC IMAGE COMP----------------------------------------------------------------
    const ShadowViewComponent = useCallback(
        Platform.select({
            ios: () => {
                return <View style={styles.iosBigImageShadow}></View>
            },
            android: () => null,
        }),
        []
    )
    //----------------------------------------------------------------PLATFORM SPECIFIC IMAGE COMP----------------------------------------------------------------

    //----------------------------------------------------------------PLATFORM SPECIFIC AVATAR COMP----------------------------------------------------------------
    const AvatarComponent = useCallback(
        Platform.select({
            ios: () => {
                return (
                    <View style={styles.iOSShadow}>
                        <FastImage
                            style={styles.avatar}
                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                                uri: normalizedSource(),
                                priority: FastImage.priority.normal,
                            }}
                        />
                    </View>
                )
            },
            android: () => {
                return (
                    <FastImage
                        style={styles.avatar}
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                            uri: normalizedSource(),
                            priority: FastImage.priority.normal,
                        }}
                    />
                )
            },
        }),
        []
    )
    //----------------------------------------------------------------PLATFORM SPECIFIC AVATAR COMP----------------------------------------------------------------

    //----------------------------------------------------------------FORMATTED DATE---------------------------------------------------------------
    const formattedDate = useMemo(
        () =>
            new Date(galleryData.eventDate).toLocaleDateString('en-EN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        [galleryData.eventDate]
    )
    //----------------------------------------------------------------FORMATTED DATE---------------------------------------------------------------
    return (
        <ScaleButton
            activeScale={0.95}
            contentContainerStyle={styles.outerCont}
            onPress={onPress}
            springConfig={springConfig}
        >
            <View style={styles.designLayer1} />
            <View style={styles.designLayer2} />
            <ShadowViewComponent />
            <SharedElement
                id={`${galleryData.galleryID}`}
                style={styles.sharedElement}
            >
                <FastImage
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                        uri: normalizedSource(),
                        priority: FastImage.priority.normal,
                    }}
                />
            </SharedElement>
            <LinearGradient
                style={styles.gradient}
                colors={[
                    'transparent',
                    'transparent',
                    'transparent',
                    'rgba(0,0,0,1)',
                ]}
            />
            <View style={styles.galDetailCont}>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.galDate}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {formattedDate}
                </Text>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.galleryTitle}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {galleryData.galleryName}
                </Text>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.location}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    Venice Beach CA
                    {/* {galleryData.location} */}
                </Text>
            </View>
            <View style={styles.statsCont}>
                <AvatarComponent />
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.username}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {/* {galleryData.username} */}
                    userName
                </Text>
                <Heart
                    style={styles.heartIcon}
                    color={colors.currentMainColor}
                />
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.likes}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {/* {galleryData.likes} */}
                    22k
                </Text>
                <Ionicons
                    name="people-outline"
                    size={25}
                    color={colors.darkGrey}
                    style={styles.peopleIcon}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                />
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.stackersText}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {/* {galleryData.title} */}
                    15 Stackers
                </Text>
            </View>
            <Pressable
                style={styles.ellipsisStyle}
                onPress={oneEllipsisPressed}
                pressRetentionOffset={{
                    bottom: 30,
                    left: 20,
                    right: 20,
                    top: 20,
                }}
            >
                <Ionicons name="ellipsis-vertical" size={25} color="white" />
            </Pressable>
        </ScaleButton>
    )
}

const styles = StyleSheet.create({
    outerCont: {
        height: width + 20,
        width: width,
    },
    sharedElement: {
        height: width * 0.85,
        width: width * 0.85,
        marginLeft: width / 20,
        borderRadius: 15,
    },
    image: {
        height: width * 0.85,
        width: width * 0.85,
        borderRadius: 15,
        elevation: 10,
    },
    gradient: {
        height: width * 0.852,
        width: width * 0.852,
        borderRadius: 15,
        position: 'absolute',
        left: 19,
    },
    designLayer1: {
        height: width * 0.75,
        width: width * 0.75,
        borderRadius: 15,
        top: (width * 0.95) / 2 - (width * 0.85) / 2,
        right: width / 15,
        backgroundColor: colors.currentMainColorOpacity05,
        position: 'absolute',
        shadowColor: colors.currentMainColor,
        shadowRadius: 3,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 0,
        },
    },
    designLayer2: {
        height: width * 0.65,
        width: width * 0.65,
        borderRadius: 15,
        top: (width * 0.95) / 2 - (width * 0.75) / 2,
        right: width / 25,
        backgroundColor: colors.currentMainColorOpacity03,
        position: 'absolute',
    },
    galDetailCont: {
        position: 'absolute',
        width: width,
        paddingHorizontal: width / 10,
        bottom: width / 4.1,
    },
    galleryTitle: {
        color: 'white',
        fontFamily: colors.font,
        fontSize: 23,
        ...textMargins,
    },
    galDate: {
        fontFamily: colors.font,
        fontSize: 16,
        color: 'white',
        ...textMargins,
    },
    location: {
        fontFamily: colors.font,
        fontSize: 16,
        color: 'white',
        ...textMargins,
    },
    statsCont: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: width / 1.1,
    },
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 15,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 10,
    },
    username: {
        fontSize: 13,
        maxWidth: width / 4.5,
        marginLeft: 8,
        fontFamily: colors.semiBold,
        color: colors.darkGrey,
    },
    heartIcon: {
        marginLeft: 20,
    },
    likes: {
        fontSize: 13,
        fontFamily: colors.font,
        maxWidth: width / 13,
        marginLeft: 8,
    },
    peopleIcon: {
        marginLeft: 20,
    },
    stackersText: {
        marginLeft: 8,
        fontFamily: colors.font,
        fontSize: 13,
    },
    iosBigImageShadow: {
        shadowColor: 'black',
        shadowOpacity: 0.5,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 3,
        borderRadius: 15,
        height: width * 0.85,
        width: width * 0.85,
        marginLeft: width / 20,
        position: 'absolute',
    },
    iOSShadow: {
        shadowColor: 'black',
        shadowOpacity: 0.2,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 3,
        borderRadius: 15,
        borderColor: 'white',
        borderWidth: 1,
    },
    ellipsisStyle: {
        position: 'absolute',
        right: width / 10,
        bottom: width / 4.8,
        height: width / 7,
        width: width / 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default FeedCell
