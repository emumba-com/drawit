// libs
import React from 'react'

// src
import Point from './Point'
import PointShell from './PointShell'
import DefaultPoint from './DefaultPoint'

const cache = {}

const getPointByType = (type, children = []) => {
    if ( !cache[type] ) {
        cache[type] = children.find(child => child.props.type === type) || <Point type="default" component={DefaultPoint}/>
    }

    return cache[type]
}


export default class LinkShell extends React.Component {
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
        const { model, link, onChange, children, offsetX, offsetY } = this.props
        const { component: LinkComponent } = link.props
        const { points: pointModels = [{x: 0, y: 0}, {x: 100, y: 100}] } = model
        const point = getPointByType('default', children)

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
                            point={point}
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