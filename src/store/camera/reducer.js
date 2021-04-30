import { TAKE_PICTURE } from './actions'

const initialState = {
    pictureUri: '',
}

const signupReducer = (state = initialState, action) => {
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

export default signupReducer
