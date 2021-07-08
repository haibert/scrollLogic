import React, {
    useEffect,
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
} from 'react'

import { Image, Platform } from 'react-native'

import * as FileSystem from 'expo-file-system'

import PropTypes from 'prop-types'

import { useFocusEffect } from '@react-navigation/native'

const AnimatedCachedImageComp = forwardRef((props, ref) => {
    const imageRef = useRef()

    const {
        source: { uri },
        cacheKey,
    } = props
    const filesystemURI = `${FileSystem.cacheDirectory}images/${cacheKey}`

    const [imgURI, setImgURI] = useState(filesystemURI)

    const componentIsMounted = useRef(true)
    // console.log('reRendered')

    let shouldRefresh = true
    // useEffect(() => {
    //     // componentIsMounted.current = true
    //     console.log(
    //         '🚀 ~ file: CachedImage.js ~ line 30 ~ useEffect ~ componentIsMounted.current',
    //         componentIsMounted.current
    //     )

    //     // componentIsMounted.current = true
    //     const loadImage = async ({ fileURI }) => {
    //         try {
    //             // Use the cached image if it exists
    //             const metadata = await FileSystem.getInfoAsync(fileURI)
    //             if (!metadata.exists) {
    //                 console.log('exists & download')
    //                 // download to cache
    //                 if (componentIsMounted.current) {
    //                     // setImgURI(null)
    //                     await FileSystem.downloadAsync(uri, fileURI)
    //                     imageRef.current?.setNativeProps({
    //                         source: [{ uri: newImageSource }],
    //                     })
    //                 }
    //                 if (componentIsMounted.current) {
    //                     console.log('exists & set')
    //                     imageRef.current?.setNativeProps({
    //                         source: [{ uri: newImageSource }],
    //                     })
    //                     // setImgURI(fileURI)
    //                     componentIsMounted.current = false
    //                 }
    //             } else {
    //             }
    //         } catch (err) {
    //             // props.onError()
    //             // componentIsMounted.current = true
    //             // setImgURI(uri)
    //         }
    //     }

    //     loadImage({ fileURI: filesystemURI })

    //     // return () => {
    //     //     componentIsMounted.current = false
    //     // }
    // }, [props.source]) // eslint-disable-line react-hooks/exhaustive-deps

    useFocusEffect(() => {
        const loadImage = async ({ fileURI }) => {
            try {
                const metadata = await FileSystem.getInfoAsync(fileURI)
                if (!metadata.exists) {
                    console.log('Picture doesnt exist, download picture')
                    const results = await FileSystem.downloadAsync(uri, fileURI)
                    if (results.uri) {
                        // console.log(
                        //     'Picture didnt exist, downloaded it, set it, no need to refresh'
                        // )
                        imageRef.current?.setNativeProps({
                            source: [{ uri: fileURI }],
                        })
                        shouldRefresh = false
                    } else {
                        console.log(
                            'Picture didnt exist, couldnt download it, need to refresh'
                        )

                        shouldRefresh = true
                    }
                } else {
                    // console.log('Picture exists, no need to download')
                    shouldRefresh = false

                    if (Platform.OS === 'android') {
                        imageRef.current?.setNativeProps({
                            src: [{ uri: fileURI }],
                        })
                    } else {
                        imageRef.current?.setNativeProps({
                            source: [{ uri: fileURI }],
                        })
                    }
                }
            } catch (err) {
                // console.log('Over all error')
                shouldRefresh = true
            }
        }

        loadImage({ fileURI: filesystemURI })

        const refreshConditionally = async () => {
            if (shouldRefresh) {
                loadImage({ fileURI: filesystemURI })
            }
        }

        refreshConditionally()
    })
    // console.log(props.source.uri)

    return (
        <Image
            ref={imageRef}
            style={props.style}
            resizeMode={props.resizeMode}
            // {...props}
            // source={{
            //     uri: imgURI,
            // }}
            fadeDuration={800}
            onLoad={props.onLoad}
        />
    )
})
CachedImage.propTypes = {
    source: PropTypes.object.isRequired,
    cacheKey: PropTypes.string.isRequired,
}

export default AnimatedCachedImageComp
