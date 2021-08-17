import React, {
    useCallback,
    useRef,
    useMemo,
    useImperativeHandle,
    forwardRef,
    useState,
} from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet'
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//colors
import colors from '../../constants/colors'

//redux
//redux
import { removeFriend, followUnfollow } from '../../store/signup-auth/actions'
import { useDispatch } from 'react-redux'

import BottomSheetBackDrop from '../BottomSheetBackDrop'

const CustomHandleComponent = () => {
    return <View style={{ borderRadius: 20, width: '100%', height: 15 }}></View>
}
const FollowingActionSheet = forwardRef((props, ref) => {
    //dispatch
    const dispatch = useDispatch()

    //insets
    const insets = useSafeAreaInsets()

    //sheet ref
    const bottomSheetModalRef = useRef()

    //snap points
    const snapPoints = useMemo(
        () => [150 + insets.bottom, 150 + insets.bottom],
        []
    )
    useImperativeHandle(ref, () => ({
        handlePresentModalPress: () => {
            bottomSheetModalRef.current.present()
        },
        closeActionSheet: () => {
            bottomSheetModalRef.current.close()
        },
    }))

    //----------------------------------------------------------------ANIMATION CONFIG----------------------------------------------------------------
    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 200,
    })
    //----------------------------------------------------------------ANIMATION CONFIG----------------------------------------------------------------

    //----------------------------------------------------------------CANCEL----------------------------------------------------------------
    const cancelPressedHandler = useCallback(() => {
        bottomSheetModalRef.current.close()
    }, [])
    //----------------------------------------------------------------CANCEL----------------------------------------------------------------

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                backgroundComponent={null}
                animationConfigs={animationConfigs}
                backdropComponent={BottomSheetBackDrop}
                dismissOnPanDown={true}
                handleComponent={CustomHandleComponent}
                style={{ backgroundColor: 'transparent' }}
            >
                <View style={styles.container}>
                    <Pressable
                        onPress={props.unfollowConfirmed}
                        style={styles.removeButton}
                    >
                        <Text
                            style={styles.removeText}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            Unfollow
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={cancelPressedHandler}
                        style={styles.cancelButton}
                    >
                        <Text
                            style={styles.cancelText}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            Cancel
                        </Text>
                    </Pressable>
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    )
})

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
    },
    removeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
        borderRadius: 10,
        backgroundColor: colors.inputBorderColor,
    },

    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 55,
        backgroundColor: 'white',
        marginTop: 10,
    },
    removeText: {
        color: 'red',
        fontSize: 20,
    },
    cancelText: {
        color: colors.iOSBlue,
        fontWeight: 'bold',
        fontSize: 20,
    },
})

export default FollowingActionSheet
