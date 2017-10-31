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
    handleChangePoint = (index, pointModel) => {
        // console.log(`point changed: `, model)
        const { onChange, model } = this.props
        const nextPoints = [...model.points]
        nextPoints.splice(index, 1, pointModel)
        const nextModel = {...model, points: nextPoints}

        onChange(nextModel)
    }
    render() {
        const { model, link, onChange, children, offsetX, offsetY } = this.props
        const { component: LinkComponent } = link.props
        const { points: pointModels = [{x: 0, y: 0}, {x: 100, y: 100}] } = model
        const point = getPointByType('default', children)

        return (
            <g className="Drawit--LinkShell">
                <LinkComponent model={model}/>
                {
                    pointModels.map((p, index) =>
                        <PointShell
                            key={index}
                            model={p}
                            point={point}
                            onChange={this.handleChangePoint.bind(null, index)}
                            offsetX={offsetX}
                            offsetY={offsetY}/>)
                }
            </g>
        )
    }
}