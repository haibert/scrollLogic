import React, {
    useCallback,
    useRef,
    useMemo,
    useImperativeHandle,
    forwardRef,
    useState,
} from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
    BottomSheetFlatList,
    BottomSheetView,
    useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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

//custom CameraComponents
import SelectionCellItem from '../../components/CameraComponents/SelectionCellItem'
import Button from '../../components/Button'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//colors
import colors from '../../constants/colors'

//redux
import { addToGallery } from '../../store/camera/actions'
import { useDispatch, useSelector } from 'react-redux'

// nav actions
import { CommonActions } from '@react-navigation/native'

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
    return <View style={{ borderRadius: 20, width: '100%', height: 15 }}></View>
}
const BottomSheet = forwardRef((props, ref) => {
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()

    // hooks
    const bottomSheetModalRef = useRef()
    const snapPoints = useMemo(() => ['100%', '100%'], [])
    // callbacks
    useImperativeHandle(ref, () => ({
        handlePresentModalPress: () => {
            bottomSheetModalRef.current?.present()
        },
        handleDismissModalPress: () => {
            bottomSheetModalRef.current?.dismiss()
        },
    }))
    const handleSheetChangesModal = useCallback((index) => {}, [])

    const selectedGalleries = []

    //----------------------------------------------------------------FLAT LIST DATA----------------------------------------------------------------
    const galleries = useSelector((state) => state.galleryReducer.galleries)

    const renderItem = useCallback(
        ({ item, index }) => (
            <SelectionCellItem
                key={item.galleryID}
                navigation={props.navigation}
                galleryName={item.galleryName}
                galleryID={item.galleryID}
                onSelect={() => {
                    const exists = selectedGalleries.includes(item.galleryID)

                    if (exists) {
                        const index = selectedGalleries.indexOf(item.galleryID)
                        if (index > -1) {
                            selectedGalleries.splice(index, 1)
                        }
                    } else {
                        selectedGalleries.push(item.galleryID)
                    }
                    console.log(
                        '🚀 ~ file: BottomSheet.js ~ line 102 ~ BottomSheet ~ selectedGalleries',
                        selectedGalleries
                    )
                }}
            />
        ),
        []
    )

    //----------------------------------------------------------------FLAT LIST DATA----------------------------------------------------------------

    //----------------------------------------------------------------UPLOADING PICTURE----------------------------------------------------------------
    const picTaken = useSelector((state) => state.cameraReducer.pictureBase64)
    const uploadPhotoHandler = useCallback(async () => {
        if (selectedGalleries.length === 0) return
        try {
            await dispatch(
                addToGallery(
                    `data:image/jpeg;base64,${picTaken}`,
                    selectedGalleries
                )
            )
            bottomSheetModalRef.current?.close()
            props.dismissModal()
        } catch (err) {}
    }, [])
    //----------------------------------------------------------------UPLOADING PICTURE----------------------------------------------------------------

    //----------------------------------------------------------------NO GALLERIES CONTENT----------------------------------------------------------------
    const NoGalleriesContent = useCallback(() => {
        return (
            <View style={styles.noGalCont}>
                <Text maxFontSizeMultiplier={colors.maxFontSizeMultiplier}>
                    It seems like you have not created any galleries yet.
                </Text>
                <Button
                    text="Create Gallery"
                    style={styles.button}
                    onPress={navToCreateGallery}
                />
            </View>
        )
    }, [])

    const navToCreateGallery = useCallback(() => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'DashModalStack' },
                    {
                        name: 'CreateEventScreen',
                    },
                ],
            })
        )
    }, [])
    //----------------------------------------------------------------NO GALLERIES CONTENT----------------------------------------------------------------

    const animationConfig = useBottomSheetTimingConfigs({
        duration: 1000,
        // easing: 'easeInOut',
    })
    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChangesModal}
                // backdropComponent={CustomBackdrop}
                // dismissOnPanDown={true}
                handleComponent={CustomHandleComponent}
                dismissOnPanDown={true}
                animationConfigs={animationConfig}
            >
                <View
                    style={{
                        paddingTop: insets.top + 60,
                        flex: 1,
                        paddingVertical: 10,
                        paddingBottom: 90,
                    }}
                >
                    <BottomSheetFlatList
                        style={styles.flatList}
                        data={galleries}
                        keyExtractor={(item) => `${item.galleryID}`}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        // columnWrapperStyle={{
                        //     marginLeft: 10,
                        // }}
                        // contentContainerStyle={{
                        //     paddingBottom: tabBarBottomPosition + 60,
                        // }}
                    />

                    <View
                        style={{
                            ...styles.bottomActions,
                            height: 60 + insets.bottom,
                        }}
                    >
                        <View style={styles.bottomButtonsCont}>
                            {/* <View style={styles.circle}>
                                <Ionicons
                                    name="download-outline"
                                    size={28}
                                    color="white"
                                    onPress={props.onSave}
                                />
                            </View> */}
                            <TouchableOpacity onPress={uploadPhotoHandler}>
                                <View style={styles.circle}>
                                    <Ionicons
                                        name="send"
                                        size={28}
                                        color={colors.lightTint}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        flex: 1,
    },
    shadowView: {
        flex: 1,
        shadowColor: 'black',
        shadowRadius: 7,
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        borderRadius: 20,
        elevation: 5,
        marginHorizontal: 10,
        backgroundColor: 'white',
    },
    bottomActions: {
        height: 50,
        minWidth: '100%',
        backgroundColor: colors.lightTint,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
    },
    bottomButtonsCont: {
        minWidth: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        padding: 10,
    },

    circle: {
        height: 40,
        width: 60,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noGalCont: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 40,
        width: '90%',
    },
})

export default BottomSheet

// return (
//     <BottomSheetModalProvider>
//         <BottomSheetModal
//             ref={bottomSheetModalRef}
//             index={1}
//             snapPoints={snapPoints}
//             onChange={handleSheetChangesModal}
//             // backdropComponent={CustomBackdrop}
//             dismissOnPanDown={true}
//             handleComponent={CustomHandleComponent}
//         >
//             <View
//                 style={{
//                     paddingTop: insets.top,
//                     flex: 1,
//                     paddingVertical: 10,
//                 }}
//             >
//                 {/* <BottomSheetScrollView
//                     contentContainerStyle={{
//                         paddingTop: insets.top,
//                         paddingBottom: 50 + insets.bottom,
//                     }}
//                 > */}
//                 {galleries.length === 0 ? <NoGalleriesContent /> : null}
//                 {/* <View style={styles.shadowView}> */}
//                 {/* <View
//                             style={{ overflow: 'hidden', borderRadius: 20 }}
//                         > */}
//                 {/* {galleries.map(renderItem)} */}
//                 <BottomSheetFlatList
//                     style={styles.flatList}
//                     data={galleries}
//                     keyExtractor={(item) => `${item.galleryID}`}
//                     renderItem={({ item, index }) => {
//                         return (
//                             <SelectionCellItem
//                                 navigation={props.navigation}
//                                 galleryName={item.galleryName}
//                                 galleryID={item.galleryID}
//                                 onSelect={() => {
//                                     selectedGalleries.push(item.galleryID)
//                                     console.log(
//                                         '🚀 ~ file: BottomSheet.js ~ line 88 ~ BottomSheet ~ selectedGalleries',
//                                         selectedGalleries
//                                     )
//                                 }}
//                             />
//                         )
//                     }}
//                     showsVerticalScrollIndicator={false}
//                     // columnWrapperStyle={{
//                     //     marginLeft: 10,
//                     // }}
//                     // contentContainerStyle={{
//                     //     paddingBottom: tabBarBottomPosition + 60,
//                     // }}
//                 />
//                 {/* </View> */}
//                 {/* </View> */}
//                 {/* </BottomSheetScrollView> */}
//                 <View
//                     style={{
//                         ...styles.bottomActions,
//                         height: 60 + insets.bottom,
//                     }}
//                 >
//                     <View style={styles.bottomButtonsCont}>
//                         {/* <View style={styles.circle}>
//                             <Ionicons
//                                 name="download-outline"
//                                 size={28}
//                                 color="white"
//                                 onPress={props.onSave}
//                             />
//                         </View> */}
//                         <TouchableOpacity onPress={uploadPhotoHandler}>
//                             <View style={styles.circle}>
//                                 <Ionicons
//                                     name="send"
//                                     size={28}
//                                     color={colors.lightTint}
//                                 />
//                             </View>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </BottomSheetModal>
//     </BottomSheetModalProvider>
// )
// })
