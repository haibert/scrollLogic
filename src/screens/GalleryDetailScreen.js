import React, { useRef } from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import ActionSheetGV from '../components/ActionSheetGV'
import CachedImage from '../components/CachedImage'

const { width, height } = Dimensions.get('window')

//constants
import colors from '../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//redux
import { deletePhoto } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

//paper
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper'

const GalleryDetailScreen = ({ route, navigation }) => {
    const { image, refreshPics } = route.params
    const bottomSheetModalRef = useRef()

    //----------------------------------------------------------------DELETE PHOTO----------------------------------------------------------------
    const dispatch = useDispatch()
    const deletePhotoHandler = async () => {
        await dispatch(deletePhoto(image.id))
        bottomSheetModalRef.current?.handleClosetModalPress()
        navigation.navigate('GalleryView', {
            shouldRefresh: 'shouldRefresh',
        })
    }

    //----------------------------------------------------------------DELETE PHOTO----------------------------------------------------------------

    return (
        <ScreenWrapper style={{ paddingBottom: 0 }}>
            <HeaderBasic
                goBack={() => {
                    navigation.goBack()
                }}
                headerColor={{ color: colors.textColor }}
                iconName="chevron-down-outline"
            />
            <View style={styles.imageTopActionsCont}>
                <Ionicons
                    name="ellipsis-horizontal"
                    size={25}
                    color={colors.textColor}
                    onPress={() => {
                        bottomSheetModalRef.current?.handlePresentModalPress()
                    }}
                />
            </View>
            <Image
                style={{
                    width: width,
                    height: height - 200,
                    marginTop: 10,
                }}
                resizeMode="cover"
                source={{
                    uri: image.fullPath,
                    cache: 'force-cache',
                }}
                onLayout={(evt) => {
                    {
                        evt.nativeEvent.height
                    }
                    // console.log(
                    //     '🚀 ~ file: GalleryDetailScreen.js ~ line 72 ~ GalleryDetailScreen ~ evt.nativeEvent.height',
                    //     evt.nativeEvent.layout.height
                    // )
                }}
                // cacheKey={`${image.id + 'fullSize'}t`}
            />
            <ActionSheetGV
                ref={bottomSheetModalRef}
                navigation={navigation}
                yesPressed={deletePhotoHandler}
                // refreshPhotos={loadGalleries}
            />
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    imageTopActionsCont: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
    },
})

export default GalleryDetailScreen
