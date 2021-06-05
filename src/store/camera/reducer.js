import { TAKE_PICTURE, ADD_TO_GALLERY } from './actions'

const initialState = {
    pictureUri: '',
    pictureBase64: '',
}

const cameraReducer = (state = initialState, action) => {
    switch (action.type) {
        case TAKE_PICTURE: {
            return {
                pictureUri: action.pictureUri,
                pictureBase64: action.pictureBase64,
            }
        }

        default:
            return state
    }
}

export default cameraReducer
