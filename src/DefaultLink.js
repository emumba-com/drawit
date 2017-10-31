import React from 'react'
import PropTypes from 'prop-types'

const toDString = p => 
    `M${p[0].x},${p[0].y} L${p[1].x},${p[1].y}`

export default class DefaultLink extends React.Component {
    static propTypes = {
        model: PropTypes.object
    }

    render() {
        const { model } = this.props
        const { points = [{x: 0, y: 0}, {x: 100, y: 100}] } = model

        return <path stroke="#666" d={toDString(points)}/>
    }
}