import React from 'react'
import PropTypes from 'prop-types'

import DefaultPoint from './DefaultPoint'

export default class PointShell extends React.Component {
    static propTypes = {
        point: PropTypes.any,
        component: PropTypes.any
    }
    render() {
        const { point, model } = this.props
        const { component: PointComponent } = point.props

        return (
            <svg x={model[0]} y={model[1]} style={{overflow: 'visible'}}>
                <PointComponent />
            </svg>
        )
    }
}