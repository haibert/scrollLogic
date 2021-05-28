import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'

const { width, height } = Dimensions.get('window')

//constants
import colors from '../constants/colors'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//paper
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper'

const GalleryDetailScreen = ({ route, navigation }) => {
    const { image } = route.params
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
                />
            </View>
            <Image
                style={{
                    width: width,
                    height: width,
                    marginTop: 10,
                }}
                resizeMode="cover"
                source={image.picture}
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
