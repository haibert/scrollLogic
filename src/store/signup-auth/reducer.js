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
    LOAD_FOLLOWINGS,
    EDIT_PROFILE,
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
        phone: '',
        birthday: '',
        avatarThumbPath: '',
        avatarFullPath: '',
        followersCount: '',
        followingCount: '',
    },
    searches: [],
    loadedProfile: {},
    followings: [],
    followers: [],
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
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    userID: action.newUserID,
                },
            }
        }
        case LOGIN: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    userID: action.userID,
                    firstName: action.fullInfo.basic.firstName,
                    lastName: action.fullInfo.basic.lastName,
                    username: action.fullInfo.basic.userName,
                    phone: action.fullInfo.basic.phone,
                    birthday: action.fullInfo.basic.birthDate,
                    avatarThumbPath: action.fullInfo.basic.avatarThumb,
                    avatarFullPath: action.fullInfo.basic.avatar,
                    followersCount: action.fullInfo.basic.followersCount,
                    followingCount: action.fullInfo.basic.followingCount,
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
                    avatarThumbPath: action.avatarThumbPath,
                    avatarFullPath: action.avatarFullPath,
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
        case LOAD_FOLLOWINGS: {
            return {
                ...state,
                followings: action.followings,
            }
        }
        case EDIT_PROFILE: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    firstName: action.userProfileData.firstName,
                    lastName: action.userProfileData.lastName,
                    // username: action.fullInfo.basic.userName,
                    birthday: action.userProfileData.birthDate,
                    phone: action.userProfileData.phone,
                },
            }
        }
        default:
            return state
    }
}

export default signupReducer
