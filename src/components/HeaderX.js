import React from 'react'
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//colors
import colors from '../constants/colors'

const HeaderX = (props) => {
    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableWithoutFeedback
    }
    return (
        <View style={styles.xCont}>
            <TouchableCmp onPress={props.goBack}>
                <Ionicons
                    name="close-outline"
                    size={50}
                    color={!props.color ? colors.mediumTint : props.color}
                    style={styles.xShadow}
                />
            </TouchableCmp>
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
        marginLeft: 10,
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
