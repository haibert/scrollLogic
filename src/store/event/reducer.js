import { ADD_EVENT } from './action'

const initialState = {
    events: [],
}

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EVENT: {
            return {
                ...state,
                signupInfo: { ...state.signupInfo, event: action.events },
            }
        }

        default:
            return state
    }
}

export default eventReducer
