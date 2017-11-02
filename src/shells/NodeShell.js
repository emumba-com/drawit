import React from 'react'
import PropTypes from 'prop-types'

import { draggable } from '../utils'
import { Port } from '../conf'
import PortShell from './PortShell'

@draggable()
export default class NodeShell extends React.Component {
    static propTypes = {
        value: PropTypes.object.isRequired,
        model: PropTypes.any,
        conf: PropTypes.object.isRequired,
        offsetX: PropTypes.number,
        offsetY: PropTypes.number,
        onChange: PropTypes.func,

        // inserted by draggable
        isDragging: PropTypes.bool
    }
    render() {
        const { value, model, conf, offsetX, offsetY, onChange, isDragging } = this.props
        const { positions, component: NodeComponent } = conf
        // const { component: NodeComponent, children } = node.props
        // const ports = children ? React.Children.toArray(children).filter(child => child.type === Port) : []

        return (
            <div className="Drawit--NodeShell">
                <NodeComponent model={model} isDragging={isDragging}/>
                {
                    Object.keys(positions).map(key => {
                        const position = positions[key]
                        const portType = value.ports[model.ports[key]].type
                        const port = position.ports[portType]
                        // console.log('position: ', position, 'portType: ', portType, 'port: ', port)

                        return <PortShell key={key} conf={port}/>
                    })
                }
            </div>
        )
    }
}