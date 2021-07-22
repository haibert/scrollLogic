import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Counter = (props) => {
    return (
        <View style={{ ...styles.cont, ...props.viewStyle }}>
            <Text>{`${props.count} / ${props.max}`}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})

export default Counter
