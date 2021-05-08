import { useState, useRef, useEffect } from 'react'
import { AppState } from 'react-native'

const useAppState = (
    foregroundAction = () => {},
    backgroundAction = () => {},
    inactiveAction = () => {}
) => {
    const appState = useRef(AppState.currentState)
    const [appStateVisible, setAppStateVisible] = useState(appState.current)

    // handle app state change
    function handleAppStateChange(nextAppState) {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!')
            foregroundAction()
        }

        if (appState.current.match('background')) {
            backgroundAction()
        }

        if (appState.current.match('inactiveAction')) {
            inactiveAction()
        }

        appState.current = nextAppState
        setAppStateVisible(appState.current)
        console.log('AppState:', appState.current)
    }
    useEffect(() => {
        AppState.addEventListener('change', handleAppStateChange)

        return () => {
            AppState.removeEventListener('change', handleAppStateChange)
        }
    }, [appStateVisible])

    return {
        appStateVisible,
    }
}

export default useAppState
