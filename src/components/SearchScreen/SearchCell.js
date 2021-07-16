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

const SearchCell = (props) => {
    //dispatch
    const dispatch = useDispatch()

    //----------------------------------------------------------------Load Profile----------------------------------------------------------------
    const onPress = useCallback(async () => {
        props.onPress()
        try {
            dispatch(loadProfile(props.searchResults.uniqueID))
            props.navigation.navigate('OtherProfileScreen', {
                uniqueID: props.searchResults.uniqueID,
            })
        } catch (err) {
            console.log(err)
        }
    }, [])
    //----------------------------------------------------------------Load Profile----------------------------------------------------------------

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.cellOuter}>
                <Image
                    source={{ uri: props.searchResults.avatar }}
                    style={styles.imageCont}
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
