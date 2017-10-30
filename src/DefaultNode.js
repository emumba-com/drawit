import React from 'react'
import draggable from './draggable'

export default class DefaultNode extends React.Component {
    render() {
        const { model: { title }, isDragging } = this.props

        return (
            <div className={['Drawit--DefaultNode', isDragging ? 'Drawit--DefaultNode--isDragging' : ''].join(' ')}>
                <span>{ title }</span>
            </div>
        )
    }
}