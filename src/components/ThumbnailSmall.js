import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableNativeFeedback,
    Image,
    Platform,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated'

//nav hooks
import { useFocusEffect } from '@react-navigation/native'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//constants
import colors from '../constants/colors'

//custom components
import CachedImage from '../components/CachedImage'

//fast image
import FastImage from 'react-native-fast-image'

const { width, height } = Dimensions.get('window')
console.log('🚀 ~ file: ThumbnailSmall.js ~ line 20 ~ width', width)

const ThumbnailSmall = ({ images, picturePressedHandler, navigation }) => {
    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    //----------------------------------------------------------------OPACITY ANIMATION----------------------------------------------------------------
    const animatedOpacity = useSharedValue(1)

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity.value,
        }
    })
    useFocusEffect(() => {
        if (navigation.isFocused()) {
            animatedOpacity.value = withDelay(0, withTiming(1))
        }
    })

    const handlePicPressed = () => {
        animatedOpacity.value = withDelay(300, withTiming(0))
        picturePressedHandler()
    }
    //----------------------------------------------------------------OPACITY ANIMATION----------------------------------------------------------------

    return (
        <TouchableCmp onPress={handlePicPressed} style={styles.cont}>
            <SharedElement id={images.id}>
                {/* <Animated.Image
                    style={[styles.image, opacityStyle]}
                    resizeMode="cover"
                    source={{ uri: images.thumbPath, cache: 'force-cache' }}
                /> */}
                {/* <CachedImage
                    style={styles.image}
                    resizeMode="cover"
                    source={{
                        uri: `${images.thumbPath}`,
                    }}
                    cacheKey={`${images.id}t`}
                    resizeMode="cover"
                /> */}
                <FastImage
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                        uri: `${images.thumbPath}`,
                        // headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                    }}
                />
            </SharedElement>
        </TouchableCmp>
    )
}

const styles = StyleSheet.create({
    cont: {
        borderRadius: 8,
        overflow: 'hidden',
        width: width / 3,
        height: width / 2,
        borderColor: 'white',
    },
    image: {
        width: width / 3,
        height: width / 2,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
    },
})

export default React.memo(ThumbnailSmall)
