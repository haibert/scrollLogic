import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

// custom button
import Button from '../components/Button'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

const { height, width } = Dimensions.get('screen')

const DashboardScreen = (props) => {
    const insets = useSafeAreaInsets()

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
                                props.navigation.toggleDrawer()
                            }}
                        >
                            <Ionicons
                                name="menu-outline"
                                size={35}
                                color={colors.buttonPurple}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.toggleDrawer()
                            }}
                        >
                            <Ionicons
                                name="person"
                                size={26}
                                color={colors.buttonPurple}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            ...styles.tabBar,
                            width: width - 26,
                        }}
                    >
                        <LinearGradient
                            colors={[
                                'rgba(252,140,250,1)',
                                'rgba(155,97,234,1)',
                            ]}
                            style={styles.tabBarGradient}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    props.navigation.navigate('Home')
                                }}
                            >
                                <View style={styles.tabButton}></View>
                            </TouchableWithoutFeedback>

                            <View style={{ width: 50 }}></View>
                            <TouchableWithoutFeedback onPress={() => {}}>
                                <View style={styles.tabButton}></View>
                            </TouchableWithoutFeedback>

                            <Ionicons
                                name="person"
                                color="white"
                                size={22}
                                style={{
                                    position: 'absolute',
                                    top: 14.5,
                                    right: (width - 26) / 6,
                                }}
                            />

                            <Ionicons
                                name="search-outline"
                                size={22}
                                color="white"
                                style={{
                                    position: 'absolute',
                                    top: 14.5,
                                    left: (width - 26) / 6,
                                }}
                            />
                        </LinearGradient>
                    </View>
                    <View
                        style={{
                            ...styles.floatingPlusCont,
                            left: width / 2 - 30,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {}}
                        >
                            <View style={styles.bigPlusButton}>
                                <Icon
                                    name="plus"
                                    type="material-community"
                                    size={38}
                                    color={colors.buttonPurple}
                                />
                            </View>
                        </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    tabBar: {
        height: 50,
        backgroundColor: 'rgba(255, 227, 255, 1)',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        borderRadius: 15,
        marginHorizontal: 13,
        position: 'absolute',
        bottom: 22,
        alignItems: 'center',
    },
    tabBarGradient: {
        flex: 1,
        borderRadius: 15,
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: '100%',
    },

    tabLabel: {
        color: 'white',
        fontSize: 10,
    },
    tabLabel2: {
        color: 'white',
        fontSize: 10,
    },

    bigPlusButton: {
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    floatingPlusCont: {
        bottom: 23,
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        // overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        elevation: 10,
    },
    floatingTouchable: {
        width: 60,
        height: 60,
        borderRadius: 30,
        bottom: 2,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'red',
    },
})

export default DashboardScreen
