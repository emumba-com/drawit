import React from 'react'
import PropTypes from 'prop-types'

import draggable from './draggable'

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
        const NodeComponent = node.props.component

        return (
            <div className="Drawit--NodeShell">
                <NodeComponent model={model} isDragging={isDragging}/>
            </div>
        )
    }
})