import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'
import TitleText from '../../components/Title'

const JoinEventScreen = (props) => {
    return (
        <ScreenWrapper>
            <HeaderBasic
                goBack={() => {
                    props.navigation.goBack()
                }}
            />
            <TitleText>Join Event</TitleText>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({})

export default JoinEventScreen
