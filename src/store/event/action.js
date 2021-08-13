export const ADD_GALLERY = 'ADD_GALLERY'
export const SET_GALLERIES = 'SET_GALLERIES'
export const SET_PICS = 'SET_PICS'
export const DELETE_GALLERY = 'DELETE_GALLERY'
export const SHOULD_REFRESH = 'SHOULD_REFRESH'
export const DELETE_PHOTO = 'DELETE_PHOTO'
export const EMPTY_PICS_ARRAY = 'EMPTY_PICS_ARRAY'
export const SET_INITIAL_GALLERIES = 'SET_INITIAL_GALLERIES'
export const SET_OTHER_GALLERIES = 'SET_OTHER_GALLERIES'
export const EMPTY_OTHER_GALLERIES = 'EMPTY_OTHER_GALLERIES'
export const SET_INITIAL_OTHER_GALLERIES = 'SET_INITIAL_OTHER_GALLERIES'
export const SET_GALLERY_INFO = 'SET_GALLERY_INFO'
export const EDIT_GALLERY = 'EDIT_GALLERY'

//models
import { Gallery } from '../../models/GalleryModel'
import { Pic } from '../../models/PicModel'
import { AllowedFriends } from '../../models/AllowedFriends'

//navigation
// import { CommonActions } from '@react-navigation/native'

import { LINK } from '../../utilities/apiLink'

export const addGallery = (eventName, eventType, thumbnail, allowedUsers) => {
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
            console.log('🚀 ~ file: action.js ~ line 34 ~ return ~ body', body)

            const response = await fetch(`${LINK}&add-gallery=1`, {
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

                const createdGalleryID = data.message.galleryID

                dispatch({
                    type: ADD_GALLERY,
                    newGalleryID: createdGalleryID,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const setGalleries = (userID, load, page, initialLoad = false) => {
    return async (dispatch, getState) => {
        console.log('load more galleries ran')
        const userIDPassed =
            userID === null ? getState().signupReducer.userInfo.userID : userID
        try {
            const body = JSON.stringify({
                userID: userIDPassed,
                load,
                page,
            })
            console.log('🚀 ~ file: action.js ~ line 74 ~ return ~ body', body)
            const response = await fetch(`${LINK}&get-user-galleries=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
                cache: 'no-cache',
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const galleries = data.message.galleries

                const loadedGalleries = []

                for (const key in galleries) {
                    loadedGalleries.push(
                        new Gallery(
                            galleries[key].galleryID,
                            galleries[key].eventName,
                            galleries[key].thumbnail,
                            galleries[key].eventDate
                        )
                    )
                }

                if (initialLoad) {
                    dispatch({
                        type: SET_INITIAL_GALLERIES,
                        galleries: loadedGalleries,
                    })
                    return
                }

                dispatch({
                    type: SET_GALLERIES,
                    galleries: loadedGalleries,
                })
            } catch (error) {
                console.log(error)
                throw new Error('Something went wrong!')
            }
        } catch (error) {
            console.log(error)
            throw new Error('Something went wrong!')
        }
    }
}

export const setProfileGalleries = (userID, profileID, load, page) => {
    return async (dispatch, getState) => {
        console.log('load more galleries ran')
        const userIDPassed =
            userID === null ? getState().signupReducer.userInfo.userID : userID
        try {
            const body = JSON.stringify({
                userID: userIDPassed,
                profileID,
                load,
                page,
            })
            console.log('🚀 ~ file: action.js ~ line 138 ~ return ~ body', body)
            const response = await fetch(`${LINK}&get-profile-galleries=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
                cache: 'no-cache',
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const galleries = data.message.galleries
                console.log(
                    '🚀 ~ file: action.js ~ line 164 ~ return ~ galleries',
                    galleries
                )
                const loadedGalleries = []
                for (const key in galleries) {
                    loadedGalleries.push(
                        new Gallery(
                            galleries[key].galleryID,
                            galleries[key].eventName,
                            galleries[key].thumbnail,
                            galleries[key].eventDate
                        )
                    )
                }
                // if (userID !== null) {
                dispatch({
                    type: SET_OTHER_GALLERIES,
                    otherGalleries: loadedGalleries,
                })
                // } else {
                //     dispatch({
                //         type: SET_GALLERIES,
                //         galleries: loadedGalleries,
                //     })
                // }
            } catch (error) {
                console.log(error)
                throw new Error('Something went wrong!')
            }
        } catch (error) {
            console.log(error)
            throw new Error('Something went wrong!')
        }
    }
}

export const emptyOtherProfileGalleries = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: EMPTY_OTHER_GALLERIES,
                otherGalleries: [],
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export const setPics = (userID, galleryID) => {
    return async (dispatch, getState) => {
        const userPassed =
            userID === null ? getState().signupReducer.userInfo.userID : userID
        try {
            const body = JSON.stringify({
                userID: userPassed,
                galleryID,
            })
            console.log('🚀 ~ file: action.js ~ line 296 ~ return ~ body', body)
            const response = await fetch(`${LINK}&get-gallery-files=1`, {
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
                const pics = data.message.images
                // console.log(
                //     '🚀 ~ file: action.js ~ line 142 ~ return ~ pics',
                //     pics
                // )

                const loadedPics = []
                for (const key in pics) {
                    loadedPics.push(
                        new Pic(
                            pics[key].galleryID,
                            pics[key].fullPath,
                            pics[key].id,
                            pics[key].thumbPath,
                            pics[key].ownerIsMe
                        )
                    )
                }

                dispatch({
                    type: SET_PICS,
                    pics: loadedPics,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const deleteGallery = (galleryID) => {
    return async (dispatch, getState) => {
        try {
            const body = JSON.stringify({
                id: galleryID.id,
            })
            console.log('🚀 ~ file: action.js ~ line 192 ~ return ~ body', body)
            const response = await fetch(`${LINK}&delete-gallery=1`, {
                method: 'DELETE',
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
                const data = await JSON.stringify(response)
                console.log(
                    '🚀 ~ file: action.js ~ line 210 ~ return ~ data',
                    data
                )

                // const data = await response.json()
                // const response = data.message.response
                // if (response === 'success') {
                dispatch({
                    type: DELETE_GALLERY,
                    deletedGallery: galleryID.id,
                })
                // } else {
                //     throw new Error('Something went wrong!')
                // }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const deletePhoto = (photoID) => {
    return async (dispatch, getState) => {
        try {
            const body = JSON.stringify({
                id: photoID,
            })
            const response = await fetch(`${LINK}&delete-image=1`, {
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
                const data = await JSON.stringify(response)

                dispatch({
                    type: DELETE_PHOTO,
                    deletedPhoto: photoID,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const getGalleryInfo = (galleryID) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userID,
            galleryID,
        })
        try {
            const response = await fetch(`${LINK}&get-gallery-info=1`, {
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

                const error = data.message.gallery === ''

                if (error) {
                    throw new Error('Something went wrong!')
                }

                const allowedFriends = data.message?.gallery?.allow_users
                let loadedFriendsIDs = []
                let loadedFriendsUsernames = []

                if (allowedFriends) {
                    for (const key in allowedFriends) {
                        loadedFriendsIDs.push(allowedFriends[key].userID)
                    }
                    for (const key in allowedFriends) {
                        loadedFriendsUsernames.push(
                            new AllowedFriends(allowedFriends[key].userName)
                        )
                    }
                }

                dispatch({
                    type: SET_GALLERY_INFO,
                    allowedFriendsIDs: loadedFriendsIDs,
                    allowedFriendsUsernames: loadedFriendsUsernames,
                    privacySetting: data.message.gallery.eventType,
                    eventName: data.message.gallery.eventName,
                    eventType: data.message.gallery.eventType,
                    thumbnail: data.message.gallery.thumbnail,
                })
            } catch (error) {
                throw new Error('Something went wrong!')
            }
        } catch (error) {
            throw error
        }
    }
}

export const editGallery = (
    galleryID,
    eventName,
    eventType,
    thumbnail,
    allowedUserIDs,
    allowedFriendsUsernames
) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        const numberOfGalleries = getState().galleryReducer.galleries.length
        const body = JSON.stringify({
            galleryID,
            userID,
            eventName,
            eventType,
            thumbnail,
            allowedUsers: allowedUserIDs,
        })
        try {
            const response = await fetch(`${LINK}&edit-gallery=1`, {
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

                const success = data.message.response === 'Successfully updated'

                if (!success) {
                    throw new Error('Something went wrong!')
                }

                dispatch(getGalleryInfo(galleryID))
                dispatch({
                    type: EDIT_GALLERY,
                    galleryID,
                    eventName,
                    eventType,
                    thumbnail,
                })
            } catch (error) {
                console.log(
                    '🚀 ~ file: action.js ~ line 556 ~ return ~ error',
                    error
                )
                throw new Error('Something went wrong!')
            }
        } catch (error) {
            throw error
        }
    }
}

export const shouldRefreshSet = (boolean) => {
    return async (dispatch, getState) => {
        console.log('setting should refresh ', boolean)
        try {
            dispatch({
                type: SHOULD_REFRESH,
                shouldRefresh: boolean,
            })
        } catch (error) {
            throw error
        }
    }
}

export const emptyPicsArray = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: EMPTY_PICS_ARRAY,
            })
        } catch (error) {
            throw error
        }
    }
}
