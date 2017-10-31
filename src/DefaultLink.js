import React from 'react'
import PropTypes from 'prop-types'

const toDString = p => 
    `M${p[0][0]},${p[0][1]} L${p[1][0]},${p[1][1]}`

export default class DefaultLink extends React.Component {
    static propTypes = {
        model: PropTypes.object
    }

    render() {
        const { model } = this.props
        const { points = [[0, 0], [100, 100]] } = model

        return <path stroke="#666" d={toDString(points)}/>
    }
}