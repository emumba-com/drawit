import React from 'react'
import PropTypes from 'prop-types'

import { draggable, DraggableElementSVG, entityComponent } from '../utils'
import { DefaultPoint } from '../defaults'

@entityComponent({
    entityType: 'point'
})
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
    onDragEnd: (event, props) => {
        const { dragPosition, isSnapped, snapTargetModel } = event
        const { onChangeEntityModel, model, onDragEnd } = props
        const nextPointModel = {...model, ...dragPosition}

        if ( snapTargetModel ) {
            nextPointModel.dockTarget = snapTargetModel.id

            const nextPortModel = {...snapTargetModel}
            
            if ( !nextPortModel.dockedPoints ) {
                nextPortModel.dockedPoints = []
            }

            if ( nextPortModel.dockedPoints.indexOf(model.id) < 0 ) {
                nextPortModel.dockedPoints.push(model.id)
            }

            onChangeEntityModel('ports', nextPortModel)
        }

        onChangeEntityModel('points', nextPointModel)

        onDragEnd && onDragEnd(dragPosition)

        // console.log('snapTargetModel: ', snapTargetModel)
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