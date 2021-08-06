import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'

//Custom components
import ScaleButton from '../TouchableScale'
import colors from '../../constants/colors'

//bottom sheet
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//fast image
import FastImage from 'react-native-fast-image'

const CheckedComponent = () => (
    <Ionicons
        name="checkmark-circle"
        size={25}
        color={colors.lightTint}
        style={styles.fullCircle}
    />
)
const EmptyCircle = () => <View style={styles.emptyCircle}></View>

const FriendSelectionCell = (props) => {
    const [checked, setChecked] = useState(props.isSelected())

    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    const normalizedSource = useCallback(() => {
        const imageString = `${props.avatar}`
        const normalizedSource =
            imageString &&
            typeof imageString === 'string' &&
            !imageString.split('http')[1]
                ? null
                : imageString
        return normalizedSource
    }, [])
    //----------------------------------------------------------------NORMALIZE URI----------------------------------------------------------------
    return (
        <View style={styles.cont}>
            <ScaleButton
                activeScale={0.93}
                onPress={() => {
                    setChecked((prevState) => !prevState)
                    props.onSelect()
                }}
                contentContainerStyle={styles.cellOuter}
                haptics
            >
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
                            style={styles.title}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            {props.username}
                        </Text>

                        <Text
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                            style={styles.username}
                        >
                            {`${props.firstName} ` + `${props.lastName}`}
                        </Text>
                    </View>
                    <View style={styles.rightSideCont}>
                        {checked ? <CheckedComponent /> : <EmptyCircle />}
                    </View>
                </View>
            </ScaleButton>
        </View>
    )
}

const styles = StyleSheet.create({
    cont: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(235,235,235,1)',
    },
    cellOuter: {
        height: 55,
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
        marginRight: 10,
    },
    namesCont: {
        height: 60,
        position: 'absolute',
        top: 0,
        left: 60,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rightSideCont: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
    },
    emptyCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(235,235,235,1)',
        marginRight: 10,
    },
    fullCircle: {
        marginRight: 7,
    },
})

export default FriendSelectionCell
