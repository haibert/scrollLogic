import React, { useCallback } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated'

//custom components
import ScreenWrapper from '../../components/ScreenWrapper'
import HeaderBasic from '../../components/HeaderBasic'
import Button from '../../components/Button'
import FollowCell from '../../components/FollowCell'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

//colors
import colors from '../../constants/colors'

// big list
import BigList from 'react-native-big-list'

//fakeData
import { fakeArray as listData } from '../../data/images'

const FollowersScreen = (props) => {
    const { username } = props.route.params

    // go back
    const goBack = useCallback(() => {
        props.navigation.goBack()
    }, [])

    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------
    const animatedValue = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            right: animatedValue.value,
            backgroundColor: colors.nPButton,
            width: '50%',
            height: 5,
        }
    })
    const startAnimationRight = () => {
        animatedValue.value = withTiming(-(width - width / 2), {
            duration: 100,
        })
    }
    const startAnimationMiddle = () => {
        animatedValue.value = withTiming(-(width - width / 2 - width / 3), {
            duration: 100,
        })
    }
    const startAnimationLeft = () => {
        animatedValue.value = withTiming(0, { duration: 100 })
    }
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    const render = useCallback(({ item, index }) => {
        return <FollowCell />
    }, [])

    const layOut = useCallback(
        (data, index) => ({
            length: 60,
            offset: 60 * index,
            index,
        }),
        []
    )

    const keyExtractor = useCallback((item) => item.id, [])

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    return (
        <ScreenWrapper>
            <HeaderBasic
                header={username}
                goBack={goBack}
                headerColor={{ color: colors.darkestColorP1 }}
            />
            <View style={styles.requestsColumCont}>
                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationLeft()
                    }}
                >
                    <Text style={styles.requestsText}>Following</Text>
                </View>

                <View
                    style={styles.requestsColumButtons}
                    onTouchStart={() => {
                        startAnimationRight()
                    }}
                >
                    <Text style={styles.requestsText}>Followers</Text>
                </View>
                <View style={styles.animatingBar}>
                    <Animated.View style={animatedStyle}></Animated.View>
                </View>
            </View>
            <BigList
                data={listData}
                renderItem={render}
                keyExtractor={keyExtractor}
                itemHeight={width}
                getItemLayout={layOut}
                style={styles.bigList}
                showsVerticalScrollIndicator={true}
            />
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    bigList: {
        flex: 1,
    },
    requestsColumCont: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: colors.separatorLine,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    requestsText: {
        color: colors.darkColorP1,
        fontSize: 17,
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

export default FollowersScreen
