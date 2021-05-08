import React from 'react'
import { View, StyleSheet } from 'react-native'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeAreaComp = (props) => {
    const insets = useSafeAreaInsets()

    return (
        <View
            style={[
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    flex: 1,
                },
                { ...props.style },
            ]}
        >
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({})

export default SafeAreaComp
