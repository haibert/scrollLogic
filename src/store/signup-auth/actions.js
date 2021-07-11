import AsyncStorage from '@react-native-async-storage/async-storage'
export const ADD_EMAIL = 'ADD_EMAIL'
export const ADD_PHONE = 'ADD_PHONE'
export const ADD_FIRSTNAME = 'ADD_ADD_FIRSTNAME'
export const ADD_LASTNAME = 'ADD_LASTNAME'
export const ADD_PASSWORD = 'ADD_ADD_PASSWORD'
export const ADD_BIRTHDAY = 'ADD_BIRTHDAY'
export const ADD_USERNAME = 'ADD_USERNAME'
export const SIGN_UP = 'SIGN_UP'
export const LOGIN = 'LOGIN'
export const SET_USER_ID = 'SET_USER_ID'
export const EMAIL_CODE = 'EMAIL_CODE'
export const TEXT_CODE = 'TEXT_CODE'
export const CHANGE_AVATAR = 'CHANGE_AVATAR'
export const SEARCH = 'SEARCH'
export const LOAD_PROFILE = 'LOAD_PROFILE '
export const FOLLOW = 'FOLLOW'
export const UNFOLLOW = 'UNFOLLOW'
export const EMPTY_PROFILE = 'EMPTY_PROFILE'
import { Search } from '../../models/SearchModel'

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
                : ''
        const email =
            getState().signupReducer.signupInfo.email.length > 2
                ? getState().signupReducer.signupInfo.email
                : ''
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
                '🚀 ~ file: actions.js ~ line 103 ~ return ~ responseData',
                responseData
            )

            const cantRegister =
                responseData.message?.user?.registeration?.error

            if (cantRegister) {
                throw new Error('Something went wrong!')
            }

            const newUserID = responseData.message?.userData?.uniqID
            console.log(
                '🚀 ~ file: actions.js ~ line 116 ~ return ~ newUserID',
                newUserID
            )
            await storeData(newUserID)

            dispatch({
                type: SIGN_UP,
                newUserID: newUserID,
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

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 160 ~ return ~ data',
                    data
                )

                const userID = data.message?.userData?.basic?.uniqueID
                const userInfo = data.message?.userData
                const credentials = data.message?.userData?.body
                console.log(
                    '🚀 ~ file: actions.js ~ line 163 ~ return ~ credentials',
                    credentials
                )
                // await storeData(userID)
                await storeCredentials(
                    credentials.userName,
                    credentials.password,
                    userID
                )
                dispatch({
                    type: LOGIN,
                    userInfo: userID,
                    fullInfo: userInfo,
                })

                const error = data?.message?.user?.authCheck
                if (error === 'ERROR') {
                    throw new Error('Incorrect Credentials')
                }
            } catch (error) {
                throw error
            }
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
                console.log(
                    '🚀 ~ file: actions.js ~ line 210 ~ return ~ data',
                    data
                )
                code = data?.message?.code

                const errorCode = data.message?.error
                if (errorCode) {
                    throw new Error('The entered email address is not valid.')
                }
            } catch (error) {
                throw error
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

export const checkUserExistence = (userName) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            userName,
        })
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&check-userName=1',
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
                const userExists = data.message?.userNameCheck?.error
                if (userExists) {
                    throw new Error('This username is unavailable.')
                }
            } catch (error) {
                throw error
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

export const checkEmailExistence = (email) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            email,
        })
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&check-email=1',
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
                const emailExists = data.message?.emailCheck?.error
                if (emailExists) {
                    throw new Error('This email is unavailable.')
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const changeAvatar = (avatar) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userID,
            avatar,
        })
        console.log('🚀 ~ file: actions.js ~ line 407 ~ return ~ body', body)
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&change-avatar=1',
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
                    '🚀 ~ file: actions.js ~ line 428 ~ return ~ data',
                    data
                )

                const newAvatarThumb = data?.message?.avatarThumb
                const newAvatar = data?.message?.fullPath

                dispatch({
                    type: CHANGE_AVATAR,
                    newAvatarThumb,
                    newAvatar,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const search = (text) => {
    return async (dispatch, getState) => {
        // const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userName: text,
        })
        console.log('🚀 ~ file: actions.js ~ line 461 ~ return ~ body', body)
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&search-profile=1',
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
                const searches = data.message.data
                console.log(
                    '🚀 ~ file: actions.js ~ line 483 ~ return ~ searches',
                    searches
                )
                const loadedSearches = []
                for (const key in searches) {
                    loadedSearches.push(
                        new Search(
                            searches[key].uniqueID,
                            searches[key].userName,
                            searches[key].firstName,
                            searches[key].lastName,
                            searches[key].avatar
                        )
                    )
                }
                console.log(
                    '🚀 ~ file: actions.js ~ line 485 ~ return ~ loadedSearches',
                    loadedSearches
                )

                dispatch({
                    type: SEARCH,
                    searches: loadedSearches,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const loadProfile = (userID) => {
    return async (dispatch, getState) => {
        // const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userID,
        })
        console.log('🚀 ~ file: actions.js ~ line 461 ~ return ~ body', body)
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&get-user=1',
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
                const loadedProfile = data.message.data
                console.log(
                    '🚀 ~ file: actions.js ~ line 549 ~ return ~ loadedProfile',
                    loadedProfile
                )

                dispatch({
                    type: LOAD_PROFILE,
                    loadedProfile: loadedProfile,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const emptyProfile = () => {
    console.log('emptyProfile RAN')
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: EMPTY_PROFILE,
                loadedProfile: null,
            })
        } catch (error) {
            throw error
        }
    }
}

export const followUnfollow = (followID, followType) => {
    console.log(
        '🚀 ~ file: actions.js ~ line 570 ~ followUnfollow ~ followID',
        followID
    )
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        console.log(
            '🚀 ~ file: actions.js ~ line 572 ~ return ~ userID',
            userID
        )

        let link =
            'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&follow-user=1'

        if (followType === 'unFollow') {
            link =
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&unfollow-user=1'
        }

        const body = JSON.stringify({
            userID: followID,
            followerID: userID,
        })
        console.log('🚀 ~ file: actions.js ~ line 585 ~ return ~ body', body)

        try {
            const response = await fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 604 ~ return ~ data',
                    data
                )
                const results = data.message.response

                if (results === 'success') {
                    dispatch({
                        type: UNFOLLOW,
                        // loadedProfile: loadedProfile,
                    })
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}
// helpers
const storeData = async (value) => {
    try {
        await AsyncStorage.removeItem('userID')
        await AsyncStorage.setItem('userID', value)
    } catch (e) {
        console.log(e)
        // throw error
    }
}

const storeCredentials = async (username, password, userID) => {
    try {
        await AsyncStorage.setItem('username', username)
        await AsyncStorage.setItem('password', password)
        await AsyncStorage.setItem('userID', userID)
    } catch (e) {
        console.log(e)
        // throw error
    }
}
