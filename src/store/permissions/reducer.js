import { SAVE_PERMISSION_STATUS, LOAD_PERMISSIONS } from './actions'

const initialState = {
    permissions: {
        camera: '',
    },
}

const permissionsReducer = (state = initialState, action) => {
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
        case LOAD_PERMISSIONS: {
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

export default permissionsReducer
