import React from 'react'

export default class LinkShell extends React.Component {
    render() {
        const { model, link, onChange } = this.props
        const { component: LinkComponent, children } = link.props

        return (
            <g className="Drawit--LinkShell">
                <LinkComponent model={model}/>
            </g>
        )
    }
}