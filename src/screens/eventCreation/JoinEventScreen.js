import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//custom components
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'
import TitleText from '../../components/Title'
import Button from '../../components/Button'
import CustomInput from '../../components/CustomInput'

//expo qr scanner
import { BarCodeScanner } from 'expo-barcode-scanner'

//constants
import colors from '../../constants/colors'
import { KeyboardAvoidingView } from 'react-native'

const JoinEventScreen = (props) => {
    const [hasPermission, setHasPermission] = useState(null)
    const [hasDenied, setHasDenied] = useState(null)
    const [scanned, setScanned] = useState(false)
    // useEffect(() => {
    //     ;(async () => {
    //         const { status } = await BarCodeScanner.requestPermissionsAsync()
    //         console.log(
    //             '🚀 ~ file: JoinEventScreen.js ~ line 16 ~ ; ~ status',
    //             status
    //         )
    //         setHasPermission(status === 'granted')
    //     })()
    // }, [hasPermission])

    const manuallyAskForPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync()
        console.log(
            '🚀 ~ file: JoinEventScreen.js ~ line 16 ~ ; ~ status',
            status
        )
        setHasPermission(status === 'granted')
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true)
        alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    }

    const NoPermissionContent = () => {
        return (
            <View style={styles.noPermissionContent}>
                <TouchableOpacity onPress={manuallyAskForPermissions}>
                    <Text style={styles.noPermissionText}>
                        Need Camera Permission
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <ScreenWrapper style={styles.screen}>
            <HeaderBasic
                goBack={() => {
                    props.navigation.goBack()
                }}
            />
            <TitleText>Join Event</TitleText>
            <View style={styles.scannerOuterCont}>
                <View style={styles.scannerCont}>
                    {!hasPermission ? (
                        <NoPermissionContent />
                    ) : (
                        <BarCodeScanner
                            onBarCodeScanned={
                                scanned ? undefined : handleBarCodeScanned
                            }
                            style={styles.scanner}
                        >
                            {scanned && (
                                <Button
                                    title={'Tap to Scan Again'}
                                    onPress={() => setScanned(false)}
                                />
                            )}
                        </BarCodeScanner>
                    )}
                </View>
            </View>

            <View style={styles.bottomCont}>
                <CustomInput
                    viewStyle={styles.inputView}
                    textStyle={styles.inputText}
                    placeholder="Event Event Code"
                />
                <Button text="Enter Manually" style={styles.button} />
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    screen: {
        alignItems: 'center',
        flex: 1,
    },
    scannerOuterCont: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scannerCont: {
        width: 300,
        height: 300,
    },
    scanner: {
        flex: 1,
    },
    noPermissionContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.buttonPinkTransparent,
    },
    noPermissionText: {
        fontSize: 17,
        color: colors.textColor,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    // or: { marginTop: 100 },
    // orText: { color: colors.textColor, fontSize: 50 },
    bottomCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 50,
    },
    inputView: {
        height: 50,
        width: '80%',
    },

    button: {
        width: '80%',
        marginTop: 10,
    },
})

export default JoinEventScreen
