import {
    ADD_GALLERY,
    SET_GALLERIES,
    SET_PICS,
    DELETE_GALLERY,
    SHOULD_REFRESH,
    DELETE_PHOTO,
    EMPTY_PICS_ARRAY,
    SET_INITIAL_GALLERIES,
    SET_OTHER_GALLERIES,
    SET_INITIAL_OTHER_GALLERIES,
    EMPTY_OTHER_GALLERIES,
    SET_GALLERY_INFO,
    EDIT_GALLERY,
} from './action'

const initialState = {
    events: [],
    galleries: [],
    otherGalleries: [],
    pics: [],
    galleryTitles: [],
    newGalleryID: '',
    shouldRefresh: false,
    galleryInfo: {
        allowedFriendsIDs: [],
        allowedFriendsUsernames: [],
        privacySetting: '',
        eventName: '',
        eventType: '',
        thumbnail: '',
    },
}

const galleryReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_GALLERY: {
            return {
                ...state,
                newGalleryID: action.newGalleryID,
            }
        }
        case SET_GALLERIES: {
            return {
                ...state,
                galleries: [...state.galleries, ...action.galleries],
            }
        }
        case SET_INITIAL_GALLERIES: {
            return {
                ...state,
                galleries: action.galleries,
            }
        }
        case SET_INITIAL_OTHER_GALLERIES: {
            return {
                ...state,
                otherGalleries: action.otherGalleries,
            }
        }
        case SET_OTHER_GALLERIES: {
            return {
                ...state,
                otherGalleries: [
                    ...state.otherGalleries,
                    ...action.otherGalleries,
                ],
            }
        }
        case SET_PICS: {
            return {
                ...state,
                pics: action.pics,
            }
        }
        case DELETE_GALLERY: {
            const myArray = state.galleries.filter(function (obj) {
                return obj.galleryID !== action.deletedGallery
            })
            console.log(
                '🚀 ~ file: reducer.js ~ line 51 ~ myArray ~ myArray',
                myArray
            )
            return {
                ...state,
                galleries: myArray,
            }
        }
        case DELETE_PHOTO: {
            const myArray = state.pics.filter(function (obj) {
                return obj.id !== action.deletedPhoto
            })

            return {
                ...state,
                pics: myArray,
            }
        }
        case SHOULD_REFRESH: {
            console.log('heres the input ', action.shouldRefresh)

            return {
                ...state,
                shouldRefresh: action.shouldRefresh,
            }
        }
        case EMPTY_PICS_ARRAY: {
            return {
                ...state,
                pics: [],
            }
        }
        case EMPTY_OTHER_GALLERIES: {
            return {
                ...state,
                otherGalleries: [],
            }
        }
        case SET_GALLERY_INFO: {
            return {
                ...state,
                galleryInfo: {
                    allowedFriendsIDs: action.allowedFriendsIDs,
                    allowedFriendsUsernames: action.allowedFriendsUsernames,
                    privacySetting: action.privacySetting,
                    eventName: action.eventName,
                    eventType: action.eventType,
                    thumbnail: action.thumbnail,
                },
            }
        }
        case EDIT_GALLERY: {
            const editedGalleryIndex = state.galleries.findIndex(
                (element) => element.galleryID == action.galleryID
            )
            const newGalleriesArray = state.galleries
            state.galleries[editedGalleryIndex] = {
                ...state.galleries[editedGalleryIndex],
                galleryName: action.eventName,
                thumbnail: action.thumbnail,
            }
            return {
                ...state,
                galleries: newGalleriesArray,
            }
        }
        default:
            return state
    }
}

export default galleryReducer
