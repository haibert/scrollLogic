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
import BottomSheet from '@gorhom/bottom-sheet'

import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//colors
import colors from '../../constants/colors'

const CustomHandleComponent = () => {
    return <View style={{ borderRadius: 20, width: '100%', height: 15 }}></View>
}
const DeletePicBottomSheet = forwardRef((props, ref) => {
    //bottom sheet ref
    const bottomSheetModalRef = useRef()

    const snapPoints = useMemo(() => [150, 150], [])
    useImperativeHandle(ref, () => ({
        handlePresentModalPress: () => {
            bottomSheetModalRef.current.present()
        },
    }))

    //----------------------------------------------------------------ANIMATION CONFIG----------------------------------------------------------------
    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 200,
    })
    //----------------------------------------------------------------ANIMATION CONFIG----------------------------------------------------------------

    //----------------------------------------------------------------BACKDROP COMPONENT----------------------------------------------------------------
    const animatedOpacity = useSharedValue(0)

    const backdropComponent = useCallback(({ animatedIndex, style }) => {
        const containerAnimatedStyle = useAnimatedStyle(() => ({
            opacity: interpolate(
                animatedIndex.value,
                [0, 1],
                [0, 1],
                Extrapolate.CLAMP
            ),
        }))
        const containerStyle = useMemo(
            () => [
                style,
                {
                    backgroundColor: 'rgba(32,32,32,0.54)',
                },
                containerAnimatedStyle,
            ],
            [style, containerAnimatedStyle]
        )
        return (
            <Animated.View
                style={containerStyle}
                onTouchStart={() => {
                    animatedOpacity.value = 0
                    bottomSheetModalRef.current?.close()
                }}
            />
        )
    }, [])
    //----------------------------------------------------------------BACKDROP COMPONENT----------------------------------------------------------------

    //----------------------------------------------------------------DELETING GALLERY----------------------------------------------------------------
    const deleteGalleryHandler = useCallback(() => {
        bottomSheetModalRef.current?.close()
        props.showConfirmation()
    }, [])
    //----------------------------------------------------------------DELETING GALLERY----------------------------------------------------------------

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
                backdropComponent={backdropComponent}
                dismissOnPanDown={true}
                handleComponent={CustomHandleComponent}
                style={{ backgroundColor: 'transparent' }}
            >
                <View style={styles.container}>
                    <Pressable
                        onPress={deleteGalleryHandler}
                        style={styles.removeButton}
                    >
                        <Text
                            style={styles.removeText}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            Delete Photo
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
        backgroundColor: 'white',
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
        // color: colors.iOSBlue,
        color: 'red',
        fontSize: 20,
    },
    cancelText: {
        color: colors.iOSBlue,
        fontWeight: 'bold',
        fontSize: 20,
    },
})

export default DeletePicBottomSheet
