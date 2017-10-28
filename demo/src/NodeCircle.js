import React from 'react'
import draggable from '../../src/draggable'

export default draggable()(class NodeCircle extends React.Component {
    render() {
        const { model: { title }, isDragging } = this.props

        return (
            <div className={['Node-Circle', isDragging ? 'Drawit--DefaultNode--isDragging' : ''].join(' ')}>
                <span>{ title }</span>
            </div>
        )
    }
})