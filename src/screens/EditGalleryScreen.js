import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Switch,
    FlatList,
} from 'react-native'
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    useBottomSheetTimingConfigs,
    BottomSheetFlatList,
} from '@gorhom/bottom-sheet'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay,
    interpolate,
    useDerivedValue,
} from 'react-native-reanimated'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//colors
import colors from '../constants/colors'

//custom components
import Button from '../components/Button'
import CustomHeaderBasic from '../components/HeaderBasic'
import ScreenWrapper from '../components/ScreenWrapper'
import FriendSelectionCell from '../components/EventCreation/FriendSelectionCell'
import SavedFriendsCell from '../components/EventCreation/SavedFriendsCell'
import CustomInput from '../components/CustomInput'

const { height, width } = Dimensions.get('screen')

//redux
import {
    addGallery,
    shouldRefreshSet,
    editGallery,
} from '../store/event/action'
import {
    loadFollowing,
    setShouldRefreshProfile,
} from '../store/signup-auth/actions'
import { useDispatch, useSelector } from 'react-redux'

//models
import { SelectedFriendModel } from '../models/SelectedFriendModel'
import { AllowedFriends } from '../models/AllowedFriends'

//formik
import { Formik } from 'formik'
import * as yup from 'yup'

const CustomHandleComponent = () => {
    return <View style={{ borderRadius: 20, width: '100%', height: 15 }}></View>
}

//global variables
let selectedPeople = []
let selectedPeopleIDs = []
const SEARCH_CONT_HEIGHT = 70
const BOTTOM_CONT_HEIGHT = 75

const EditGalleryScreen = ({ route, ...props }) => {
    //dispatch
    const dispatch = useDispatch()

    // insets
    const insets = useSafeAreaInsets()

    const { galName, galleryID } = route.params

    // useEffect(() => {
    //     setTimeout(() => {
    //         inputRef.current.focus()
    //     }, 500)
    //     // inputRef.current.focus()
    // }, [])

    //http request
    const [isLoading, setIsLoading] = useState(false)
    const [httpError, setHttpError] = useState()

    function hideKeyboard() {
        Keyboard.dismiss()
    }

    const userIDsAlreadyAdded = useSelector(
        (state) => state.galleryReducer.galleryInfo.allowedFriendsIDs
    )
    console.log(
        '🚀 ~ file: EditGalleryScreen.js ~ line 106 ~ EditGalleryScreen ~ userIDsAlreadyAdded',
        userIDsAlreadyAdded
    )

    const userNamesAlreadyAdded = useSelector(
        (state) => state.galleryReducer.galleryInfo.allowedFriendsUsernames
    )
    console.log(
        '🚀 ~ file: EditGalleryScreen.js ~ line 111 ~ EditGalleryScreen ~ userNamesAlreadyAdded',
        userNamesAlreadyAdded
    )

    const privacySetting = useSelector(
        (state) => state.galleryReducer.galleryInfo.privacySetting
    )

    useEffect(() => {
        for (const key in userIDsAlreadyAdded) {
            selectedPeopleIDs.push(userIDsAlreadyAdded[key])
        }
        for (const key in userNamesAlreadyAdded) {
            selectedPeople.push(
                new AllowedFriends(userNamesAlreadyAdded[key].userName)
            )
        }
    }, [])

    //------------------------------------------------------------FORMIK LOGIC------------------------------------------------------------
    const formRef = useRef()

    const inputRef = useRef()

    const validationSchema = yup.object().shape({
        eventName: yup
            .string()
            // .matches(
            //     /^[a-zA-Z]{2,40}([a-zA-Z]{2,40})+$/,
            //     'Please enter your full name.'
            // )
            .max(40, 'Gallery Name must be at 40 characters at most')
            // .min(4, 'Username Is Too Short')
            .required('Please Enter a Gallery Name.'),
    })
    const userXButton = useRef()
    const setUserXOpacity = useCallback((value) => {
        userXButton.current.setNativeProps({
            style: {
                opacity: value,
            },
        })
    }, [])
    const errorRef = useRef()
    const setErrorTextString = useCallback((value) => {
        errorRef.current.setNativeProps({ text: value.toString() })
    }, [])

    //------------------------------------------------------------FORMIK LOGIC------------------------------------------------------------

    //------------------------------------------------------------BOTTOM SHEET------------------------------------------------------------
    const sharePressedHandler = useCallback(() => {
        if (Platform.OS === 'android') {
            Keyboard.dismiss()
            setTimeout(() => {
                bottomSheetModalRef.current?.present()
            }, 40)
            return
        }
        Keyboard.dismiss()
        bottomSheetModalRef.current?.present()
    }, [])

    //------------------------------------------------------------CREATE GALLERY LOGIC ------------------------------------------------------------
    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit()
        }
    }

    const onSavePressed = useCallback(() => {
        Keyboard.dismiss()
        httpError ? setHttpError(null) : null
        handleSubmit()
    }, [])

    const [isPrivate, setIsPrivate] = useState(
        privacySetting === 'private' || 'specific_friends' ? true : false
    )

    const onSwitchChanged = (newValue) => {
        setIsPrivate(newValue)

        if (!newValue) {
            setSavedPeople([])
            selectedPeople.splice(0, selectedPeople.length)
            selectedPeopleIDs.splice(0, selectedPeopleIDs.length)
        }
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('blur', () => {
            setSavedPeople([])
            selectedPeople.splice(0, selectedPeople.length)
            selectedPeopleIDs.splice(0, selectedPeopleIDs.length)
        })

        return unsubscribe
    }, [props.navigation])

    const switchStyleIOS = {
        transform: [
            {
                scale: 0.9,
            },
        ],
    }

    const onSubmit = useCallback(
        async (values) => {
            setHttpError(null)
            setIsLoading(true)
            const noSpaceString = values.eventName.replace(/ /g, '')
            let privacy = ''
            if (isPrivate && selectedPeople.length > 0) {
                privacy = 'specific_friends'
            }
            if (isPrivate && selectedPeople.length === 0) {
                privacy = 'private'
            }
            if (!isPrivate) {
                privacy = 'public'
            }
            try {
                await dispatch(
                    editGallery(
                        galleryID,
                        values.eventName,
                        privacy,
                        'none',
                        selectedPeopleIDs,
                        selectedPeople
                    )
                )
                await dispatch(shouldRefreshSet(true))
                setIsLoading(false)
                props.navigation.goBack()
            } catch (error) {
                setHttpError(error.message)
                setIsLoading(false)
            }
        },
        [isPrivate, selectedPeopleIDs, selectedPeople]
    )
    //------------------------------------------------------------CREATE GALLERY LOGIC------------------------------------------------------------

    //------------------------------------------------------------ANIMATION------------------------------------------------------------

    const play = useSharedValue(false)
    const progress = useDerivedValue(() => {
        return play.value
            ? withTiming(1, { duration: 200 })
            : withTiming(0, { duration: 200 })
    })

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(progress.value, [0, 1], [0, 1])
        const height = interpolate(progress.value, [0, 1], [0, 70])
        const scale = interpolate(progress.value, [0, 1], [0.5, 1])

        return {
            height,
            opacity,
            transform: [
                {
                    scale,
                },
            ],
        }
    })

    const startHeightAnimation = useCallback(() => {
        play.value = true
    }, [])

    useEffect(() => {
        if (isPrivate) {
            play.value = true
        } else {
            play.value = false
        }
    }, [isPrivate])

    //------------------------------------------------------------ANIMATION------------------------------------------------------------

    //------------------------------------------------------------FLATLIST FUNCTIONS-----------------------------------------------------------

    const renderAllowedFriends = useCallback(
        ({ item }) => {
            return <SavedFriendsCell username={item.userName} />
        },
        [savedPeople]
    )

    const keyExtractor = useCallback((item) => item.userName, [savedPeople])

    //------------------------------------------------------------FLATLIST FUNCTIONS-----------------------------------------------------------

    //----------------------------------------------------------------X PRESSED----------------------------------------------------------------
    const xPressed = useCallback((setFieldValue) => {
        setFieldValue('eventName', '')
    }, [])
    //----------------------------------------------------------------X PRESSED----------------------------------------------------------------

    //NEW STUFF
    // ref
    const bottomSheetModalRef = useRef()

    //snap points
    const snapPoints = useMemo(() => ['100%', '100%'], [])

    const handleSheetChangesModal = useCallback((index) => {}, [])

    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 200,
    })

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

            console.log('moveCancelButton Ran')
        } else {
            animatedRight.value = withDelay(
                60,
                withTiming(-5, { duration: 100 })
            )

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

    //----------------------------------------------------------------SELECT DESELECT FRIENDS LOGIC----------------------------------------------------------------
    const [savedPeople, setSavedPeople] = useState(userNamesAlreadyAdded)
    console.log(
        '🚀 ~ file: CreateEventScreen.js ~ line 331 ~ CreateEventScreen ~ savedPeople',
        savedPeople
    )

    // const onSelect = (item) => {
    //     const exists = selectedPeople.includes(item.userID)

    //     if (exists) {
    //         const index = selectedPeople.indexOf(item.userID)
    //         if (index > -1) {
    //             selectedPeople.splice(index, 1)
    //         }
    //     } else {
    //         selectedPeople.push(item.userID)
    //     }
    //     console.log('🚀 ~  line 102 selectedGalleries', selectedPeople)
    // }

    const onSelect = useCallback(
        (item) => {
            console.log(
                '🚀 ~ file: EditGalleryScreen.js ~ line 471 ~ EditGalleryScreen ~ selectedPeople',
                selectedPeople
            )
            const exists = selectedPeopleIDs.includes(item.userID)
            // const exists = await selectedPeople.some((user) => {
            //     user.userID === item.userID

            // })
            if (exists) {
                selectedPeople.splice(
                    selectedPeople.findIndex(
                        (item) => item.userID !== item.userID
                    ),
                    1
                )
                // console.log(
                //     '🚀 ~ file: EditGalleryScreen.js ~ line 798 ~ EditGalleryScreen ~ selectedPeople',
                //     selectedPeople
                // )
                const index = selectedPeopleIDs.indexOf(item.userID)
                if (index > -1) {
                    selectedPeopleIDs.splice(index, 1)
                }
            } else {
                selectedPeople.push(new AllowedFriends(item.userName))
                // item.firstName,
                // item.lastName,
                // item.userID,
                selectedPeopleIDs.push(item.userID)
                // console.log(
                //     '🚀 ~ file: EditGalleryScreen.js ~ line 798 ~ EditGalleryScreen ~ selectedPeople',
                //     selectedPeople
                // )
            }
        },
        [selectedPeopleIDs, selectedPeople]
    )
    selectedPeople
    const [extraData, setExtraData] = useState(false)
    const donePressedHandler = useCallback(() => {
        setSavedPeople(selectedPeople)
        // await dispatch(passSelectedFriends(selectedPeople))
        // setSavedPeople(selectedPeople)
        setExtraData((prevState) => !prevState)
        bottomSheetModalRef.current?.dismiss()
    }, [selectedPeople])

    useEffect(() => {}, [donePressedHandler, onSelect])

    const isSelected = useCallback((item) => {
        // const exists = savedPeople.includes(item.userID)
        const exists = selectedPeopleIDs.includes(item.userID)
        // const exists = savedPeople.some((user) => user.userID === item.userID)
        if (exists) {
            return true
        } else {
            return false
        }
    }, [])

    //----------------------------------------------------------------SELECT DESELECT FRIENDS LOGIC----------------------------------------------------------------

    //----------------------------------------------------------------FLAT LIST FUNCTIONS----------------------------------------------------------------

    const renderItem2 = useCallback(
        ({ item }) => (
            <FriendSelectionCell
                key={item.userName}
                username={item.userName}
                userID={item.userID}
                avatar={item.avatarThumbPath}
                firstName={item.firstName}
                lastName={item.lastName}
                isSelected={isSelected.bind(this, item)}
                onSelect={() => {
                    onSelect(item)
                }}
            />
        ),
        []
    )

    const keyExtractor2 = useCallback((item) => item.userID, [])

    const NoFriendsContent = useCallback(() => {
        return (
            <View style={styles.noGalCont}>
                <Text maxFontSizeMultiplier={colors.maxFontSizeMultiplier}>
                    It seems like you do not have any friends yet, go follow
                    some people!
                </Text>
                <Button text="Explore" style={styles.button} />
            </View>
        )
    }, [])

    const bottomFlatlistStyle = {
        height:
            Platform.OS === 'android'
                ? null
                : height -
                  insets.top -
                  insets.bottom -
                  SEARCH_CONT_HEIGHT -
                  BOTTOM_CONT_HEIGHT,
        flex: Platform.OS === 'android' ? 1 : null,
    }

    //----------------------------------------------------------------FLAT LIST FUNCTIONS----------------------------------------------------------------
    return (
        <View style={{ flex: 1 }}>
            <ScreenWrapper>
                <CustomHeaderBasic
                    iconName="chevron-down-outline"
                    goBack={() => {
                        props.navigation.goBack()
                    }}
                    header="Edit Gallery"
                    headerColor={{ color: colors.darkestColorP1 }}
                    rightButtonWithText
                    rightButtonText="Save"
                    onRightButtonPressed={onSavePressed}
                />

                {/* <TouchableWithoutFeedback onPress={hideKeyboard}> */}
                <View style={{ flex: 1 }}>
                    <View style={styles.formikCont}>
                        <Formik
                            innerRef={formRef}
                            validationSchema={validationSchema}
                            initialValues={{
                                eventName: galName,
                            }}
                            initialTouched={{
                                eventName: false,
                            }}
                            initialErrors={{
                                eventName: undefined,
                            }}
                            onSubmit={(values) => {
                                onSubmit(values)
                            }}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                values,
                                errors,
                                setFieldValue,
                                touched,
                                resetForm,
                            }) => (
                                <View style={styles.formikInnerCont}>
                                    <View>
                                        <CustomInput
                                            viewStyle={styles.inputView}
                                            onChangeText={handleChange(
                                                'eventName'
                                            )}
                                            onBlur={handleBlur('eventName')}
                                            value={values.eventName}
                                            style={styles.input}
                                            placeholder="Event Name"
                                            placeholderTextColor={
                                                'rgba(124,124,124,1)'
                                            }
                                            selectionColor={
                                                'rgba(124,124,124,1)'
                                            }
                                            underlineColorAndroid="rgba(255,255,255,0)"
                                            maxFontSizeMultiplier={
                                                colors.maxFontSizeMultiplier
                                            }
                                            keyboardType="default"
                                            autoCapitalize="words"
                                            onFocus={() => {
                                                setUserXOpacity(1)
                                            }}
                                            onFocus={() => {
                                                setUserXOpacity(1)
                                            }}
                                            maxLength={40}
                                            onXPressed={xPressed.bind(
                                                this,
                                                setFieldValue
                                            )}
                                        />
                                    </View>
                                    <View style={styles.errorCont}>
                                        <TextInput
                                            ref={errorRef}
                                            editable={false}
                                            style={{
                                                ...styles.errorText,
                                                opacity:
                                                    (errors.eventName &&
                                                        touched.eventName) ||
                                                    httpError
                                                        ? 1
                                                        : 0,
                                            }}
                                            underlineColorAndroid="rgba(255,255,255,0)"
                                            maxFontSizeMultiplier={
                                                colors.maxFontSizeMultiplier
                                            }
                                        >
                                            {httpError
                                                ? httpError
                                                : errors.eventName}
                                        </TextInput>
                                    </View>

                                    <View style={styles.bottomCont}>
                                        <View
                                            style={{
                                                minHeight: 50,
                                                paddingVertical: 5,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text style={styles.galType}>
                                                Private Gallery
                                            </Text>
                                            <Switch
                                                value={isPrivate}
                                                onValueChange={onSwitchChanged}
                                                style={
                                                    Platform.OS === 'ios'
                                                        ? switchStyleIOS
                                                        : null
                                                }
                                            />
                                        </View>
                                        <Animated.View
                                            style={[
                                                animatedStyle,
                                                styles.hiddenView,
                                            ]}
                                        >
                                            <Button
                                                text="Share"
                                                style={styles.button}
                                                onPress={sharePressedHandler}
                                            />
                                        </Animated.View>
                                        <FlatList
                                            extraData={extraData}
                                            style={styles.flatList}
                                            data={savedPeople}
                                            renderItem={renderAllowedFriends}
                                            keyExtractor={keyExtractor}
                                            contentContainerStyle={
                                                styles.friendsContentCont
                                            }
                                            horizontal
                                            showsHorizontalScrollIndicator={
                                                false
                                            }
                                        />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
                {/* </TouchableWithoutFeedback> */}
            </ScreenWrapper>
            {isLoading && (
                <View style={[StyleSheet.absoluteFill, styles.loadingView]}>
                    <ActivityIndicator color="rgba(207,207,207,0.84)" />
                </View>
            )}
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChangesModal}
                    animationConfigs={animationConfigs}
                    // backdropComponent={backdropComponent}
                    handleComponent={CustomHandleComponent}
                    // dismissOnPanDown={true}
                    style={{
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            ...s2.searchCont,
                            marginTop: insets.top,
                        }}
                    >
                        <View style={s2.cancelButtonCont}>
                            <Animated.View style={[cancelStyle]}>
                                <TouchableOpacity onPress={expandSearchBar}>
                                    <Text
                                        style={s2.cancelButton}
                                        maxFontSizeMultiplier={
                                            colors.maxFontSizeMultiplier
                                        }
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                        <Animated.View
                            style={[s2.searchCompCont, searchContStyle]}
                        >
                            <Ionicons
                                name="search-outline"
                                size={20}
                                color={'rgba(124,124,124,1)'}
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                            />
                            <TextInput
                                maxFontSizeMultiplier={
                                    colors.maxFontSizeMultiplier
                                }
                                style={s2.input}
                                placeholder="Search"
                                placeholderTextColor={'rgba(124,124,124,1)'}
                                underlineColorAndroid="rgba(255,255,255,0)"
                                onFocus={startWidthAnim}
                                onChangeText={onChange}
                            ></TextInput>
                        </Animated.View>
                    </View>
                    <View style={bottomFlatlistStyle}>
                        <BottomSheetFlatList
                            style={s2.flatList}
                            data={friends}
                            keyExtractor={keyExtractor2}
                            renderItem={renderItem2}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={NoFriendsContent}
                        />
                    </View>
                    <View
                        style={{
                            ...s2.bottomActions,
                            height: 60 + insets.bottom,
                        }}
                    >
                        <View style={s2.bottomButtonsCont}>
                            <TouchableOpacity
                                onPress={donePressedHandler}
                                style={s2.doneButton}
                            >
                                <Text
                                    maxFontSizeMultiplier={
                                        colors.maxFontSizeMultiplier
                                    }
                                    style={s2.doneText}
                                >
                                    Done
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
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
        marginBottom: 20,
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
    bottomCont: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 80,
        width: '100%',
    },
    button: {
        width: '100%',
        height: 50,
        marginTop: 10,
    },
    formikCont: {
        width: '100%',
        paddingHorizontal: 15,
    },
    input: {
        height: 50,
        flex: 1,
        color: colors.textColor,
        fontSize: 17,
    },
    formikInnerCont: {
        alignItems: 'center',
    },

    errorCont: { width: '100%' },
    errorText: {
        marginTop: 10,
        color: colors.lightTint,
        fontSize: 15,
    },
    loadingView: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    galType: {
        fontSize: 15,
        color: colors.textColor,
    },
    hiddenView: {
        height: 0,
        width: '100%',
        overflow: 'hidden',
    },
    flatList: {
        minHeight: 60,
        width: '100%',
        marginTop: 5,
    },
    friendsContentCont: {
        alignItems: 'center',
    },
})

const s2 = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        flex: 1,
    },
    searchCont: {
        width: '100%',
        padding: 10,
        height: 70,
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

export default EditGalleryScreen
