import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import {
    RecyclerListView,
    DataProvider,
    LayoutProvider,
} from 'recyclerlistview'

const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2,
}

import { CommonActions } from '@react-navigation/native'

import Thumbnail from '../components/Thumbnail'

let containerCount = 0

class CellContainer extends React.Component {
    constructor(args) {
        super(args)
        this._containerId = containerCount++
    }
    render() {
        return (
            <View {...this.props}>
                {this.props.children}
                <Text>Cell Id: {this._containerId}</Text>
            </View>
        )
    }
}

/***
 * To test out just copy this component and render in you root component
 */
export default class RecycleTestComponent extends React.Component {
    constructor(args) {
        super(args)

        let { width } = Dimensions.get('window')

        //Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
        //THIS IS VERY IMPORTANT, FORGET PERFORMANCE IF THIS IS MESSED UP
        let dataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2
        })

        //Create the layout provider
        //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
        //Second: Given a type and object set the exact height and width for that type on given object, if you're using non deterministic rendering provide close estimates
        //If you need data based check you can access your data provider here
        //You'll need data in most cases, we don't provide it by default to enable things like data virtualization in the future
        //NOTE: For complex lists LayoutProvider will also be complex it would then make sense to move it to a different file
        this._layoutProvider = new LayoutProvider(
            (index) => {
                if (index % 3 === 1) {
                    return ViewTypes.HALF_LEFT
                } else {
                    return ViewTypes.HALF_RIGHT
                }
            },
            (type, dim) => {
                switch (type) {
                    case ViewTypes.HALF_LEFT:
                        dim.width = width / 2 - 15
                        dim.height = 260
                        break
                    case ViewTypes.HALF_RIGHT:
                        dim.width = width / 2 - 15
                        dim.height = 260
                        break
                    default:
                        dim.width = 0
                        dim.height = 0
                }
            }
        )

        this._rowRenderer = this._rowRenderer.bind(this)

        //Since component should always render once data has changed, make data provider part of the state
        this.state = {
            dataProvider: dataProvider.cloneWithRows(this.props.data),
        }
    }

    _generateArray(n) {
        let arr = new Array(n)
        for (let i = 0; i < n; i++) {
            arr[i] = i
        }
        return arr
    }

    //Given type and data return the view component
    _rowRenderer(type, data) {
        //You can return any view here, CellContainer has no special significance
        switch (type) {
            case ViewTypes.HALF_LEFT:
                console.log(this.props)
                return (
                    <Thumbnail
                        images={data}
                        galleryPressedHandler={() => {
                            galleryPressedHandler(data)
                        }}
                        navigation={this.props.navigation}
                        galleryName={this.data.galleryName}
                        onActionsPressed={() => {
                            // bottomSheetRef.current?.handlePresentModalPress()
                            // setDeleteID(item.galleryID)
                        }}
                        key={data}
                    />
                )
            case ViewTypes.HALF_RIGHT:
                return (
                    <Thumbnail
                        images={data}
                        galleryPressedHandler={() => {
                            galleryPressedHandler(data)
                        }}
                        navigation={this.props.navigation}
                        // galleryName={item.galleryName}
                        onActionsPressed={() => {
                            // bottomSheetRef.current?.handlePresentModalPress()
                            // setDeleteID(item.galleryID)
                        }}
                        key={data}
                    />
                )

            default:
                return null
        }
    }

    render() {
        return (
            <RecyclerListView
                layoutProvider={this._layoutProvider}
                dataProvider={this.state.dataProvider}
                rowRenderer={this._rowRenderer}
                contentContainerStyle={{
                    paddingBottom: 80,
                }}
                scrollViewProps={{
                    refreshControl: (
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={async () => {
                                this.setState({ loading: true })
                                analytics.logEvent(
                                    'Event_Stagg_pull_to_refresh'
                                )
                                await refetchQueue()
                                this.setState({ loading: false })
                            }}
                        />
                    ),
                }}
            />
        )
    }
}
const styles = {
    container: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#00a1f1',
    },
    containerGridLeft: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#ffbb00',
    },
    containerGridRight: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#7cbb00',
    },
}
