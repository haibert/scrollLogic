export const SAVE_CAMERA_STATUS = 'SAVE_CAMERA_STATUS'
export const SET_PERMISSIONS = 'SET_PERMISSIONS'

import {
    insertCameraPermissions,
    fetchPermissions,
} from '../../sql/database.js'

export const savePermissionsStatus = (status) => {
    return async (dispatch) => {
        try {
            const dbResult = await insertCameraPermissions('CAMERA', status)
            console.log(dbResult)
            dispatch({
                type: SAVE_CAMERA_STATUS,
                status: status,
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

export const loadPermissions = () => {
    return async (dispatch) => {
        try {
            const dbResult = await fetchPermissions()
            console.log(dbResult)
            dispatch({
                type: SET_PERMISSIONS,
                permissions: dbResult.rows._array,
            })
        } catch (err) {
            throw err
        }
    }
}
