import React, { useState, useRef, useCallback } from 'react'
import {
    StyleSheet,
    View,
    Image,
    TouchableNativeFeedback,
    Text,
    Dimensions,
    ImageBackground,
    Platform,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated'
//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//custom components
import ScaleButton from './TouchableScale'
import CachedImage from '../components/CachedImage'
// import CachedImage2 from '../components/CachedImage2'
import Comp from '../components/Comp'

//colors
import colors from '../constants/colors'

//nav hooks
import { useFocusEffect } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

const CELL_WIDTH = width / 2

//ionicons
import { Ionicons } from '@expo/vector-icons'

const ThumbNail = ({
    galleryName,
    galleryPressedHandler,
    navigation,
    images,
    onActionsPressed,
    fakeImages,
    imageURI,
}) => {
    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }
    const animatedOpacity = useSharedValue(1)

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity.value,
        }
    })
    useFocusEffect(() => {
        if (navigation.isFocused()) {
            animatedOpacity.value = withDelay(200, withTiming(1))
        }
    })
    //----------------------------------------------------------------RELOAD FAILED IMAGE----------------------------------------------------------------
    const [downloadAgain, setDownloadAgain] = useState(null)
    const [showDownload, setShowDownloadAgain] = useState()
    const showDownloadButton = () => {
        setShowDownloadAgain(true)
    }

    const downloadAgainHandler = () => {
        downloadRef.current?.reDownload()
        setShowDownloadAgain(false)
    }
    //----------------------------------------------------------------RELOAD FAILED IMAGE----------------------------------------------------------------

    //----------------------------------------------------------------OPTIMIZATION----------------------------------------------------------------
    const onPress = useCallback(() => {
        animatedOpacity.value = withDelay(300, withTiming(0))
        galleryPressedHandler()
    }, [])
    //----------------------------------------------------------------OPTIMIZATION----------------------------------------------------------------
    console.log(images.galleryID, images.thumbnail)
    const downloadRef = useRef()
    return (
        <ScaleButton
            activeScale={0.93}
            onPress={onPress}
            contentContainerStyle={[styles.contentContainerStyle, opacityStyle]}
        >
            <SharedElement id={images.galleryID}>
                {/* <ImageBackground
                    style={styles.image}
                    imageStyle={{
                        borderRadius: 9,
                        backgroundColor: 'transparent',
                    }}
                    resizeMode="cover"
                    source={{
                        uri: images.thumbnail,
                        cache: 'force-cache',
                    }}
                /> */}
                <CachedImage
                    style={styles.image}
                    resizeMode="cover"
                    source={{
                        uri: `${images.thumbnail}`,
                    }}
                    cacheKey={`${images.galleryID}t`}
                />
            </SharedElement>
            <Text
                style={styles.eventTitle}
                maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
            >
                {galleryName}
            </Text>
            <Ionicons
                name="ellipsis-horizontal-circle-outline"
                size={25}
                color="white"
                style={styles.actionsStyle}
                onPress={onActionsPressed}
            />
        </ScaleButton>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: width / 2 - 15,
        height: width / 2 - 15,
        marginRight: 10,
        borderRadius: 9,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    contentContainerStyle: {
        marginRight: 10,
        marginTop: 10,

        width: width / 2 - 15,
        height: width / 2 - 15,
        borderRadius: 9,
        backgroundColor: 'transparent',
        borderRadius: 9,
        // uncomment this if you are going to use ImageBackground

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

        // uncomment this if you are going to REMOVE CACHED IMAGE IMPLEMENTATION
        // shadowColor: 'black',
        // shadowRadius: 4,
        // shadowOpacity: 1,
        // backgroundColor: 'white',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
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

export default ThumbNail
