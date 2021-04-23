import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

//colors
import colors from '../constants/colors'

const TitleText = (props) => {
    return (
        <View style={styles.titleCont}>
            <Text
                style={styles.title}
                maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
            >
                {props.children}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    titleCont: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        color: colors.placeHolder,
    },
})

export default TitleText
