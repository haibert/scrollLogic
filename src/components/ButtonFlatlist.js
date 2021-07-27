import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

//colors
import colors from '../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

const ButtonFlatlist = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={{ ...styles.cont, ...props.style }}
        >
            <View style={{ ...styles.button, ...props.buttonContStyle }}>
                <Ionicons name={props.iconName} size={22} color="white" />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cont: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        padding: 3,
        backgroundColor: colors.nPButton,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
})

export default ButtonFlatlist
