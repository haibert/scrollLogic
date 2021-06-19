import React, {
    useCallback,
    useRef,
    useMemo,
    useImperativeHandle,
    forwardRef,
    useEffect,
} from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import BottomSheet, {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
    BottomSheetFlatList,
    BottomSheetView,
} from '@gorhom/bottom-sheet'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// big list
import BigList from 'react-native-big-list'
import { useDispatch, useSelector } from 'react-redux'

//custom components
import ThumbnailBig from '../components/ThumbnailBig'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated'

import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'
//Due to wrapping the content and handle with TapGestureHandler & PanGestureHandler, any gesture interaction would not function as expected.
//To resolve this issue, please use touchables that this library provides.

const { width, height } = Dimensions.get('window')

const CustomBackdrop = ({ animatedIndex, style }) => {
    // animated variables
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animatedIndex.value,
            [0, 1],
            [0, 1],
            Extrapolate.CLAMP
        ),
    }))
    // animated styles
    const containerStyle = useMemo(
        () => [
            style,
            {
                backgroundColor: 'rgba(94,94,94,0.64)',
            },
            containerAnimatedStyle,
        ],
        [style, containerAnimatedStyle]
    )

    return <Animated.View style={containerStyle} />
}

const CustomHandleComponent = () => {
    const insets = useSafeAreaInsets()

    return <View style={{ width: '100%', height: insets.top }}></View>
}
const GalDetailBottomSheet = forwardRef((props, ref) => {
    // hooks
    let bigListRef = useRef()

    const bottomSheetModalRef = useRef()
    const insets = useSafeAreaInsets()

    const snapPoints = useMemo(() => ['100%', '100%'], [])
    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present()
    }, [])
    const handleSheetChangesModal = useCallback((index: number) => {
        console.log('handleSheetChanges', index)
    }, [])

    const indexRef = useRef()

    useImperativeHandle(ref, () => ({
        handlePresentModalPress: () => {
            bottomSheetModalRef.current?.present()
            // bottomSheetModalRef.current?.snapTo(1)
        },
        scrollToItem: (index) => {
            console.log(bigListRef.current)
            bigListRef.current?.scrollToIndex({ index, animated: true })
        },
    }))

    useEffect(() => {
        console.log(
            '🚀 ~ file: GalDetailBottomSheet.js ~ line 125 ~ useEffect ~ bigListRef.current',
            bigListRef.current
        )

        bigListRef.current?.scrollToIndex({ index: 4, animated: true })
    }, [])

    const render = useCallback(({ item, index }) => {
        return <ThumbnailBig images={item} key={item.galleryID} />
    }, [])

    console.log('BOTTOM SHEET reRendered')

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChangesModal}
                // backdropComponent={CustomBackdrop}
                dismissOnPanDown={true}
                handleComponent={CustomHandleComponent}
                onDismiss={() => {
                    console.log('closed')
                }}
                style={{
                    flex: 1,
                }}
            >
                {/* <BottomSheet
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            // onChange={handleSheetChangesModal}
            // backdropComponent={CustomBackdrop}
            dismissOnPanDown={true}
            handleComponent={CustomHandleComponent}
            onDismiss={() => {
                console.log('closed')
            }}
            style={{
                flex: 1,
            }}
            // enableContentPanningGesture={false}
        > */}
                <BottomSheetScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flex: 1,
                    }}
                    keyboardDismissMode="on-drag"
                >
                    <BigList
                        ref={bigListRef}
                        data={props.data}
                        renderItem={render}
                        itemHeight={height + 80}
                        headerHeight={0}
                        footerHeight={0}
                        contentContainerStyle={
                            {
                                // paddingBottom: tabBarBottomPosition + 80,
                            }
                        }
                        style={{ flex: 1 }}
                        // onRefresh={loadGalleries}
                        // refreshing={loadingGalleries}
                        // ListEmptyComponent={}
                        disableScrollViewPanResponder
                    />

                    {/* <BottomSheetFlatList
                ref={bigListRef}
                data={props.data}
                renderItem={render}
                keyExtractor={(item) => item.id}
                style={{ flex: 1 }}
                initialScrollIndex={props.index}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise((resolve) =>
                        setTimeout(resolve, 500)
                    )
                    wait.then(() => {
                        bigListRef.current?.scrollToIndex({
                            index: props.index,
                            animated: false,
                        })
                    })
                }}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
            /> */}
                    {/* </BottomSheet> */}
                </BottomSheetScrollView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    )
})
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 200,
    },
})

export default GalDetailBottomSheet
