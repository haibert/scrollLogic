import React, {
    useEffect,
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
} from 'react'

import { Image } from 'react-native'

import * as FileSystem from 'expo-file-system'

import PropTypes from 'prop-types'

const CachedImageGalleryView = forwardRef((props, ref) => {
    const imageRef = useRef()

    const {
        source: { uri },
        cacheKey,
    } = props
    const filesystemURI = `${FileSystem.cacheDirectory}images/${cacheKey}`

    const [imgURI, setImgURI] = useState(filesystemURI)

    const componentIsMounted = useRef(true)
    // console.log('reRendered')
    useEffect(() => {
        // componentIsMounted.current = true
        const loadImage = async ({ fileURI }) => {
            try {
                // Use the cached image if it exists
                const metadata = await FileSystem.getInfoAsync(fileURI)
                if (!metadata.exists) {
                    console.log('exists & download')
                    // download to cache
                    if (componentIsMounted.current) {
                        // setImgURI(null)
                        await FileSystem.downloadAsync(uri, fileURI)
                    }
                    if (componentIsMounted.current) {
                        console.log('exists & set')
                        imageRef.current?.setNativeProps({
                            source: { uri: fileURI },
                        })

                        // setImgURI(fileURI)
                    }
                }
                componentIsMounted.current = false
            } catch (err) {
                // props.onError()
                // componentIsMounted.current = true
                // setImgURI(uri)
            }
        }

        loadImage({ fileURI: filesystemURI })

        // return () => {
        //     componentIsMounted.current = false
        // }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Image
            ref={imageRef}
            {...props}
            // source={{
            //     uri: imgURI,
            // }}
        />
    )
})
CachedImageGalleryView.propTypes = {
    source: PropTypes.object.isRequired,
    cacheKey: PropTypes.string.isRequired,
}

export default CachedImageGalleryView
