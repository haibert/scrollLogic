import React, { useCallback } from 'react'
import { StyleSheet, Dimensions, Pressable } from 'react-native'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//fast image
import FastImage from 'react-native-fast-image'

//dimensions
const { width } = Dimensions.get('window')

const ThumbnailSmall = ({ images, picturePressedHandler }) => {
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = useCallback(() => {
        const imageString = `${images.thumbPath}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return normalizedSource
    }, [])
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    return (
        <Pressable onPress={picturePressedHandler} style={styles.cont}>
            <SharedElement id={images.id}>
                <FastImage
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                        uri: normalizedSource(),
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                    }}
                />
            </SharedElement>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cont: {
        borderRadius: 8,
        overflow: 'hidden',
        width: width / 3,
        height: width / 2,
        borderColor: 'white',
        overflow: 'hidden',
    },
    image: {
        width: width / 3,
        height: width / 2,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
    },
})

export default ThumbnailSmall
