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
    },
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
                    userID: action.userInfo,
                },
            }
        }
        case LOGIN: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    userID: action.userInfo,
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
        default:
            return state
    }
}

export default signupReducer
