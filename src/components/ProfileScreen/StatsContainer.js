import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

//colors
import colors from '../../constants/colors'

const StatsContainer = (props) => {
    return (
        <View style={styles.stats}>
            <Pressable
                style={styles.statCubes1}
                onPress={props.followingsPressedHandler}
            >
                <Text style={styles.numbers}>{props.followingCount}</Text>
                <Text style={styles.titles}>Following</Text>
            </Pressable>
            <Pressable
                style={styles.statCubes2}
                onPress={props.followersPressedHandler}
            >
                <Text style={styles.numbers}>{props.followersCount}</Text>
                <Text style={styles.titles}>Followers</Text>
            </Pressable>
            <View style={styles.statCubes3}>
                <Text style={styles.numbers}>23,6k</Text>
                <Text style={styles.titles}>Likes</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    stats: {
        height: 80,
        marginHorizontal: 40,
        flexDirection: 'row',
        // borderColor: colors.separatorLine,
        borderRadius: colors.borderRadius,
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.1,
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
    },
    statCubes1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRightWidth: 1,
        borderColor: 'black',
    },
    statCubes2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRightWidth: 1,
        borderColor: 'black',
    },
    statCubes3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statCubeInner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    numbers: {
        fontSize: 25,
        color: 'black',
        fontFamily: colors.semiBold,
    },
    titles: {
        color: 'black',
        fontFamily: colors.font,
    },
})

export default StatsContainer
