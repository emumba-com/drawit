import React from 'react'

export default class DefaultPort extends React.Component {
    render() {
        const { model } = this.props

        return (
            <div className={['Drawit--DefaultPort'].join(' ')}>
            </div>
        )
    }
}