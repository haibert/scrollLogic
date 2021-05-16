import React, { useState } from 'react'
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

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

import colors from '../constants/colors'

import { useFocusEffect } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

const CELL_WIDTH = width / 2

//ionicons
import { Ionicons } from '@expo/vector-icons'

const ThumbNail = ({ images, galleryPressedHandler }) => {
    const [pressedState, setPressedState] = useState(false)
    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }
    // const [opacity, setOpacity] = useState(1)

    // useFocusEffect(() => {
    //     if (navigation.isFocused()) {
    //         setOpacity(1)
    //     }
    // })

    return (
        <View>
            <TouchableCmp
                activeOpacity={0.9}
                onPress={() => {
                    setPressedState(true)
                    galleryPressedHandler()
                }}
            >
                {/* <SharedElement
                    id={images.id}
                    // style={{ opacity }}
                > */}
                <ImageBackground
                    style={styles.image}
                    imageStyle={{ borderRadius: 9 }}
                    resizeMode="cover"
                    source={images.picture}
                >
                    {!pressedState && (
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
                    )}
                </ImageBackground>
                {/* </SharedElement> */}
            </TouchableCmp>
        </View>
    )
}

const styles = StyleSheet.create({
    insideCont: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 10,
    },
    image: {
        borderRadius: 12,
        width: width / 2 - 15,
        height: 260,
        marginRight: 10,
        flex: 1,
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.9,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
    },
    insideTopCont: {
        flex: 1,
    },
    eventTitle: {
        color: 'white',
        fontSize: 19,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 1,
        padding: 2,
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
