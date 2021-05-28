import { TAKE_PICTURE, ADD_TO_GALLERY } from './actions'

const initialState = {
    pictureUri: '',
}

const cameraReducer = (state = initialState, action) => {
    switch (action.type) {
        case TAKE_PICTURE: {
            return {
                pictureUri: action.pictureUri,
            }
        }

        default:
            return state
    }
}

export default cameraReducer
