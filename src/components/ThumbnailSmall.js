import React from 'react'
import { StyleSheet, Dimensions, Pressable, Image } from 'react-native'

//dimensions
const { width } = Dimensions.get('window')

const ThumbnailSmall = ({ images, picturePressedHandler }) => {
    return (
        <Pressable onPress={picturePressedHandler} style={styles.cont}>
            <Image style={styles.image} source={{ uri: images?.thumbPath }} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cont: {
        overflow: 'hidden',
        width: width / 3,
        height: width / 2,
        borderColor: 'white',
        overflow: 'hidden',
    },
    image: {
        width: width / 3,
        height: width / 2,
        borderWidth: 0.5,
        borderColor: 'white',
        overflow: 'hidden',
    },
})

export default ThumbnailSmall
