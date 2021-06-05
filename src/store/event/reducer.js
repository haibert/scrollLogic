import { ADD_GALLERY, SET_GALLERIES, SET_PICS, DELETE_GALLERY } from './action'

const initialState = {
    events: [],
    galleries: [],
    pics: [],
    newGalleryID: '',
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
            console.log(action.galleries)
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
            let newArray
            const index = galleries.indexOf(action.deletedGallery)
            if (index > -1) {
                newArray = galleries.splice(index, 1)
            }
            return {
                ...state,
                galleries: newArray,
            }
        }
        default:
            return state
    }
}

export default galleryReducer
