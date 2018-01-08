// libs
import React from 'react'
import PropTypes from 'prop-types'

// src
import { Point } from '../conf'
import PointShell from './PointShell'
import { DefaultPoint } from '../defaults'
import { entityComponent } from '../utils'

@entityComponent({
    entityType: 'link'
})
export default class LinkShell extends React.Component {
    static propTypes = {
        conf: PropTypes.object.isRequired,
        model: PropTypes.object.isRequired,
        value: PropTypes.object.isRequired
    }

    state = { isDraggingPoint: false, draggedPoint: null, draggedPointIndex: null }

    handleDragPointStart = (index, position) => {
        this.setState({
            isDraggingPoint: true,
            draggedPoint: position,
            draggedPointIndex: index
        })
    }
    handleDragPoint = (index, position) => {
        this.setState({
            draggedPoint: position
        })
    }
    handleDragPointEnd = (index, position) => {
        this.setState({
            isDraggingPoint: false,
            draggedPoint: null,
            draggedPoint: null
        })
    }
    render() {
        const { isDraggingPoint, draggedPoint, draggedPointIndex } = this.state
        const { value, valueBuilder, model, conf, onChangeEntityModel, offsetX, offsetY, logger, enableDragging } = this.props
        const { component: LinkComponent } = conf
        const { points: pointModels } = model
        const injectibleModel = {
            ...model,
            points: model.points.map(pointID => value.points[pointID])
        }
        // const point = getPointByType('default', children)

        // TODO binds below are horrible, find an alternate way of doing it

        return (
            <g className="Drawit--LinkShell">
                <LinkComponent
                    value={value}
                    valueBuilder={valueBuilder}
                    model={injectibleModel}
                    isDraggingPoint={isDraggingPoint}
                    draggedPoint={draggedPoint}
                    draggedPointIndex={draggedPointIndex}/>
                {
                    pointModels.map((p, index) =>
                        <PointShell
                            key={index}
                            index={index}
                            logger={logger}
                            model={value.points[p]}
                            value={value}
                            conf={conf.points[value.points[p].type]}
                            offsetX={offsetX}
                            offsetY={offsetY}
                            onChangeEntityModel={onChangeEntityModel}
                            enableDragging={enableDragging}
                            onDragStart={this.handleDragPointStart.bind(null, index)}
                            onDrag={this.handleDragPoint.bind(null, index)}
                            onDragEnd={this.handleDragPointEnd.bind(null, index)}/>)
                }
            </g>
        )
    }
}
