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
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//colors
import colors from '../constants/colors'

//custom components
import BottomSheetBackDrop from './BottomSheetBackDrop'

const CustomHandleComponent = () => {
    return <View style={{ borderRadius: 20, width: '100%', height: 15 }}></View>
}
const ActionBottomSheet = forwardRef((props, ref) => {
    //bottom sheet ref
    const bottomSheetModalRef = useRef()

    //insets
    const insets = useSafeAreaInsets()

    const snapPoints = useMemo(
        () => [150 + insets.bottom, 150 + insets.bottom],
        []
    )
    useImperativeHandle(ref, () => ({
        handlePresentModalPress: () => {
            bottomSheetModalRef.current.present()
        },
    }))

    //----------------------------------------------------------------ANIMATION CONFIG----------------------------------------------------------------
    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 400,
    })
    //----------------------------------------------------------------ANIMATION CONFIG----------------------------------------------------------------

    //----------------------------------------------------------------DELETING GALLERY----------------------------------------------------------------
    const deleteGalleryHandler = useCallback(() => {
        bottomSheetModalRef.current?.close()
        props.showConfirmation()
    }, [])
    //----------------------------------------------------------------DELETING GALLERY----------------------------------------------------------------

    //----------------------------------------------------------------CANCEL----------------------------------------------------------------
    const cancelPressedHandler = useCallback(() => {
        bottomSheetModalRef.current.close()
        props.closeModal()
    }, [])
    //----------------------------------------------------------------CANCEL----------------------------------------------------------------

    return (
        <BottomSheetModalProvider style={StyleSheet.absoluteFill}>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                backgroundComponent={null}
                animationConfigs={animationConfigs}
                backdropComponent={({ animatedIndex, style }) => {
                    return (
                        <BottomSheetBackDrop
                            animatedIndex={animatedIndex}
                            style={style}
                            closeModal={props.closeModal}
                        />
                    )
                }}
                dismissOnPanDown={true}
                handleComponent={CustomHandleComponent}
            >
                <View
                    style={{
                        ...styles.container,
                    }}
                >
                    <Pressable
                        onPress={deleteGalleryHandler}
                        style={styles.removeButton}
                    >
                        <Text
                            style={styles.removeText}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            Delete Gallery
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

export default ActionBottomSheet
