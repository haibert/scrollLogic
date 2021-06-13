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

const CachedImage = forwardRef((props, ref) => {
    const {
        source: { uri },
        cacheKey,
    } = props
    const filesystemURI = `${FileSystem.cacheDirectory}images/${cacheKey}`

    const [imgURI, setImgURI] = useState(filesystemURI)

    const componentIsMounted = useRef(true)
    // console.log('reRendered')
    useEffect(() => {
        const loadImage = async ({ fileURI }) => {
            try {
                // Use the cached image if it exists
                const metadata = await FileSystem.getInfoAsync(fileURI)
                if (!metadata.exists) {
                    // download to cache
                    if (componentIsMounted.current) {
                        setImgURI(null)
                        await FileSystem.downloadAsync(uri, fileURI)
                    }
                    if (componentIsMounted.current) {
                        setImgURI(fileURI)
                    }
                }
            } catch (err) {
                console.log('got to error')
                props.onError()
                setImgURI(uri)
            }
        }

        loadImage({ fileURI: filesystemURI })

        return () => {
            componentIsMounted.current = false
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useImperativeHandle(ref, () => ({
        reDownload: async () => {
            try {
                // Use the cached image if it exists
                const metadata = await FileSystem.getInfoAsync(fileURI)
                if (!metadata.exists) {
                    // download to cache
                    if (componentIsMounted.current) {
                        setImgURI(null)
                        await FileSystem.downloadAsync(uri, fileURI)
                    }
                    if (componentIsMounted.current) {
                        console.log('got here')
                        setImgURI(fileURI)
                    }
                }
            } catch (err) {
                console.log('got to error')
                setImgURI(uri)
            }
            componentIsMounted.current = false
        },
    }))

    return (
        <Image
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            source={{
                uri: imgURI,
            }}
        />
    )
})
CachedImage.propTypes = {
    source: PropTypes.object.isRequired,
    cacheKey: PropTypes.string.isRequired,
}

export default CachedImage

// import React, {
//     useEffect,
//     useState,
//     useRef,
//     useImperativeHandle,
//     forwardRef,
// } from 'react'

// import { Image } from 'react-native'

// import * as FileSystem from 'expo-file-system'

// import PropTypes from 'prop-types'

// const CachedImage = forwardRef((props, ref) => {
//     const {
//         source: { uri },
//         cacheKey,
//     } = props
//     const filesystemURI = `${FileSystem.cacheDirectory}${cacheKey}`

//     const [imgURI, setImgURI] = useState(filesystemURI)

//     const componentIsMounted = useRef(true)

//     useEffect(() => {
//         const loadImage = async ({ fileURI }) => {
//             try {
//                 // Use the cached image if it exists
//                 const metadata = await FileSystem.getInfoAsync(fileURI)
//                 if (!metadata.exists) {
//                     // download to cache
//                     if (componentIsMounted.current) {
//                         setImgURI(null)
//                         await FileSystem.downloadAsync(uri, fileURI)
//                     }
//                     if (componentIsMounted.current) {
//                         setImgURI(fileURI)
//                     }
//                 }
//             } catch (err) {
//                 console.log() // eslint-disable-line no-console
//                 setImgURI(uri)
//             }
//         }

//         loadImage({ fileURI: filesystemURI })

//         return () => {
//             componentIsMounted.current = false
//         }
//     }, []) // eslint-disable-line react-hooks/exhaustive-deps

//     useImperativeHandle(ref, () => ({
//         reDownload: async () => {
//             try {
//                 // Use the cached image if it exists
//                 const metadata = await FileSystem.getInfoAsync(fileURI)
//                 if (!metadata.exists) {
//                     // download to cache
//                     if (componentIsMounted.current) {
//                         setImgURI(null)
//                         await FileSystem.downloadAsync(uri, fileURI)
//                     }
//                     if (componentIsMounted.current) {
//                         setImgURI(fileURI)
//                     }
//                 }
//             } catch (err) {
//                 setImgURI(uri)
//             }
//         },
//     }))

//     return (
//         <Image
//             // eslint-disable-next-line react/jsx-props-no-spreading
//             {...props}
//             source={{
//                 uri: imgURI,
//             }}
//         />
//     )
// })

// CachedImage.propTypes = {
//     source: PropTypes.object.isRequired,
//     cacheKey: PropTypes.string.isRequired,
// }

// export default CachedImage
