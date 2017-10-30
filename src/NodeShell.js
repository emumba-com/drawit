import React from 'react'
import PropTypes from 'prop-types'

import draggable from './draggable'
import Port from './Port'
import PortShell from './PortShell'

export default draggable()(class NodeShell extends React.Component {
    static propTypes = {
        model: PropTypes.any,
        node: PropTypes.any,
        offsetX: PropTypes.number,
        offsetY: PropTypes.number,
        onChange: PropTypes.func,

        // inserted by draggable
        isDragging: PropTypes.bool
    }
    render() {
        const { model, node, offsetX, offsetY, onChange, isDragging } = this.props
        const { component: NodeComponent, children } = node.props
        const ports = children ? React.Children.toArray(children).filter(child => child.type === Port) : []

        return (
            <div className="Drawit--NodeShell">
                <NodeComponent model={model} isDragging={isDragging}/>
                {
                    ports.map(port => <PortShell port={port}/>)
                }
            </div>
        )
    }
})