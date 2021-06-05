import React, {
    useCallback,
    useRef,
    useMemo,
    useImperativeHandle,
    forwardRef,
    useState,
} from 'react'
import { StyleSheet, View, Dimensions, Text } from 'react-native'
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
    BottomSheetFlatList,
    BottomSheetView,
    BottomSheetBackdrop,
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

const { height, width } = Dimensions.get('window')
//Due to wrapping the content and handle with TapGestureHandler & PanGestureHandler, any gesture interaction would not function as expected.
//To resolve this issue, please use touchables that this library provides.

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//colors
import colors from '../constants/colors'

//redux
import { deletePhoto } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

//custom components
import Card from '../components/Card'

const CustomHandleComponent = () => {
    return <View style={{ borderRadius: 20, width: '100%', height: 15 }}></View>
}
const ActionSheetGV = forwardRef((props, ref) => {
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    const [showConfirm, setShowConfirm] = useState(false)

    const bottomSheetModalRef = useRef()
    const snapPoints = useMemo(() => [150, 150, 200], [])
    useImperativeHandle(ref, () => ({
        handlePresentModalPress: () => {
            bottomSheetModalRef.current.present()
        },
        handleClosetModalPress: () => {
            bottomSheetModalRef.current.close()
        },
    }))
    const handleSheetChangesModal = useCallback((index) => {}, [])

    //----------------------------------------------------------------CONFIRMATION ANIMATION----------------------------------------------------------------
    const animatedOpacity = useSharedValue(0)
    const opacity = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity.value,
        }
    })
    const animate = () => {
        animatedOpacity.value = withTiming(1, { duration: 200 })
    }
    //----------------------------------------------------------------CONFIRMATION ANIMATION----------------------------------------------------------------

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChangesModal}
                backdropComponent={({ animatedIndex, style }) => {
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
                }}
                dismissOnPanDown={true}
                handleComponent={CustomHandleComponent}
                style={{ backgroundColor: 'transparent' }}
            >
                <View
                    style={{
                        paddingBottom: insets.bottom,
                        height: 100,
                        backgroundColor: 'transparent',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            bottomSheetModalRef.current?.snapTo(2)
                            animate()
                        }}
                    >
                        <View style={styles.actionButton}>
                            <Ionicons
                                name="trash-outline"
                                size={20}
                                color="red"
                            />
                            <Text style={styles.deleteText}>Delete</Text>
                        </View>
                    </TouchableOpacity>
                    <Animated.View style={[styles.actionButton2, opacity]}>
                        <Text style={styles.confirmQuestion}>
                            Are you sure?
                        </Text>
                        <View style={styles.yesNo}>
                            <TouchableOpacity
                                onPress={() => {
                                    props.yesPressed()
                                    animatedOpacity.value = 0
                                }}
                            >
                                <Text style={styles.confirmQuestion}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    animatedOpacity.value = 0
                                    bottomSheetModalRef.current?.close()
                                }}
                            >
                                <Text style={styles.confirmQuestion}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2,
    },
    actionButton: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        padding: 10,
        alignItems: 'center',
    },
    actionButton2: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    deleteText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10,
    },
    confirmQuestion: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    yesNo: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: 100,
        marginRight: 20,
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default ActionSheetGV
