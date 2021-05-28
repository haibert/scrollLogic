import {
    ADD_BIRTHDAY,
    ADD_EMAIL,
    ADD_FIRSTNAME,
    ADD_LASTNAME,
    ADD_PASSWORD,
    ADD_USERNAME,
    LOGIN,
} from './actions'

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
    confirmationCode: '',
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
        case LOGIN: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    userID: action.userInfo,
                },
            }
        }
        default:
            return state
    }
}

export default signupReducer
