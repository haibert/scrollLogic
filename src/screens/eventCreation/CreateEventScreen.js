import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../../constants/colors'
import Button from '../../components/Button'

const { height, width } = Dimensions.get('screen')

const CreateEventScreen = (props) => {
    const insets = useSafeAreaInsets()

    function hideKeyboard() {
        Keyboard.dismiss()
    }

    return (
        <View style={styles.screen}>
            <LinearGradient
                colors={['rgba(255, 237, 187, 1)', 'rgba(150, 227, 255, 1)']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View
                    style={{
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                        flex: 1,
                    }}
                >
                    <View style={styles.xCont}>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.goBack()
                            }}
                        >
                            <Ionicons
                                name="chevron-back-outline"
                                size={40}
                                color={colors.mediumTint}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleCont}>
                        <Text
                            style={styles.title}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            Add Event Name
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Event Name"
                            placeholderTextColor={colors.placeHolder}
                            selectionColor={colors.lightTint}
                            underlineColorAndroid="rgba(255,255,255,0)"
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                            // onChangeText={inputChangeHandler}
                            // value={enteredNumber}
                            autoFocus
                        />
                    </View>
                    <TouchableWithoutFeedback onPress={hideKeyboard}>
                        <View style={styles.bottomCont}>
                            <Button
                                text="Create Event"
                                style={styles.button}
                                onPress={() => {
                                    props.navigation.navigate('QrCodeScreen')
                                }}
                            ></Button>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: height,
        width: '100%',
    },
    xCont: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleCont: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        color: colors.placeHolder,
    },
    underTitle: {
        color: colors.mediumTint,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 15,
    },
    input: {
        marginTop: 30,
        width: '92%',
        height: 50,
        borderRadius: 5,
        padding: 10,
        color: colors.textColor,
        fontSize: 17,
        borderBottomColor: colors.mediumTint,
        borderBottomWidth: 1,
    },
    bottomCont: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'flex-end',
        paddingBottom: 80,
    },
    button: {
        marginTop: 50,
        width: '80%',
    },
})

export default CreateEventScreen
