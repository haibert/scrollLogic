import React, { useRef, useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import ActionSheetGV from '../components/ActionSheetGV'
import CachedImage from '../components/CachedImage'
import ThumbnailBig from '../components/ThumbnailBig'

const { width, height } = Dimensions.get('window')

//constants
import colors from '../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//redux
import { deletePhoto } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

// big list
import BigList from 'react-native-big-list'

//paper
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper'
import { ScrollView } from 'react-native'

const GalleryDetailScreen = ({ route, navigation }) => {
    const { image, scrollIndex } = route.params
    // console.log(
    //     '🚀 ~ file: GalleryDetailScreen.js ~ line 27 ~ GalleryDetailScreen ~ image',
    //     image.fullPath
    // )
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

    //----------------------------------------------------------------FLATLIST OPTIMIZATION----------------------------------------------------------------
    const bigListRef = useRef()

    const handleScroll = (event) => {
        if (event.nativeEvent.contentOffset.y < 30) {
            navigation.goBack()
        }
    }

    const render = useCallback(({ item, index }) => {
        return <ThumbnailBig images={item} key={item.galleryID} />
    }, [])

    const layOut = useCallback(
        (data, index) => ({
            length: colors.rowHeight,
            offset: colors.rowHeight * index,
            index,
        }),
        []
    )
    const keyExtractor = useCallback((item) => item.id, [])

    const scrollFailed = useCallback(() => {
        setTimeout(() => {
            bigListRef.current?.scrollToIndex({
                index: scrollIndex,
                animated: false,
            })
        }, 500)
    }, [])
    //----------------------------------------------------------------FLATLIST OPTIMIZATION----------------------------------------------------------------

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
            {/* cant use Big list because scroll to index and onScrollEndDrag do not work.*/}
            <FlatList
                ref={bigListRef}
                data={image}
                renderItem={render}
                keyExtractor={keyExtractor}
                onScrollEndDrag={handleScroll}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                initialScrollIndex={scrollIndex}
                onScrollToIndexFailed={scrollFailed}
                getItemLayout={layOut}
                maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
                windowSize={3}
                // contentContainerStyle={
                //     {
                //         // paddingBottom: tabBarBottomPosition + 80,
                //     }
                // }
                // ListEmptyComponent={}
                alwaysBounceVertical={false}
                bounces={false}
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
