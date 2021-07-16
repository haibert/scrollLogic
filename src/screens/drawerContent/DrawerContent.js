import React from 'react'
import { View, StyleSheet } from 'react-native'
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer'
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//colors
import colors from '../../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

const DrawerContent = (props) => {
    const insets = useSafeAreaInsets()

    const deleteUserData = async () => {
        try {
            console.log('delete')
            await AsyncStorage.removeItem('userID')
            return true
        } catch (exception) {
            console.log(exception)
            return false
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                // colors={['rgba(255, 237, 187, 1)', 'rgba(150, 227, 255, 1)']}
                // colors={['rgba(252,140,250,1)', 'rgba(255, 237, 187, 1)']}
                colors={['rgba(252,140,250,1)', colors.evenLighterTint]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    flex: 1,
                }}
            >
                <DrawerContentScrollView {...props} style={{ flex: 1 }}>
                    <View style={styles.userInfoSection}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <Avatar.Image
                                source={{
                                    uri: 'https://api.adorable.io/avatars/50/abott@adorable.png',
                                }}
                                size={60}
                            />
                            <View
                                style={{
                                    marginLeft: 15,
                                    flexDirection: 'column',
                                }}
                            >
                                <Title style={styles.title}>John Doe</Title>
                                <Caption style={styles.caption}>@j_doe</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph
                                    style={[styles.paragraph, styles.caption]}
                                >
                                    80
                                </Paragraph>
                                <Caption style={styles.caption}>
                                    Following
                                </Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph
                                    style={[styles.paragraph, styles.caption]}
                                >
                                    100
                                </Paragraph>
                                <Caption style={styles.caption}>
                                    Followers
                                </Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItemList {...props} />

                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="help-circle-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Support"
                            onPress={() => {}}
                        />
                    </Drawer.Section>
                </DrawerContentScrollView>

                <Drawer.Section style={styles.bottomDrawerSection}>
                    <DrawerItem
                        label="Sign Out"
                        icon={({ color, size }) => (
                            <Ionicons
                                name="log-out-outline"
                                color={color}
                                size={size}
                            />
                        )}
                        onPress={async () => {
                            deleteUserData()
                            props.navigation.toggleDrawer()
                            props.navigation.navigate('LoginScreen')
                        }}
                    />
                </Drawer.Section>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
    },
})

export default DrawerContent
