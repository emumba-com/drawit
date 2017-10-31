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
    render() {
        const { model, link, onChange, children } = this.props
        const { component: LinkComponent } = link.props
        const { points: pointModels = [[0, 0], [100, 100]] } = model
        const point = getPointByType('default', children)

        return (
            <g className="Drawit--LinkShell">
                <LinkComponent model={model}/>
                {
                    pointModels.map((p, index) => <PointShell key={index} model={p} point={point}/>)
                }
            </g>
        )
    }
}