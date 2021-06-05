import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//colors
import colors from '../../constants/colors'

const EditorBottomActions = (props) => {
    return (
        // <View style={styles.bottomCont}>
        <View style={styles.bottomButtonsCont}>
            <TouchableOpacity onPress={props.onSave}>
                <View style={styles.circle}>
                    <Ionicons
                        name="download-outline"
                        size={27}
                        color="white"
                        onPress={props.onSave}
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={
                    props.checkMarkSet
                        ? props.onUpload
                        : props.onPresentGalleries
                }
            >
                <View style={styles.circle}>
                    <Ionicons
                        name={props.checkMarkSet ? 'checkmark' : 'send'}
                        type="feather"
                        size={27}
                        color="white"
                        onPress={
                            props.checkMarkSet
                                ? props.onUpload
                                : props.onPresentGalleries
                        }
                    />
                </View>
            </TouchableOpacity>
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
