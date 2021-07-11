import {
    ADD_BIRTHDAY,
    ADD_EMAIL,
    ADD_PHONE,
    ADD_FIRSTNAME,
    ADD_LASTNAME,
    ADD_PASSWORD,
    ADD_USERNAME,
    SIGN_UP,
    LOGIN,
    SET_USER_ID,
    EMAIL_CODE,
    TEXT_CODE,
    CHANGE_AVATAR,
    SEARCH,
    LOAD_PROFILE,
    EMPTY_PROFILE,
} from './actions'

//async storage

import AsyncStorage from '@react-native-async-storage/async-storage'

const initialState = {
    signupInfo: {
        email: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        password: '',
        birthday: '',
        username: '',
    },
    confirmationEmail: '',
    confirmationText: '',
    userInfo: {
        userID: '',
        firstName: '',
        lastName: '',
        username: '',
        avatarThumb: '',
        avatar: '',
    },
    searches: [],
    loadedProfile: {},
}

const signupReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EMAIL: {
            return {
                ...state,
                signupInfo: { ...state.signupInfo, email: action.emailAdded },
            }
        }
        case ADD_PHONE: {
            return {
                ...state,
                signupInfo: {
                    ...state.signupInfo,
                    phoneNumber: action.phoneAdded,
                },
            }
        }
        case ADD_FIRSTNAME: {
            return {
                ...state,
                signupInfo: {
                    ...state.signupInfo,
                    firstName: action.nameAdded,
                },
            }
        }
        case ADD_LASTNAME: {
            return {
                ...state,
                signupInfo: {
                    ...state.signupInfo,
                    lastName: action.lastNameAdded,
                },
            }
        }
        case ADD_PASSWORD: {
            return {
                ...state,
                signupInfo: {
                    ...state.signupInfo,
                    password: action.passwordAdded,
                },
            }
        }
        case ADD_BIRTHDAY: {
            return {
                ...state,
                signupInfo: {
                    ...state.signupInfo,
                    birthday: action.birthdayAdded,
                },
            }
        }
        case ADD_USERNAME: {
            return {
                ...state,
                signupInfo: {
                    ...state.signupInfo,
                    username: action.usernameAdded,
                },
            }
        }
        case SIGN_UP: {
            console.log(
                '🚀 ~ file: reducer.js ~ line 102 ~ signupReducer ~ action.newUserID',
                action.newUserID
            )
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    userID: action.newUserID,
                },
            }
        }
        case LOGIN: {
            console.log(
                '🚀 ~ file: reducer.js ~ line 122 ~ signupReducer ~ action.userInfo',
                action.fullInfo
            )

            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    userID: action.userInfo,
                    firstName: action.fullInfo.basic.firstName,
                    lastName: action.fullInfo.basic.lastName,
                    username: action.fullInfo.basic.userName,
                },
            }
        }
        case SET_USER_ID: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    userID: action.userID,
                },
            }
        }
        case EMAIL_CODE: {
            return {
                ...state,
                confirmationEmail: action.emailCode,
            }
        }
        case TEXT_CODE: {
            return {
                ...state,
                confirmationText: action.textCode,
            }
        }
        case CHANGE_AVATAR: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    avatarThumb: action.newAvatarThumb,
                    avatar: action.newAvatar,
                },
            }
        }
        case SEARCH: {
            return {
                ...state,
                searches: action.searches,
            }
        }
        case LOAD_PROFILE: {
            return {
                ...state,
                loadedProfile: action.loadedProfile,
            }
        }
        case EMPTY_PROFILE: {
            return {
                ...state,
                loadedProfile: null,
            }
        }

        default:
            return state
    }
}

export default signupReducer
