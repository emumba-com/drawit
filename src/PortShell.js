import React from 'react'
import PropTypes from 'prop-types'

export default class PortShell extends React.Component {
    static propTypes = {
        port: PropTypes.any
    }
    render() {
        const { port } = this.props
        const { component: PortComponent } = port.props
        return <PortComponent/>
    }
}