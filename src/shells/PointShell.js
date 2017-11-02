import React from 'react'
import PropTypes from 'prop-types'

import { draggable, DraggableElementSVG } from '../utils'
import { DefaultPoint } from '../defaults'

export default draggable({
    draggableElement: DraggableElementSVG,
    toPositionAttributes: (x, y) => ({x, y})
})(class PointShell extends React.Component {
    static propTypes = {
        conf: PropTypes.object.isRequired,
        model: PropTypes.object.isRequired
    }
    render() {
        const { conf, model } = this.props
        const { component: PointComponent } = conf

        return (
            <g>
                <PointComponent />
            </g>
        )
    }
})