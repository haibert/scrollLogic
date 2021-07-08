import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    Alert,
    Linking,
} from 'react-native'

//custom components
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'

//colors
import colors from '../../constants/colors'

//dimensions
const { width, height } = Dimensions.get('window')

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//image picker
import * as ImagePicker from 'expo-image-picker'

//redux
import { changeAvatar } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

const ProfileEditScreen = ({ route, ...props }) => {
    //picture source
    // const picSource = useSelector(
    //     (state) => state.signupReducer.userInfo.avatar
    // )

    //insets
    const insets = useSafeAreaInsets()

    //dispatch
    const dispatch = useDispatch()

    return (
        <ScreenWrapper style={{ paddingBottom: insets.bottom }}>
            <HeaderBasic
                iconName="chevron-back-outline"
                goBack={() => {
                    props.navigation.goBack()
                }}
                header="Edit Profile"
                headerColor={{ color: colors.darkestColorP1 }}
            />
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({})

export default ProfileEditScreen
