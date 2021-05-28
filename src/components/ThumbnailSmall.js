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
                    height: width / 3,
                }}
                resizeMode="cover"
                source={images.picture}
                // onLayout={() => {}}
            />
            {/* </SharedElement> */}
        </TouchableCmp>
    )
}

const styles = StyleSheet.create({})

export default ThumbnailSmall
