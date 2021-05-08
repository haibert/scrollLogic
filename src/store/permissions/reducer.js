import { SAVE_PERMISSION_STATUS, SET_PERMISSIONS } from './actions'

const initialState = {
    permissions: {
        camera: '',
    },
}

const signupReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_PERMISSION_STATUS: {
            console.log(action.status)
            return {
                ...state,
                permissions: {
                    ...state.permissions,
                    camera: action.status,
                },
            }
        }
        case SET_PERMISSIONS: {
            console.log(action.permissions)
            return {
                ...state,
                permissions: {
                    ...state.permissions,
                    camera: action.permissions,
                },
            }
        }
        default:
            return state
    }
}

export default signupReducer
