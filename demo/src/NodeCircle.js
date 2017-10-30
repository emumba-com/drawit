import React from 'react'

export default class NodeCircle extends React.Component {
    render() {
        const { model: { title }, isDragging } = this.props

        return (
            <div className={['Node-Circle', isDragging ? 'Drawit--DefaultNode--isDragging' : ''].join(' ')}>
                <span>{ title }</span>
            </div>
        )
    }
}