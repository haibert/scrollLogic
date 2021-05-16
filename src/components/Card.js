import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Card = (props) => {
    return (
        <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
    )
}

const styles = StyleSheet.create({
    card: {
        shadowColor: 'black',
        shadowRadius: 3,
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderRadius: 5,
        elevation: 4,
    },
})

export default Card
