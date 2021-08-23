import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import colors from '../../constants/colors'

//components
import ButtonFlatlist from '../../components/ButtonFlatlist'

//bottom sheet
// import {
//     TouchableOpacity,
//     TouchableWithoutFeedback,
// } from '@gorhom/bottom-sheet'

//ionicons
import { Ionicons } from '@expo/vector-icons'

const CommentCell = (props) => {
    const [checked, setChecked] = useState()

    const navigation = useNavigation()
    return (
        <View
            onPress={() => {
                setChecked((prevState) => !prevState)
            }}
            style={styles.cellOuter}
            onTouchStart={() => {
                navigation.navigate('OtherProfileScreen')
            }}
        >
            <View style={styles.imageCont}></View>
            <Text
                maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                style={styles.username}
                numberOfLines={3}
            >
                Gallery Name
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    style={styles.comment}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    cont: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(235,235,235,1)',
    },
    cellOuter: {
        height: 90,
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        // flexWrap: 'wrap',
        overflow: 'hidden',
    },
    imageCont: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(235,235,235,1)',
        position: 'absolute',
        left: 10,
        top: 15,
    },
    namesCont: {
        height: 60,
        position: 'absolute',
        top: 0,
        left: 60,
        justifyContent: 'center',
    },
    buttonContStyle: {
        position: 'absolute',
        height: 30,
        right: 0,
    },
    button: {
        height: 30,
        width: 70,
        position: 'absolute',
        right: 90,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 13,
        position: 'absolute',
        top: 10,
        left: 60,
        bottom: 10,
        right: 10,
        flexWrap: 'wrap',
    },
    comment: {
        fontSize: 13,
        fontWeight: 'normal',
    },
})

export default CommentCell
