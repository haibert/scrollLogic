export const TAKE_PICTURE = 'TAKE_PICTURE'
export const ADD_TO_GALLERY = 'ADD_TO_GALLERY'
export const SET_CAMERA_UP = 'SET_CAMERA_UP'

export const takePicture = (uri, base64) => {
    return {
        type: TAKE_PICTURE,
        pictureUri: uri,
        pictureBase64: base64,
    }
}

export const addToGallery = (photo, galleryID) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        const body = JSON.stringify({
            userID: userID,
            galleryID,
            photo,
        })
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&file-upload=1',
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
                    '🚀 ~ file: actions.js ~ line 48 ~ return ~ data',
                    data
                )
            } catch (error) {
                throw error
            }

            dispatch({
                type: ADD_TO_GALLERY,
                picture: photo,
            })
        } catch (error) {
            throw error
        }
    }
}

export const setCameraUp = (imagePadding, ratio, previewRatio) => {
    return {
        type: SET_CAMERA_UP,
        imagePadding,
        ratio,
        previewRatio,
    }
}
