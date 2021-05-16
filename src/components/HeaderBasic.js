import React from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableWithoutFeedback,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//colors
import colors from '../constants/colors'

const { width, height } = Dimensions.get('window')

const CustomHeaderBasic = (props) => {
    const iconStyle =
        props.iconName === 'menu-outline'
            ? { textAlign: 'center', marginLeft: 2 }
            : {}
    return (
        <View style={styles.outerCont}>
            <View style={styles.middleCont}>
                <Text style={{ ...styles.headerText, ...props.headerColor }}>
                    {props.header}
                </Text>
            </View>
            <View style={styles.xCont}>
                <TouchableOpacity onPress={props.goBack}>
                    <View style={styles.circle}>
                        <Ionicons
                            name={props.iconName}
                            size={30}
                            color={colors.textColor}
                            style={iconStyle}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerCont: {
        width: '100%',
        height: 50,
    },
    xCont: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    middleCont: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '100%',
        height: 46,
    },
    headerText: {
        color: 'white',
        fontSize: 21,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: colors.lightTint,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 10,
        },
    },
})

export default CustomHeaderBasic
