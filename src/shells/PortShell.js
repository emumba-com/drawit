import React from 'react'
import PropTypes from 'prop-types'

export default class PortShell extends React.Component {
    static propTypes = {
        port: PropTypes.any
    }
    render() {
        const { port } = this.props
        const { component: PortComponent, top, left, bottom, right } = port.props
        const style = { top, left, right, bottom }

        return (
            <div className="Drawit--PortShell" style={style}>
                <PortComponent />
            </div>
        )
    }
}