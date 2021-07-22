import {
    ADD_GALLERY,
    SET_GALLERIES,
    SET_PICS,
    DELETE_GALLERY,
    SHOULD_REFRESH,
    DELETE_PHOTO,
    EMPTY_PICS_ARRAY,
    SET_OTHER_GALLERIES,
} from './action'

const initialState = {
    events: [],
    galleries: [],
    otherGalleries: [],
    pics: [],
    newGalleryID: '',
    shouldRefresh: false,
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
                galleries: action.galleries,
            }
        }
        case SET_OTHER_GALLERIES: {
            return {
                ...state,
                otherGalleries: action.otherGalleries,
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
                return obj.id !== action.deletedGallery.id
            })

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

        default:
            return state
    }
}

export default galleryReducer
