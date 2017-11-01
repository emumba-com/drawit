import React from 'react'
import PropTypes from 'prop-types'

import { draggable, DraggableElementSVG } from '../utils'
import { DefaultPoint } from '../defaults'

export default draggable({
    draggableElement: DraggableElementSVG,
    toPositionAttributes: (x, y) => ({x, y})
})(class PointShell extends React.Component {
    static propTypes = {
        point: PropTypes.any,
        component: PropTypes.any
    }
    render() {
        const { point, model } = this.props
        const { component: PointComponent } = point.props

        return (
            <g>
                <PointComponent />
            </g>
        )
    }
})