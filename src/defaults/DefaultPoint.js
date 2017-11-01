import React from 'react'

export default class DefaultPoint extends React.Component {
    render() {
        const { model } = this.props

        return (
            <g>
                <circle r={4} stroke="#666" fill="white"/>
            </g>
        )
    }
}