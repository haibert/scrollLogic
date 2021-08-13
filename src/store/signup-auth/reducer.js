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
    PRIVACY_UPDATE,
    LOAD_REQUESTS,
    FOLLOW_RESPONSE,
    SHOULD_REFRESH_PROFILE,
    UPDATE_USER_STATS,
    REMOVE_FRIEND,
    LOAD_FOLLOWING,
    SET_GALLERY_INFO
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
    settings: {
        privacy: '',
    },
    searches: [],
    loadedProfile: {},
    followings: [],
    following: [],
    followers: [],
    friendRequests: [],
    shouldRefreshProfile: false,
    selectedFriendsForSharing: [],
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
                settings: {
                    privacy: action.fullInfo.basic.accountPrivacy,
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
        case LOAD_FOLLOWING: {
            return {
                ...state,
                following: action.following,
            }
        }

        case EDIT_PROFILE: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    firstName: action.userProfileData.firstName,
                    lastName: action.userProfileData.lastName,
                    birthday: action.userProfileData.birthDate,
                    phone: action.userProfileData.phone,
                    username: action.username,
                },
            }
        }
        case PRIVACY_UPDATE: {
            action.privacy
            console.log(
                '🚀 ~ file: reducer.js ~ line 700 ~ signupReducer ~ action.privacy',
                action.privacy
            )

            return {
                ...state,
                settings: {
                    privacy: action.privacy,
                },
            }
        }
        case LOAD_REQUESTS: {
            return {
                ...state,
                friendRequests: action.friendRequests,
            }
        }
        case FOLLOW_RESPONSE: {
            const filteredArray = state.friendRequests.filter(function (obj) {
                return obj.id !== action.requestID
            })
            return {
                ...state,
                friendRequests: filteredArray,
            }
        }
        case REMOVE_FRIEND: {
            const filteredArray = state.followings.filter(function (obj) {
                return obj.userID !== action.userID
            })
            console.log(
                '🚀 ~ file: reducer.js ~ line 260 ~ filteredArray ~ filteredArray',
                filteredArray
            )
            return {
                ...state,
                followings: filteredArray,
            }
        }
        case SHOULD_REFRESH_PROFILE: {
            return {
                ...state,
                shouldRefreshProfile: action.shouldRefreshProfile,
            }
        }
        case UPDATE_USER_STATS: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    followersCount: action.updatedStats.followersCount,
                    followingCount: action.updatedStats.followingCount,
                },
            }
        }
        default:
            return state
    }
}

export default signupReducer
