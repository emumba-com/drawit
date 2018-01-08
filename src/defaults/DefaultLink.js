import React from 'react'
import PropTypes from 'prop-types'

const toDString = p => 
    `M${p[0].x},${p[0].y} L${p[1].x},${p[1].y}`

const toShadowPoints = (points, newPoint, newPointIndex) => {
    const nextPoints = [...points]
    nextPoints.splice(newPointIndex, 1, newPoint)

    return nextPoints
}

export default class DefaultLink extends React.Component {
    static propTypes = {
        model: PropTypes.object,
        isDraggingPoint: PropTypes.bool,
        draggedPoint: PropTypes.object,
        draggedPointIndex: PropTypes.number
    }

    render() {
        const { model, isDraggingPoint = false, draggedPoint, draggedPointIndex } = this.props
        const { points = [{x: 0, y: 0}, {x: 100, y: 100}] } = model

        const drawablePoints = isDraggingPoint ? toShadowPoints(points, draggedPoint, draggedPointIndex) : points

        return (
            <g>
                <path stroke="#666" d={toDString(drawablePoints)}/>
            </g>
        )
    }
}