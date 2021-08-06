import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import colors from '../../constants/colors'

const SavedFriendsCell = (props) => {
    return (
        <View style={styles.cont}>
            <Text
                maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                style={styles.text}
            >
                {props.username}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    cont: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightTint,
        marginRight: 10,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
})

export default SavedFriendsCell
