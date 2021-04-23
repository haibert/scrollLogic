import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//colors
import colors from '../constants/colors'

const CustomHeaderBasic = (props) => {
    return (
        <View style={styles.xCont}>
            <TouchableOpacity onPress={props.goBack}>
                <Ionicons
                    name="chevron-back-outline"
                    size={40}
                    color={colors.mediumTint}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    xCont: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
})

export default CustomHeaderBasic
