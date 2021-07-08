import React, { useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated'

//redux
import { loadProfile } from '../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//custom components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'

//hooks
import useDidMountEffect from '../hooks/useDidMountEffect'

//useFocus InteractionManager
import { InteractionManager } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

//constants
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

const OtherProfileScreen = (props) => {
    //insets
    const insets = useSafeAreaInsets()

    //profile info
    const profileInfo = useSelector(
        (state) => state.signupReducer.loadedProfile
    )

    //----------------------------------------------------------------LOADING ANIMATIONS----------------------------------------------------------------
    const loadingOpacity = useSharedValue(1)
    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: loadingOpacity.value,
        }
    })
    const startOpacityAnim = useCallback(() => {
        loadingOpacity.value = withDelay(200, withTiming(0, { duration: 0 }))
    }, [])
    //----------------------------------------------------------------LOADING ANIMATIONS----------------------------------------------------------------

    return (
        <View style={{ paddingTop: 90 }}>
            <Text>{profileInfo?.avatar}</Text>
            <Text>{profileInfo?.firstName}</Text>
            <Text>{profileInfo?.followersCount}</Text>
            <Text>{profileInfo?.followingCount}</Text>
            <Text>{profileInfo?.lastName}</Text>
            <Text>{profileInfo?.uniqueID}</Text>
            <Text>{profileInfo?.userName}</Text>
            <Animated.View
                pointerEvents={'none'}
                style={[
                    styles.loadingView,
                    opacityStyle,
                    {
                        top: insets.top + 40,
                    },
                ]}
            >
                <ActivityIndicator />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
})

export default OtherProfileScreen
