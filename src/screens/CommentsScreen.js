import React, { useCallback, useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
} from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated'

//custom components
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderBasic from '../components/HeaderBasic'
import CommentCell from '../components/commentsScreen/CommentCell'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

//colors
import colors from '../constants/colors'

// big list
import BigList from 'react-native-big-list'

//fakeData
import { fakeArray as listData } from '../data/images'

const CommentsScreen = (props) => {
    const isIOS = Platform.OS === 'ios'
    // go back
    const goBack = useCallback(() => {
        props.navigation.goBack()
    }, [])

    //insets
    const insets = useSafeAreaInsets()

    const [keyboardHeight, setKeyboardHeight] = useState(0)

    function onKeyboardDidShow(e) {
        setKeyboardHeight(e.endCoordinates.height)
        startHeightAnim(e.endCoordinates.height)
    }

    function onKeyboardDidHide() {
        setKeyboardHeight(0)
        startHeightAnim()
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)
        return () => {
            Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow)
            Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide)
        }
    }, [])
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------
    const animatedHeight = useSharedValue(0)
    const growingStyle = useAnimatedStyle(() => {
        return {
            height: animatedHeight.value,
        }
    })
    const startHeightAnim = (keyboardHeight) => {
        console.log(keyboardHeight - insets.bottom)
        if (animatedHeight.value !== 0) {
            animatedHeight.value = withTiming(0, {
                duration: 100,
            })
            return
        }
        animatedHeight.value = withTiming(100, {
            duration: 100,
        })
    }
    //----------------------------------------------------------------ANIMATION LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    const render = useCallback(({ item, index }) => {
        return <CommentCell />
    }, [])

    const layOut = useCallback(
        (data, index) => ({
            length: 90,
            offset: 90 * index,
            index,
        }),
        []
    )

    const keyExtractor = useCallback((item) => item.id, [])

    const inputRef = useRef()

    const onScrollBeginDrag = useCallback(() => {
        inputRef.current.blur()
        Keyboard.dismiss()
    }, [inputRef])

    //----------------------------------------------------------------FLATlIST OPTIMIZATION----------------------------------------------------------------
    return (
        <ScreenWrapper paddingBottom>
            <HeaderBasic
                header="Comments"
                goBack={goBack}
                headerColor={{ color: colors.darkestColorP1 }}
            />

            <BigList
                data={listData}
                renderItem={render}
                keyExtractor={keyExtractor}
                itemHeight={90}
                getItemLayout={layOut}
                style={styles.bigList}
                showsVerticalScrollIndicator={true}
                onScrollBeginDrag={onScrollBeginDrag}
            />
            {/* <Animated.View style={growingStyle} /> */}

            <KeyboardAvoidingView
                behavior="padding"
                enabled={isIOS ? true : false}
            >
                <View style={styles.cellOuter}>
                    <View style={styles.imageCont}></View>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            ref={inputRef}
                            maxFontSizeMultiplier={colors.maxFontSizeMultiplier}
                            style={styles.input}
                            multiline
                            blurOnSubmit={true}
                            // onBlur={() => inputRef.current.blur()}
                        />
                        <Text style={styles.postFaker}>Post</Text>
                        <Pressable
                            onPress={() => {
                                Keyboard.dismiss()
                            }}
                            style={styles.pressable}
                        >
                            <Text style={styles.post}>Post</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
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

    // input StyleSheet
    cellOuter: {
        height: 90,
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderTopColor: colors.inputBorderColor,
        borderTopWidth: 1,
    },
    imageCont: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(235,235,235,1)',
        position: 'absolute',
        left: 10,
        top: 25,
    },
    button: {
        height: 30,
        width: 70,
        position: 'absolute',
        right: 90,
    },
    inputWrapper: {
        position: 'absolute',
        top: 10,
        left: 60,
        bottom: 10,
        right: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: colors.inputBorderColor,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 0,
    },
    input: {
        fontSize: 13,
        flexWrap: 'wrap',
        flex: 1,
        marginRight: 20,
        padding: 10,
        minHeight: '100%',
    },
    postFaker: {
        color: 'transparent',
    },
    pressable: {
        position: 'absolute',
        right: 15,
    },
    post: {
        color: colors.nPButton,
    },
})

export default CommentsScreen
