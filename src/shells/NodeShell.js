import React from 'react'
import PropTypes from 'prop-types'

import { draggable, entityComponent, movable } from '../utils'
import { Port } from '../conf'
import PortShell from './PortShell'

@entityComponent({
    entityType: 'node'
})
@draggable({
    enable: props => props.enableDragging
})
@movable({
    onDragEnd: (event, props) => {
        const { x, y } = event
        const { onChangeEntityModel, model, onDragEnd } = props
        onChangeEntityModel('nodes', {
            ...model,
            x, y
        })

        onDragEnd && onDragEnd({x, y})
    }
})
export default class NodeShell extends React.Component {
    static propTypes = {
        value: PropTypes.object.isRequired,
        model: PropTypes.any,
        conf: PropTypes.object.isRequired,
        offsetX: PropTypes.number,
        offsetY: PropTypes.number,
        onChangeEntityModel: PropTypes.func,

        // inserted by draggable
        isDragging: PropTypes.bool
    }
    render() {
        const { value, model, conf, offsetX, offsetY, isDragging } = this.props
        const { positions, component: NodeComponent } = conf
        // const { component: NodeComponent, children } = node.props
        // const ports = children ? React.Children.toArray(children).filter(child => child.type === Port) : []
        return (
            <div className="Drawit--NodeShell">
                <NodeComponent value={value} model={model} isDragging={isDragging}/>
                {
                    Object.keys(positions).map(key => {
                        const position = positions[key]
                        const portType = value.ports[model.ports[key]].type
                        const port = position.ports[portType]
                        const portModel = value.ports[model.ports[key]]

                        return <PortShell key={key} conf={port} model={portModel}/>
                    })
                }
            </div>
        )
    }
}
