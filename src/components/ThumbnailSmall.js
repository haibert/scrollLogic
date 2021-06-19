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

//constants
import colors from '../constants/colors'

//custom components
import CachedImage from '../components/CachedImage'

const { width, height } = Dimensions.get('window')

const ThumbnailSmall = ({ images, picturePressedHandler }) => {
    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }
    return (
        <TouchableCmp onPress={picturePressedHandler}>
            {/* <SharedElement id={item.id} style={{ opacity }}> */}
            <Image
                style={{
                    width: width / 3,
                    height: width / 2,
                    borderWidth: 0.7,
                    borderColor: colors.pinkLESSTransparent,
                }}
                resizeMode="cover"
                source={{ uri: images.thumbPath, cache: 'force-cache' }}
                // onLayout={() => {}}
            />
            {/* <CachedImageComp
                style={{
                    width: width / 3,
                    height: width / 2,
                    borderWidth: 0.7,
                    borderColor: colors.pinkLESSTransparent,
                }}
                resizeMode="cover"
                source={{ uri: images.fullPath }}
                cacheKey={`${images.id}tfullPath`}
            /> */}
            {/* </SharedElement> */}
        </TouchableCmp>
    )
}

const styles = StyleSheet.create({})

export default React.memo(ThumbnailSmall)
