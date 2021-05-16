import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

import colors from '../constants/colors'

const GridComponent = (props) => {
    const color = colors.lightTint
    return (
        <View
            style={{
                height: 300,
                width: 300,
                position: 'absolute',
                top: height / 2 - 250,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {props.children}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: 15,
                    width: 70,
                    backgroundColor: color,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    left: -28,
                    top: 28,
                    height: 15,
                    width: 70,
                    backgroundColor: color,
                    transform: [
                        {
                            rotate: '90deg',
                        },
                    ],
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    left: -28,
                    bottom: 28,
                    height: 15,
                    width: 70,
                    backgroundColor: color,
                    transform: [
                        {
                            rotate: '90deg',
                        },
                    ],
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    height: 15,
                    width: 70,
                    backgroundColor: color,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    height: 15,
                    width: 70,
                    backgroundColor: color,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    right: -28,
                    bottom: 28,
                    height: 15,
                    width: 70,
                    backgroundColor: color,
                    transform: [
                        {
                            rotate: '90deg',
                        },
                    ],
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    height: 15,
                    width: 70,
                    backgroundColor: color,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    right: -28,
                    top: 28,
                    height: 15,
                    width: 70,
                    backgroundColor: color,
                    transform: [
                        {
                            rotate: '90deg',
                        },
                    ],
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({})

export default GridComponent
