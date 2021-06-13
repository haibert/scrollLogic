import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Comp = (props) => {
    useEffect(() => {
        props.onError()
    })
    return (
        <View onTouchStart={() => {}} style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 60 }}>TEST</Text>
        </View>
    )
}

const styles = StyleSheet.create({})

export default Comp
