import AsyncStorage from '@react-native-async-storage/async-storage'
export const ADD_EMAIL = 'ADD_EMAIL'
export const ADD_PHONE = 'ADD_PHONE'
export const ADD_FIRSTNAME = 'ADD_ADD_FIRSTNAME'
export const ADD_LASTNAME = 'ADD_LASTNAME'
export const ADD_PASSWORD = 'ADD_ADD_PASSWORD'
export const ADD_BIRTHDAY = 'ADD_BIRTHDAY'
export const ADD_USERNAME = 'ADD_USERNAME'
export const SIGN_UP = 'ADD_USERNAME'
export const LOGIN = 'LOGIN'
export const SET_USER_ID = 'SET_USER_ID'
export const EMAIL_CODE = 'EMAIL_CODE'
export const TEXT_CODE = 'TEXT_CODE'

const LINK = 'http://144.126.212.5/api.php?key=!thisIsARandomString1981111212&'

export const addEmail = (email) => {
    return {
        type: ADD_EMAIL,
        emailAdded: email,
    }
}

export const addPhone = (phone) => {
    return {
        type: ADD_PHONE,
        phoneAdded: phone,
    }
}

export const addFirstName = (name) => {
    return {
        type: ADD_FIRSTNAME,
        nameAdded: name,
    }
}

export const addLastName = (lastName) => {
    return {
        type: ADD_LASTNAME,
        lastNameAdded: lastName,
    }
}

export const addPassword = (password) => {
    return {
        type: ADD_PASSWORD,
        passwordAdded: password,
    }
}

export const addBirthday = (birthday) => {
    return {
        type: ADD_BIRTHDAY,
        birthdayAdded: birthday,
    }
}

export const addUsername = (username) => {
    return {
        type: ADD_USERNAME,
        usernameAdded: username,
    }
}

export const signupUser = () => {
    return async (dispatch, getState) => {
        const userName = getState().signupReducer.signupInfo.username
        const password = getState().signupReducer.signupInfo.password
        const phone =
            getState().signupReducer.signupInfo.phoneNumber.length > 2
                ? getState().signupReducer.signupInfo.phoneNumber
                : 'none entered'
        const email =
            getState().signupReducer.signupInfo.email.length > 2
                ? getState().signupReducer.signupInfo.email
                : 'none entered'
        const firstName = getState().signupReducer.signupInfo.firstName
        const lastName = getState().signupReducer.signupInfo.lastName

        const body = JSON.stringify({
            userName,
            password,
            phone,
            email,
            firstName,
            lastName,
        })
        console.log('🚀 ~ file: actions.js ~ line 82 ~ return ~ body', body)
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&registeration=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        key: 'ThisIsASecretKey',
                    },
                    body: body,
                }
            )
            const responseData = await response.json()
            console.log(
                '🚀 ~ file: actions.js ~ line 94 ~ return ~ responseData',
                responseData
            )
            const newUserID = responseData.message.userData.uniqID

            dispatch({
                type: SIGN_UP,
                userInfo: newUserID,
            })
        } catch {
            throw error
        }
    }
}

export const login = (username, password) => {
    return async (dispatch, getState) => {
        let userID
        const body = JSON.stringify({
            userName: username,
            password,
        })
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&auth=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        key: 'ThisIsASecretKey',
                    },
                    body: body,
                }
            )

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            const storeData = async (value) => {
                try {
                    await AsyncStorage.setItem('userID', value)
                } catch (e) {
                    // throw error
                }
            }

            try {
                const data = await response.json()
                userID = data.message.userData.basic.uniqueID
                storeData(userID)

                const error = data.message.user.authCheck
                if (error === 'ERROR') {
                    throw new Error('Incorrect Credentials')
                }
            } catch (error) {
                throw new Error('Incorrect Credentials')
            }

            dispatch({
                type: LOGIN,
                userInfo: userID,
            })
        } catch (error) {
            throw error
        }
    }
}

export const setUserID = (userID) => {
    return {
        type: SET_USER_ID,
        userID: userID,
    }
}

export const sendEmailCode = (email) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            email,
        })
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&validationEmail=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        key: 'ThisIsASecretKey',
                    },
                    body: body,
                }
            )

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                code = data.message.code
                console.log(
                    '🚀 ~ file: actions.js ~ line 197 ~ return ~ code',
                    code
                )
                const errorCode = data.message.error
                if (errorCode) {
                    throw new Error('The entered email address is not valid.')
                }
            } catch (error) {
                throw new Error('Something went wrong!')
            }

            dispatch({
                type: EMAIL_CODE,
                emailCode: code,
            })
        } catch (error) {
            throw error
        }
    }
}

export const sendTextCode = (phone) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            phone,
        })
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&validationSMS=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        key: 'ThisIsASecretKey',
                    },
                    body: body,
                }
            )

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 245 ~ return ~ data',
                    data
                )
                code = data.message.code
                console.log(
                    '🚀 ~ file: actions.js ~ line 197 ~ return ~ code',
                    code
                )
                const errorCode = data.message.error
                if (errorCode) {
                    throw new Error('The entered phone number is not valid.')
                }
            } catch (error) {
                throw new Error('Something went wrong!')
            }

            dispatch({
                type: TEXT_CODE,
                textCode: code,
            })
        } catch (error) {
            throw error
        }
    }
}
