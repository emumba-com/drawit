import React from 'react'

export default class DefaultNode extends React.Component {
    render() {
        const { title } = this.props


        return (
            <div className="Drawit--DefaultNode">
                <span>DefaultNode</span>
            </div>
        )
    }
}