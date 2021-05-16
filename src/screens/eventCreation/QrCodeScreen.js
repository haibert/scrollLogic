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

//qr code
import QRCode from 'react-native-qrcode-svg'
import { color } from 'react-native-reanimated'

const { height, width } = Dimensions.get('screen')

const QrCodeScreen = (props) => {
    const insets = useSafeAreaInsets()

    function hideKeyboard() {
        Keyboard.dismiss()
    }

    const randomNumber = (
        Math.random().toFixed(5) * 100000 +
        Math.random().toFixed(3) * 1000 +
        Math.random().toFixed(3) * 1000
    ).toString()

    // let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';
    return (
        <View style={styles.screen}>
            <LinearGradient
                colors={['rgba(255, 237, 187, 1)', 'rgba(150, 227, 255, 1)']}
                colors={['rgba(252,140,250,1)', colors.evenLighterTint]}
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
                            Share Event With QR Code
                        </Text>
                        <Text
                            style={styles.underTitle}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            You can share the code bellow with others. You may
                            also have the code printed on a large poster and
                            displayed at your event so others can easily join
                            and upload their pictures.
                        </Text>
                        <Text
                            style={styles.underTitle}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                        >
                            To have this done for you and shipped click here.
                        </Text>
                    </View>
                    <View style={styles.bottomCont}>
                        <View style={{ marginTop: '-20%' }}>
                            <QRCode
                                value={randomNumber}
                                size={280}
                                color={colors.textColor}
                                backgroundColor="transparent"
                                enableLinearGradient
                                linearGradient={[
                                    colors.yellow,
                                    'rgba(150, 227, 255, 1)',
                                ]}
                                // logo={{ uri: base64Logo }}
                                // logoSize={30}
                                // logoBackgroundColor='transparent'
                            />
                        </View>
                    </View>
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
        color: colors.textColor,
    },
    underTitle: {
        color: colors.mediumTint,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 15,
        paddingHorizontal: 20,
    },
    bottomCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '80%',
    },
})

export default QrCodeScreen
