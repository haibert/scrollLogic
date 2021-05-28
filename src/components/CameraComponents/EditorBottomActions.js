import React from 'react'
import { View, StyleSheet } from 'react-native'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//colors
import colors from '../../constants/colors'

const EditorBottomActions = (props) => {
    return (
        // <View style={styles.bottomCont}>
        <View style={styles.bottomButtonsCont}>
            <View style={styles.circle}>
                <Ionicons
                    name="download-outline"
                    size={28}
                    color="white"
                    onPress={props.onSave}
                />
            </View>

            <View style={styles.circle}>
                <Icon
                    name={props.checkMarkSet ? 'check' : 'upload'}
                    type="feather"
                    size={28}
                    color="white"
                    onPress={props.onUpload}
                />
            </View>
        </View>
        // </View>
    )
}

const styles = StyleSheet.create({
    bottomButtonsCont: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
    },

    circle: {
        height: 40,
        width: 60,
        borderRadius: 20,
        backgroundColor: colors.lightTint,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default EditorBottomActions
