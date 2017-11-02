// libs
import React from 'react'
import PropTypes from 'prop-types'

// src
import { Point } from '../conf'
import PointShell from './PointShell'
import { DefaultPoint } from '../defaults'

const cache = {}

const getPointByType = (type, children = []) => {
    if ( !cache[type] ) {
        cache[type] = children.find(child => child.props.type === type) || <Point type="default" component={DefaultPoint}/>
    }

    return cache[type]
}


export default class LinkShell extends React.Component {
    static propTypes = {
        conf: PropTypes.object.isRequired,
        model: PropTypes.object.isRequired
    }

    state = { isDraggingPoint: false, draggedPoint: null, draggedPointIndex: null }

    handleChangePoint = (index, pointModel) => {
        // console.log(`point changed: `, model)
        const { onChange, model } = this.props
        const nextPoints = [...model.points]
        nextPoints.splice(index, 1, pointModel)
        const nextModel = {...model, points: nextPoints}

        onChange(nextModel)
    }
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
        const { model, conf, onChange, offsetX, offsetY } = this.props
        const { component: LinkComponent } = conf
        const { points: pointModels } = model
        // console.log(`pointModels: `, pointModels, 'conf: ', conf)
        // const point = getPointByType('default', children)

        // TODO binds below are horrible, find an alternate way of doing it

        return (
            <g className="Drawit--LinkShell">
                <LinkComponent
                    model={model}
                    isDraggingPoint={isDraggingPoint}
                    draggedPoint={draggedPoint}
                    draggedPointIndex={draggedPointIndex}/>
                {
                    pointModels.map((p, index) =>
                        <PointShell
                            key={index}
                            index={index}
                            model={p}
                            conf={conf.points[p.type]}
                            offsetX={offsetX}
                            offsetY={offsetY}
                            onChange={this.handleChangePoint.bind(null, index)}
                            onDragStart={this.handleDragPointStart.bind(null, index)}
                            onDrag={this.handleDragPoint.bind(null, index)}
                            onDragEnd={this.handleDragPointEnd.bind(null, index)}/>)
                }
            </g>
        )
    }
}