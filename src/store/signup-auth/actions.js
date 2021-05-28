import AsyncStorage from '@react-native-async-storage/async-storage'
export const ADD_EMAIL = 'ADD_EMAIL'
export const ADD_PHONENUMBER = 'ADD_PHONENUMBER'
export const ADD_FIRSTNAME = 'ADD_ADD_FIRSTNAME'
export const ADD_LASTNAME = 'ADD_LASTNAME'
export const ADD_PASSWORD = 'ADD_ADD_PASSWORD'
export const ADD_BIRTHDAY = 'ADD_BIRTHDAY'
export const ADD_USERNAME = 'ADD_USERNAME'
export const LOGIN = 'LOGIN'

export const addEmail = (email) => {
    return {
        type: ADD_EMAIL,
        emailAdded: email,
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

        const form = JSON.stringify(
            userName,
            password,
            phone,
            email,
            firstName,
            lastName
        )

        const response = await fetch(
            'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&registeration=1',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: JSON.stringify({
                    userName,
                    password,
                    phone,
                    email,
                    firstName,
                    lastName,
                }),
            }
        )

        const responseData = await response.json()
        console.log(
            '🚀 ~ file: actions.js ~ line 74 ~ return ~ responseData',
            responseData
        )
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
                throw error
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
