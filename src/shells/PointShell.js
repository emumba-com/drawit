import React from 'react'
import PropTypes from 'prop-types'

import { draggable, DraggableElementSVG } from '../utils'
import { DefaultPoint } from '../defaults'

@draggable({
    draggableElement: DraggableElementSVG,
    toPositionAttributes: (x, y) => ({x, y}),
    snapTargets: ['port'],

    onDragStart: (event, props, context) => {
        const { onDragStart } = props
        const { dragPosition } = event
        
        onDragStart && onDragStart(dragPosition)
    },
    onDrag: (event, props, context) => {
        const { onDrag } = props
        const { dragPosition } = event

        onDrag && onDrag(dragPosition)
    },
    onDragEnd: (event, props, context) => {
        const { dragPosition } = event
        const { onChange, model, onDragEnd } = props

        onChange({
            ...model,
            ...dragPosition
        })

        onDragEnd && onDragEnd(dragPosition)
        // const { getSnappableByID } = context
        // const snappable = getSnappableByID(snapTargetID)
        // const { target } = snappable
        // const {}
    }
})
export default class PointShell extends React.Component {
    static propTypes = {
        conf: PropTypes.object.isRequired,
        model: PropTypes.object.isRequired,
        onChangeEntityModel: PropTypes.isRequired,

        // injected by @draggable
        isSnapped: PropTypes.bool,
        snapTargetID: PropTypes.string
    }
    render() {
        const { conf, model, isSnapped } = this.props
        const { component: PointComponent } = conf

        return (
            <g>
                <PointComponent model={model} isSnapped={isSnapped} />
            </g>
        )
    }
}