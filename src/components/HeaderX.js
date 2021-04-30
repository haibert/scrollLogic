import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//colors
import colors from '../constants/colors'

const HeaderX = (props) => {
    return (
        <View style={styles.xCont}>
            <TouchableOpacity onPress={props.goBack}>
                <Ionicons
                    name="close-outline"
                    size={40}
                    color={!props.color ? colors.mediumTint : props.color}
                    style={styles.xShadow}
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
        width: '100%',
    },
    xShadow: {
        shadowColor: 'black',
        shadowRadius: 0.7,
        shadowOpacity: 0.8,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        elevation: 1,
    },
})

export default HeaderX
