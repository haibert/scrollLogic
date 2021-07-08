import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'

//components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import ActionSheetGV from '../components/ActionSheetGV'
import CachedImage from '../components/CachedImage'
import ThumbnailBig from '../components/ThumbnailBig'
import Button from '../components/Button'

//paper
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper'

//redux
// import { deletePhoto } from '../store/event/action'
import { useDispatch, useSelector } from 'react-redux'

//colors
import colors from '../constants/colors'
import { fonts } from 'react-native-elements/dist/config'

//reanimated
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useAnimatedScrollHandler,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

const ProfileScreen = (props) => {
    const personalInfo = useSelector((state) => state.signupReducer.userInfo)
    console.log(
        '🚀 ~ file: ProfileScreen.js ~ line 22 ~ ProfileScreen ~ personalInfo',
        personalInfo
    )

    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------
    const animatedValue = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            right: animatedValue.value,
            backgroundColor: colors.lightTint,
            width: '33%',
            height: 5,
        }
    })
    const startAnimationRight = () => {
        animatedValue.value = withTiming(-(width - width / 3), {
            duration: 100,
        })
    }
    const startAnimationMiddle = () => {
        animatedValue.value = withTiming(-(width - width / 3 - width / 3), {
            duration: 100,
        })
    }
    const startAnimationLeft = () => {
        animatedValue.value = withTiming(0, { duration: 100 })
    }
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------

    return (
        <ScreenWrapper>
            <HeaderBasic
                iconName="menu-outline"
                goBack={() => {
                    props.navigation.toggleDrawer()
                }}
                headerColor={{ color: colors.textColor }}
            >
                <Text style={styles.signOut}>Sign Out</Text>
            </HeaderBasic>

            <View style={styles.topCont}>
                <Avatar.Image
                    source={{
                        uri: 'http://164.90.246.1/uploads/thumb/60d266a76debc.webp',
                    }}
                    size={90}
                    style={styles.avatar}
                />
                <Text
                    style={styles.name}
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >
                    {personalInfo.firstName} {personalInfo.firstName}
                </Text>
                <Text
                    maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                >{`@${personalInfo.firstName}`}</Text>
                <Button text="Edit" style={styles.button} />
            </View>
            <View style={styles.stats}>
                <View style={styles.statCubes}>
                    <Text style={styles.numbers}>256</Text>
                    <Text>Following</Text>
                </View>
                <View style={styles.statCubes}>
                    <Text style={styles.numbers}>120</Text>
                    <Text>Followers</Text>
                </View>
                <View style={styles.statCubes}>
                    <Text style={styles.numbers}>23,6k</Text>
                    <Text>Likes Received</Text>
                </View>
            </View>
            <View style={styles.requestsColumCont}>
                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationLeft()
                    }}
                >
                    <Text style={styles.numbers}>Requests</Text>
                </View>
                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationMiddle()
                    }}
                >
                    <Text style={styles.numbers}>Invites</Text>
                </View>
                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationRight()
                    }}
                >
                    <Text style={styles.numbers}>Friends</Text>
                </View>
                <View style={styles.animatingBar}>
                    <Animated.View style={animatedStyle}></Animated.View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    topCont: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signOut: {
        color: colors.mediumTint,
        fontWeight: 'bold',
        fontSize: 18,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    avatar: {},
    name: {
        color: 'black',
        fontSize: 17,
        margin: 5,
    },
    button: {
        width: 100,
        marginTop: 5,
        height: 30,
    },
    stats: {
        height: 80,
        width: '100%',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.separatorLine,
    },
    statCubes: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: colors.separatorLine,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numbers: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    requestsColumCont: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: colors.separatorLine,
        flexDirection: 'row',
    },
    requestsColumButtons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatingBar: {
        height: 5,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
})

export default ProfileScreen
