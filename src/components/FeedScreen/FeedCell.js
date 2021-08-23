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
import PersonsSVG from '../SVGIcons/PersonsSVG'

//linear gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../../constants/colors'

//moment
import moment from 'moment'

const { width, height } = Dimensions.get('window')

const textMargins = Platform.select({
    ios: {
        marginTop: 5,
    },
    android: {
        marginTop: -5,
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
    const ShadowViewComponent = useCallback((props) => {
        return <View style={styles.polaroidContainer}>{props.children}</View>
    }, [])
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
            <View style={styles.designLayer2} />
            <View style={styles.designLayer1} />
            <ShadowViewComponent>
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
                <View style={styles.galDetailCont}>
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
                        style={styles.galDate}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                    >
                        {formattedDate}
                        <Text
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                            style={styles.location}
                        >
                            {' Venice Beach CA'}
                            {/* {galleryData.location} */}
                        </Text>
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
                    <Ionicons
                        name="ellipsis-vertical"
                        size={25}
                        color={colors.darkGrey}
                    />
                </Pressable>
            </ShadowViewComponent>
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
                    size={20}
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
                {/* <Ionicons
                    name="people-outline"
                    size={25}
                    color={colors.darkGrey}
                    style={styles.peopleIcon}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                /> */}
                <PersonsSVG
                    size={25}
                    color={colors.iOSBlue}
                    style={styles.peopleIcon}
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
        </ScaleButton>
    )
}

const styles = StyleSheet.create({
    outerCont: {
        height: width + 40,
        width: width,
    },
    polaroidContainer: {
        shadowRadius: 10,
        height: width * 0.9,
        width: width * 0.9,
        borderRadius: width * 0.9 * 0.05,
        marginLeft: width / 35,
        //shadow
        shadowColor: 'black',
        shadowOpacity: 0.2,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        elevation: 12,
    },
    sharedElement: {
        height: width * 0.9,
        width: width * 0.9,
        borderRadius: width * 0.9 * 0.05,
        backgroundColor: 'white',
    },
    image: {
        height: width * 0.9 - 70 - 20,
        width: width * 0.9 - 20,
        borderRadius: width * 0.9 * 0.033,
        top: 10,
        left: 10,
        right: 10,
        borderColor: 'white',
    },
    designLayer1: {
        height: width * 0.8,
        width: width * 0.8,
        top: (width * 0.9) / 2 - (width * 0.8) / 2,
        right: width / 2 / 10,
        borderRadius: width * 0.8 * 0.05,
        backgroundColor: 'white',
        //shadow
        position: 'absolute',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 2,
            height: 0,
        },
        elevation: 6,
    },
    designLayer2: {
        height: width * 0.7,
        width: width * 0.7,
        top: (width * 0.9) / 2 - (width * 0.7) / 2,
        right: width / 2 / 20,
        borderRadius: width * 0.7 * 0.05,
        backgroundColor: 'white',
        ///shadow
        position: 'absolute',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 2,
            height: 0,
        },
        elevation: 5,
    },
    galDetailCont: {
        left: 10,
        width: width * 0.85 - 19,
        bottom: 80,
        backgroundColor: 'white',
        height: 70,
        paddingTop: 10,
        paddingLeft: 5,
    },
    galleryTitle: {
        color: colors.darkGrey,
        fontFamily: colors.semiBold,
        fontSize: 22,
        ...textMargins,
        width: width / 1.5,
    },
    galDate: {
        fontFamily: colors.font,
        fontSize: 16,
        color: colors.darkGrey,
        ...textMargins,
        width: width / 1.5,
    },
    location: {
        fontFamily: colors.font,
        fontSize: 16,
        color: colors.darkGrey,
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
        right: 0,
        bottom: 10,
        height: width / 7,
        width: width / 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default FeedCell
