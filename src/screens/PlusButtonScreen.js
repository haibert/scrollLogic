import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

//custom components
import FloatingButton from '../components/FloatingButton'
import ScreenWrapper from '../components/ScreenWrapper'

const PlusButtonScreen = (props) => {
    return (
        <ScreenWrapper style={styles.container} paddingBottom>
            <FloatingButton />
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingBottom: 38,
    },
})

export default PlusButtonScreen
