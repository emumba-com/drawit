import React from 'react'
import draggable from '../../src/draggable'

export default draggable()(class NodeDiamond extends React.Component {
    render() {
        const { model: { title }, isDragging } = this.props

        return (
            <div className={['Node-Diamond', isDragging ? 'Drawit--DefaultNode--isDragging' : ''].join(' ')}>
                <span>{ title }</span>
            </div>
        )
    }
})