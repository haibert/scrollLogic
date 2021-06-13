import React, { useState } from 'react'
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

const CheckedComponent = () => (
    <Ionicons
        name="checkmark-circle"
        size={25}
        color={colors.lightTint}
        style={styles.fullCircle}
    />
)
const EmptyCircle = () => <View style={styles.emptyCircle}></View>

const SelectionCellItem = (props) => {
    const [checked, setChecked] = useState()
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
                    <View style={styles.imageCont}></View>
                    <Text
                        style={styles.title}
                        maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                    >
                        {props.galleryName}
                    </Text>
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

export default SelectionCellItem
