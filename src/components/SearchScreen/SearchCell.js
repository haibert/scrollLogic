import React, { useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
} from 'react-native'

import colors from '../../constants/colors'

//redux
import { loadProfile } from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//fast image
import FastImage from 'react-native-fast-image'

const SearchCell = (props) => {
    //dispatch
    const dispatch = useDispatch()

    //----------------------------------------------------------------Load Profile----------------------------------------------------------------
    const onPress = useCallback(async () => {
        // console.log(props.searchResults.firstName)
        try {
            // await dispatch(loadProfile(props.searchResults.uniqueID))
            props.navigation.navigate('OtherProfileScreen', {
                uniqueID: props.searchResults.uniqueID,
            })
        } catch (err) {
            console.log(err)
        }
    }, [props.searchResults])
    //----------------------------------------------------------------Load Profile----------------------------------------------------------------

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = () => {
        const imageString = `${props.searchResults.avatar}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return normalizedSource
    }
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.cellOuter}>
                <FastImage
                    style={styles.imageCont}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                        uri: normalizedSource(),
                        priority: FastImage.priority.normal,
                    }}
                />
                <View style={styles.namesCont}>
                    <Text
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        style={styles.galleryName}
                    >
                        {props.searchResults.userName}
                    </Text>
                    <Text
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        style={styles.username}
                    >
                        {`${props.searchResults.firstName} ` +
                            `${props.searchResults.lastName}`}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    cont: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(235,235,235,1)',
    },
    cellOuter: {
        height: 60,
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageCont: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(235,235,235,1)',
        position: 'absolute',
        left: 10,
    },
    namesCont: {
        height: 60,
        position: 'absolute',
        top: 0,
        left: 60,
        justifyContent: 'center',
    },
    buttonContStyle: {
        position: 'absolute',
        height: 30,
        right: 0,
    },
    button: {
        height: 30,
        width: 70,
        position: 'absolute',
        right: 90,
    },
    buttonReject: {
        height: 30,
        width: 70,
        position: 'absolute',
        right: 10,
        backgroundColor: colors.lightestColorP1,
    },
    galleryName: {
        fontWeight: 'bold',
    },
    username: {},
})

export default SearchCell
