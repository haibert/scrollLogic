export const TAKE_PICTURE = 'TAKE_PICTURE'

export const takePicture = (uri) => {
    return {
        type: TAKE_PICTURE,
        pictureUri: uri,
    }
}
