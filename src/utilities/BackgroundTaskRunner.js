import React, { useRef } from 'react'
import { WebView } from 'react-native'
export default function BackgroundTaskRunner() {
    const ref = useRef()

    const runJSInBackground = (code) => {
        webView.current?.injectJavaScript(code)
    }

    const handleMessage = (e) => {
        const message = e.nativeEvent.data
        console.log('message from webview:', message)
    }

    return (
        <WebView
            ref={ref}
            source={{ html: '<html><body></body></html>' }}
            onMessage={handleMessage}
        />
    )
}
