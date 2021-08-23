import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, Dimensions, View } from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated'

//custom components
import ScaleButton from './TouchableScale'

//colors
import colors from '../constants/colors'

//nav hooks
import { useFocusEffect, useNavigation } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

//fast image
import FastImage from 'react-native-fast-image'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//SVG icons
import PersonsSVG from './SVGIcons/PersonsSVG'

const ThumbNail = ({
    galleryName,
    galleryPressedHandler,
    images,
    oneEllipsisPressed,
}) => {
    //navigation
    const navigation = useNavigation()

    //----------------------------------------------------------------OPACITY ANIMATION--------------------------------------------------------------
    const animatedOpacity = useSharedValue(1)

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity.value,
        }
    })

    useFocusEffect(() => {
        if (navigation.isFocused() && animatedOpacity.value === 0) {
            animatedOpacity.value = withDelay(100, withTiming(1))
        }
    })
    //----------------------------------------------------------------OPACITY ANIMATION--------------------------------------------------------------

    //----------------------------------------------------------------OPTIMIZATION----------------------------------------------------------------
    const onPress = useCallback(() => {
        animatedOpacity.value = withDelay(300, withTiming(0))
        galleryPressedHandler()
    }, [])
    //----------------------------------------------------------------OPTIMIZATION----------------------------------------------------------------

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = useCallback(() => {
        const imageString = `${images.thumbnail}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return images.thumbnail ? normalizedSource : images.thumbnail
    }, [])
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------

    //----------------------------------------------------------------FORMATTED DATE---------------------------------------------------------------
    const formattedDate = useMemo(
        () =>
            new Date(images.eventDate).toLocaleDateString('en-EN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        [images.eventDate]
    )
    //----------------------------------------------------------------FORMATTED DATE---------------------------------------------------------------

    return (
        <ScaleButton
            activeScale={0.93}
            onPress={onPress}
            contentContainerStyle={styles.contentContainerStyle}
            animatedStyle={opacityStyle}
        >
            <View style={styles.polaroid}>
                <View style={styles.designLayer2} />
                <View style={styles.designLayer1} />
                <View style={styles.shadowLayer}>
                    <SharedElement id={`${images.galleryID}`}>
                        <FastImage
                            style={styles.image}
                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                                uri: normalizedSource(),
                                priority: FastImage.priority.normal,
                            }}
                        />
                    </SharedElement>

                    <View style={styles.bottomBar}>
                        <SharedElement
                            id={`${images.galleryID}${images.galleryName}`}
                        >
                            <Text
                                style={styles.eventTitle}
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                                ellipsizeMode="tail"
                                numberOfLines={1}
                            >
                                {galleryName}
                            </Text>
                        </SharedElement>

                        <Text
                            style={styles.eventDate}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                        >
                            {formattedDate}
                            {/* <Text style={styles.eventLocation}>Venice, CA</Text> */}
                        </Text>
                        <Ionicons
                            name="ellipsis-vertical"
                            size={18}
                            color={colors.grey}
                            style={styles.actionsStyle}
                            onPress={oneEllipsisPressed}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.statsCont}>
                <Icon
                    type="feather"
                    name="heart"
                    size={15}
                    color={colors.currentMainColor}
                    style={styles.heartIcon}
                />
                <Text style={styles.statsText}>22k</Text>
                <PersonsSVG
                    size={18}
                    color={colors.darkGrey}
                    style={styles.peopleIcon}
                />
                <Text style={styles.statsText}>Stackers</Text>
            </View>
        </ScaleButton>
    )
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        marginLeft: 3,
        marginTop: 10,
        width: width / 2 - 15,
        height: width / 2 + 40,
    },
    polaroid: {
        width: width / 2 - 15,
        height: width / 2 - 15,
        borderRadius: (width / 2 - 15) * 0.06,
        backgroundColor: 'transparent',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.17,
        backgroundColor: 'white',
        shadowOffset: {
            width: 10,
            height: 5,
        },
    },
    image: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 40 + 6,
        width: width / 2 - 15,
        height: width / 2 - 15 - 46,
        borderRadius: (width / 2 - 15) * 0.06,
        borderColor: 'white',
        borderWidth: 6,
    },
    insideTopCont: {
        flex: 1,
        padding: 10,
    },
    eventTitle: {
        position: 'absolute',
        top: 2,
        left: 2,
        color: 'black',
        fontSize: 15,
        padding: 2,
        fontFamily: colors.font,
        width: width / 2 - 15 - 35,
    },
    eventDate: {
        position: 'absolute',
        top: 20,
        left: 2,
        color: 'black',
        fontSize: 12,
        padding: 2,
        width: width / 2 - 15 - 35,
        fontFamily: colors.font,
    },
    eventLocation: {
        color: 'rgba(109,109,109,1)',
    },
    bottomActions: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        padding: 10,
    },
    actionsStyle: {
        position: 'absolute',
        bottom: 10,
        right: 0,
    },
    downloadButton: {
        shadowColor: 'black',
        shadowRadius: 0.9,
        shadowOpacity: 0.8,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        position: 'absolute',
        top: 260 / 2 - 40,
        left: width / 4 - 15 - 30,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        right: 6,
        height: 40,
        backgroundColor: 'white',
    },

    designLayer1: {
        position: 'absolute',
        height: (width / 2 - 15) * 0.9,
        width: (width / 2 - 15) * 0.9,
        top: (width / 2 - 15) / 2 - ((width / 2 - 15) * 0.9) / 2,
        left: (width / 2 - 15) / 8,
        backgroundColor: 'white',
        shadowRadius: 5,
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 3,
            height: 3,
        },
        elevation: 10,
        borderRadius: (width / 2 - 15) * 0.06,
    },
    designLayer2: {
        position: 'absolute',
        height: (width / 2 - 15) * 0.8,
        width: (width / 2 - 15) * 0.8,
        top: (width / 2 - 15) / 2 - ((width / 2 - 15) * 0.8) / 2,
        left: (width / 2 - 15) / 4,
        backgroundColor: 'white',
        shadowRadius: 5,
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 3,
            height: 3,
        },
        elevation: 10,
        borderRadius: (width / 2 - 15) * 0.06,
    },
    shadowLayer: {
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.2,
        backgroundColor: 'white',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        elevation: 11,
        borderRadius: (width / 2 - 15) * 0.06,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    statsCont: {
        flexDirection: 'row',
        flex: 1,
        paddingLeft: 15,
        paddingTop: 7,
    },
    statsText: { paddingLeft: 5, fontFamily: colors.font, fontSize: 14 },
    peopleIcon: {
        marginLeft: 10,
    },
})

export default ThumbNail
