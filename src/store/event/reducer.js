import {
    ADD_GALLERY,
    SET_GALLERIES,
    SET_PICS,
    DELETE_GALLERY,
    SHOULD_REFRESH,
} from './action'

const initialState = {
    events: [],
    galleries: [],
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
        case SET_PICS: {
            return {
                ...state,
                pics: action.pics,
            }
        }
        case DELETE_GALLERY: {
            let newArray = []
            // if (action.deletedGallery.index > -1) {
            //     newArray = state.galleries.splice(
            //         action.deletedGallery.index,
            //         1
            //     )
            //     console.log(
            //         '🚀 ~ file: reducer.js ~ line 42 ~ galleryReducer ~ newArray',
            //         newArray
            //     )
            // }
            const myArray = state.galleries.filter(function (obj) {
                return obj.id !== action.deletedGallery.id
            })
            console.log(
                '🚀 ~ file: reducer.js ~ line 52 ~ myArray ~ myArray',
                myArray
            )
            return {
                ...state,
                galleries: myArray,
            }
        }
        case SHOULD_REFRESH: {
            return {
                ...state,
                shouldRefresh: action.shouldRefresh,
            }
        }
        default:
            return state
    }
}

export default galleryReducer
