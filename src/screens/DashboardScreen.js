import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Modal,
    FlatList,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../constants/colors'

// custom components
import Button from '../components/Button'
import Thumbnail from '../components/Thumbnail'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//redux
import { useDispatch, useSelector } from 'react-redux'

//expo camera
import { Camera } from 'expo-camera'

//dummy data
import images from '../data/images'

const { height, width } = Dimensions.get('screen')

const DashboardScreen = (props) => {
    const insets = useSafeAreaInsets()
    console.log('🚀 ~ file: DashboardScreen.js ~ line 38 ~ images', images)

    const [hasPermission, setHasPermission] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)

    const [showModal, setShowModal] = useState(false)

    const cameraPressedHandler = async () => {
        const { status } = await Camera.requestPermissionsAsync()

        setHasPermission(status === 'granted')
        if (status === 'granted') {
            props.navigation.navigate('CameraScreen')
        } else {
            return
        }
    }

    function galleryPressedHandler() {}
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

                        {/* <TouchableOpacity
                            onPress={() => {
                                props.navigation.toggleDrawer()
                            }}
                        >
                            <Ionicons
                                name="person"
                                size={26}
                                color={colors.buttonPurple}
                            />
                        </TouchableOpacity> */}
                    </View>
                    <FlatList
                        style={styles.flatList}
                        data={images}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={(item) => {
                            return (
                                <View>
                                    <View style={{ height: 10 }}></View>
                                    <Thumbnail
                                        images={item.item}
                                        galleryPressedHandler={
                                            galleryPressedHandler
                                        }
                                    />
                                </View>
                            )
                        }}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        columnWrapperStyle={{ marginLeft: 10 }}
                        // contentStyle={{ paddingBottom: 50 }}
                    />
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
                                    // props.navigation.navigate('CameraScreen')
                                }}
                            >
                                <View style={styles.tabButton}></View>
                            </TouchableWithoutFeedback>

                            <View style={{ width: 50 }}></View>
                            <TouchableWithoutFeedback
                                onPress={cameraPressedHandler}
                            >
                                <View style={styles.tabButton}></View>
                            </TouchableWithoutFeedback>

                            <Ionicons
                                name="camera"
                                color="white"
                                size={22}
                                style={{
                                    position: 'absolute',
                                    top: 14.5,
                                    right: (width - 26) / 6,
                                }}
                                onPress={cameraPressedHandler}
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
                            onPress={() => {
                                setShowModal(true)
                            }}
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
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modal}>
                    <View>
                        <View style={styles.modalActions}>
                            <Button
                                text="Join Event"
                                style={styles.innerButton}
                                onPress={() => {
                                    setShowModal(false)
                                    props.navigation.navigate('JoinEventScreen')
                                }}
                            ></Button>
                            <Button
                                text="Create Event"
                                onPress={() => {
                                    setShowModal(false)
                                    props.navigation.navigate(
                                        'CreateEventScreen'
                                    )
                                }}
                            ></Button>
                        </View>
                        <Button
                            style={styles.cancelButton}
                            onPress={() => {
                                setShowModal(false)
                            }}
                            text="Cancel"
                        ></Button>
                    </View>
                </View>
            </Modal>
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
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatList: {
        flex: 1,
    },
    modalActions: {
        width: '80%',
        height: 200,
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 30,
    },
    innerButton: {
        marginBottom: 20,
    },
    cancelButton: {
        marginTop: 30,
        width: `80%`,
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
