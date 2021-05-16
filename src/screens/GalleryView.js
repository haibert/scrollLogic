import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    FlatList,
    Platform,
} from 'react-native'

//shared elements
import { SharedElement } from 'react-navigation-shared-element'

//custom components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import ThumbnailSmall from '../components/ThumbnailSmall'

//constants
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//dummy data
import images from '../data/images'

const GalleryView = ({ route, navigation }) => {
    const { image } = route.params
    const insets = useSafeAreaInsets()

    let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10

    if (tabBarBottomPosition === 10 && Platform.OS === 'android') {
        tabBarBottomPosition = 55
    }

    function picturePressedHandler(image) {
        navigation.navigate('GalleryDetailScreen', {
            image,
        })
    }

    const handleScroll = (event) => {
        if (event.nativeEvent.contentOffset.y < 1) {
            navigation.goBack()
        }
    }

    return (
        <ScreenWrapper>
            {/* <SharedElement id={image.id} style={styles.sharedElement}>
                <ImageBackground style={styles.imageBg}></ImageBackground>
            </SharedElement> */}
            <HeaderBasic
                goBack={() => {
                    navigation.goBack()
                }}
                header="Your Event"
                headerColor={{ color: colors.textColor }}
                iconName="chevron-down-outline"
            />

            <FlatList
                style={styles.flatList}
                data={images}
                keyExtractor={(item) => `${item.id}`}
                renderItem={(item) => {
                    return (
                        <ThumbnailSmall
                            images={item.item}
                            picturePressedHandler={() => {
                                picturePressedHandler(item.item)
                            }}
                        />
                    )
                }}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                columnWrapperStyle={
                    {
                        // marginLeft: 10,
                    }
                }
                contentContainerStyle={{
                    paddingBottom: tabBarBottomPosition + 60,
                }}
                onScrollEndDrag={handleScroll}
            />
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    sharedElement: {
        flex: 1,
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
    },
    imageBg: {
        flex: 1,
    },
    flatList: {
        marginTop: 10,
        flex: 1,
    },
})

export default GalleryView
