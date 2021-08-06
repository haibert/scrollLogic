import React, { useCallback, useRef, useMemo, useEffect, useState } from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    Dimensions,
    Keyboard,
    Platform,
} from 'react-native'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'

import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated'

import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'

//custom CameraComponents
import FriendSelectionCell from '../../components/EventCreation/FriendSelectionCell'
import Button from '../../components/Button'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//colors
import colors from '../../constants/colors'

//dimensions
const { width, height } = Dimensions.get('window')

//redux
import {
    loadFollowing,
    passSelectedFriends,
    setShouldRefreshProfile,
} from '../../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

const ModalContent = (props) => {
    //dispatch
    const dispatch = useDispatch()

    isAndroid
    const isAndroid = useMemo(() => {
        if (Platform.OS === 'android') {
            return true
        } else {
            return false
        }
    }, [])

    //----------------------------------------------------------------CANCEL BUTTON ANIMATION----------------------------------------------------------------
    const animatedWidth = useSharedValue(width - 20)

    const searchContStyle = useAnimatedStyle(() => {
        return {
            width: animatedWidth.value,
        }
    })

    const startWidthAnim = useCallback(() => {
        if (animatedWidth.value === width - 20) {
            console.log(animatedWidth.value)
            console.log('colaps')
            moveCancelButton()
            const newWidth = width - 80
            animatedWidth.value = withDelay(
                50,
                withTiming(newWidth, { duration: 100 })
            )
        }
    }, [])

    const expandSearchBar = useCallback(() => {
        if (animatedWidth.value !== width - 20) {
            Keyboard.dismiss()
            moveCancelButton()
            animatedWidth.value = withTiming(width - 20, { duration: 100 })
        }
    }, [])

    const animatedRight = useSharedValue(-70)

    const cancelStyle = useAnimatedStyle(() => {
        return {
            right: animatedRight.value,
        }
    })

    const moveCancelButton = useCallback(() => {
        if (animatedWidth.value !== width - 20) {
            animatedRight.value = withTiming(-70, { duration: 100 })
            isAndroid ? startOpacityAnim() : null
            console.log('moveCancelButton Ran')
        } else {
            animatedRight.value = withDelay(
                60,
                withTiming(-5, { duration: 100 })
            )
            isAndroid ? startOpacityAnim() : null
            console.log('moveCancelButton Ran')
        }
    }, [isAndroid])
    //----------------------------------------------------------------CANCEL BUTTON ANIMATION----------------------------------------------------------------

    //----------------------------------------------------------------SEARCH HTTP CALL--------------------------------------------------------
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        if (searchTerm.length === 0) return
        const delayDebounceFn = setTimeout(async () => {
            showLoader()
            await dispatch(search(searchTerm))
            hideLoader()
        }, 200)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const onChange = useCallback((text) => {
        console.log(text)
        if (text.length !== 0) {
            setSearchTerm(text)
        }
    }, [])

    //----------------------------------------------------------------SEARCH HTTP CALL--------------------------------------------------------

    //----------------------------------------------------------------LOAD FOLLOWING----------------------------------------------------------------
    const friends = useSelector((state) => state.signupReducer.following)
    console.log(
        '🚀 ~ file: ModalContent.js ~ line 155 ~ ModalContent ~ friends',
        friends
    )

    const loadFriends = useCallback(async () => {
        try {
            // showLoader()
            await dispatch(loadFollowing())
        } catch (err) {
            console.log(err)
        }
        // setTimeout(hideLoader, 100)
    }, [])

    useEffect(() => {
        loadFriends()
    }, [loadFriends])
    //----------------------------------------------------------------LOAD FOLLOWING----------------------------------------------------------------

    const selectedPeople = []

    const onSelect = (item) => {
        const exists = selectedPeople.includes(item.userID)

        if (exists) {
            const index = selectedPeople.indexOf(item.userID)
            if (index > -1) {
                selectedPeople.splice(index, 1)
            }
        } else {
            selectedPeople.push(item.userID)
        }
        console.log('🚀 ~  line 102 selectedGalleries', selectedPeople)
    }

    //----------------------------------------------------------------FLAT LIST DATA----------------------------------------------------------------
    // const isSelected = useCallback(
    //     (item) => {
    //         const exists = selectedFriends.includes(item.userID)
    //         if (exists) {
    //             return true
    //         } else {
    //             return false
    //         }
    //     },
    //     [selectedFriends]
    // )

    const renderItem = useCallback(
        ({ item }) => (
            <FriendSelectionCell
                key={item.userID}
                username={item.userName}
                userID={item.userID}
                avatar={item.avatarThumbPath}
                firstName={item.firstName}
                lastName={item.lastName}
                // isSelected={isSelected.bind(this, item)}
                onSelect={onSelect.bind(this, item)}
            />
        ),
        []
    )

    const keyExtractor = useCallback((item) => item.userID, [])

    const NoGalleriesContent = useCallback(() => {
        return (
            <View style={styles.noGalCont}>
                <Text maxFontSizeMultiplier={colors.maxFontSizeMultiplier}>
                    It seems like you have not created any galleries yet.
                </Text>
                <Button text="Create Gallery" style={styles.button} />
            </View>
        )
    }, [])

    //----------------------------------------------------------------FLAT LIST DATA----------------------------------------------------------------

    return <View></View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        flex: 1,
    },
    searchCont: {
        width: '100%',
        padding: 10,
    },
    searchCompCont: {
        backgroundColor: 'rgba(233,233,233,1)',
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        minHeight: 50,
        height: 50,
        padding: 5,
        backgroundColor: 'rgba(233,233,233,1)',
    },
    cancelButtonCont: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    cancelButton: {
        color: colors.darkColorP1,
        fontSize: 15,
    },
    shadowView: {
        flex: 1,
        shadowColor: 'black',
        shadowRadius: 7,
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        borderRadius: 20,
        elevation: 5,
        marginHorizontal: 10,
        backgroundColor: 'white',
    },
    bottomActions: {
        minWidth: '100%',
        backgroundColor: colors.lightTint,
        // position: 'absolute',
        // bottom: 0,
        // right: 0,
        // left: 0,
    },
    bottomButtonsCont: {
        minWidth: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        padding: 10,
    },

    circle: {
        height: 40,
        width: 60,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noGalCont: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
    },
    doneText: {
        fontSize: 16,
    },
})

export default ModalContent
