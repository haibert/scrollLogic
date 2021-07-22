import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import ScreenWrapper from '../components/ScreenWrapper'
import NeumorphicButton from '../components/NeumorphicButton'
import NuemorphicNavBar from '../components/NuemorphicNavBar'

const DesignTest = (props) => {
    return (
        <ScreenWrapper
            style={{
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}
        >
            <NuemorphicNavBar />
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({})

export default DesignTest
