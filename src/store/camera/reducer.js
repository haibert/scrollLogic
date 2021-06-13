import { TAKE_PICTURE, ADD_TO_GALLERY, SET_CAMERA_UP } from './actions'

const initialState = {
    pictureUri: '',
    pictureBase64: '',
    imagePadding: 0,
    ratio: '4:3',
    previewRatio: 1,
}

const cameraReducer = (state = initialState, action) => {
    switch (action.type) {
        case TAKE_PICTURE: {
            return {
                pictureUri: action.pictureUri,
                pictureBase64: action.pictureBase64,
            }
        }
        case SET_CAMERA_UP: {
            return {
                ...state,
                imagePadding: action.imagePadding,
                ratio: action.ratio,
                previewRatio: action.previewRatio,
            }
        }

        default:
            return state
    }
}

export default cameraReducer
