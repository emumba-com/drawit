import React from 'react'
import PropTypes from 'prop-types'

import { draggable, DraggableElementSVG, entityComponent, movable } from '../utils'
import { DefaultPoint } from '../defaults'

@entityComponent({
    entityType: 'point'
})
@draggable({
    snapTargets: ['port'],
    enable: props => props.enableDragging
})
@movable({
    draggableElement: DraggableElementSVG,
    toPositionAttributes: (x, y) => ({x, y}),
    getDockTargets: ({ model, value, logger }) => {
        const { id, dockTarget } = model
        const output = []

        if ( dockTarget ) {
            const port = value.ports[dockTarget]
            output.push(port.parentID)

            if ( logger.logLevel === 'verbose' ) {
                logger.verbose(`[PointShell/getDockTargets] Point[${id}] is docked to Port[${dockTarget}]`)
            }
            // console.log(`[movable/getDockTarget] output: `, output)
        }

        return output
    },
    onDragStart: (event, props) => {
        const { onDragStart } = props
        const { x, y } = event

        onDragStart && onDragStart({ x, y })
    },
    onDrag: (event, props) => {
        const { onDrag } = props
        const { x, y } = event

        // console.log('[PointShell/movable/onDrag] triggered', event)
        onDrag && onDrag({ x, y })
    },
    onDragEnd: (event, props) => {
        const { x, y, isSnapped, snapTarget: snapTargetModel } = event
        const { onChangeEntityModel, model, onDragEnd } = props
        const nextPointModel = {...model, x, y}

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

        onDragEnd && onDragEnd({x, y})

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
