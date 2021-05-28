export const ADD_EVENT = 'ADD_EVENT'
export const SET_GALLERIES = 'SET_GALLERIES'

export const addEvent = (eventName, eventType, thumbnail, allowedUsers) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        try {
            const body = JSON.stringify({
                userID: userID,
                eventName,
                eventType,
                thumbnail,
                allowedUsers,
            })
            console.log('🚀 ~ file: action.js ~ line 14 ~ return ~ body', body)

            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&add-gallery=1',
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
                    '🚀 ~ file: action.js ~ line 83 ~ return ~ data',
                    data
                )
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const setGalleries = () => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        try {
            const body = JSON.stringify({
                userID: userID,
            })
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&get-user-galleries=1',
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
                    '🚀 ~ file: action.js ~ line 83 ~ return ~ data',
                    data
                )
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}
