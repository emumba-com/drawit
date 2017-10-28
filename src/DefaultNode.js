import React from 'react'
import draggable from './draggable'

export default draggable()(class DefaultNode extends React.Component {
    render() {
        const { model: { title } } = this.props

        return (
            <div className="Drawit--DefaultNode">
                <span>{ title }</span>
            </div>
        )
    }
})