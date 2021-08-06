import React, { useCallback } from 'react'
import { StyleSheet, Text, Dimensions } from 'react-native'
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

    return (
        <ScaleButton
            activeScale={0.93}
            onPress={onPress}
            contentContainerStyle={styles.contentContainerStyle}
            animatedStyle={opacityStyle}
        >
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
            <SharedElement id={`${images.galleryID}${images.galleryName}`}>
                <Text
                    style={styles.eventTitle}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >
                    {galleryName}
                </Text>
            </SharedElement>

            <Ionicons
                name="ellipsis-horizontal-circle-outline"
                size={25}
                color="white"
                style={styles.actionsStyle}
                onPress={oneEllipsisPressed}
            />
        </ScaleButton>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: width / 2 - 15,
        height: width / 2 - 15,
        borderRadius: 9,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    contentContainerStyle: {
        // marginRight: 10,
        marginLeft: 7.5,
        marginTop: 10,
        width: width / 2 - 15,
        height: width / 2 - 15,
        borderRadius: 9,
        backgroundColor: 'transparent',
        borderRadius: 9,
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.17,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 10,
        },
    },
    image: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: width / 2 - 15,
        height: width / 2 - 15,
        borderRadius: 9,
    },
    insideTopCont: {
        flex: 1,
        padding: 10,
    },
    eventTitle: {
        position: 'absolute',
        top: 10,
        left: 12,
        color: 'white',
        fontSize: 19,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 1,
        padding: 2,
    },
    bottomActions: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        padding: 10,
    },
    actionsStyle: {
        position: 'absolute',
        bottom: 10,
        right: 12,
        shadowColor: 'black',
        shadowRadius: 0.9,
        shadowOpacity: 0.8,
        shadowOffset: {
            width: 0,
            height: 0,
        },
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
})

export default React.memo(ThumbNail)
