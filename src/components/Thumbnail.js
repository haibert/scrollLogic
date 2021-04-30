import React, { useState } from 'react'
import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Text,
    Dimensions,
    ImageBackground,
} from 'react-native'
// import { SharedElement } from 'react-navigation-shared-element'

import { useFocusEffect } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

const CELL_WIDTH = width / 2

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

const ThumbNail = ({ images, galleryPressedHandler }) => {
    // const [opacity, setOpacity] = useState(1)

    // useFocusEffect(() => {
    //     if (navigation.isFocused()) {
    //         setOpacity(1)
    //     }
    // })

    return (
        <View>
            <TouchableWithoutFeedback
                onPress={() => {
                    galleryPressedHandler(images.id)
                }}
            >
                {/* <SharedElement id={item.id} style={{ opacity }}> */}
                <ImageBackground
                    style={{
                        borderRadius: 12,
                        width: width / 2 - 15,
                        height: 260,
                        marginRight: 10,
                        flex: 1,
                    }}
                    imageStyle={{ borderRadius: 12 }}
                    resizeMode="cover"
                    source={images.picture}
                >
                    <View style={styles.insideCont}>
                        <View style={styles.insideTopCont}>
                            <Text style={styles.eventTitle}>
                                {images.title}
                            </Text>
                        </View>
                        <View style={styles.bottomActions}>
                            <View></View>

                            <Ionicons
                                name="ellipsis-horizontal-circle-outline"
                                size={25}
                                color="white"
                                style={styles.actionsStyle}
                            />
                        </View>
                    </View>
                </ImageBackground>
                {/* </SharedElement> */}
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    insideCont: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 10,
    },
    insideTopCont: {
        flex: 1,
    },
    eventTitle: {
        color: 'white',
        fontSize: 19,
        fontWeight: 'bold',
        shadowColor: 'black',
        shadowRadius: 0.9,
        shadowOpacity: 0.8,
        shadowOffset: {
            width: 1,
            height: 0,
        },
        borderRadius: 5,
        elevation: 1,
    },
    bottomActions: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    actionsStyle: {
        shadowColor: 'black',
        shadowRadius: 0.9,
        shadowOpacity: 0.8,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        borderRadius: 5,
        elevation: 1,
    },
})

export default ThumbNail
