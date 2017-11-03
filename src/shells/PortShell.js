import React from 'react'
import PropTypes from 'prop-types'
import { snapTarget } from '../utils'

@snapTarget({
    key: 'port',
    strength: 5
})
export default class PortShell extends React.Component {
    static propTypes = {
        conf: PropTypes.any
    }
    render() {
        const { conf } = this.props
        const { component: PortComponent, top, left, bottom, right } = conf
        const style = { top, left, right, bottom }

        return (
            <div className="Drawit--PortShell" style={style}>
                <PortComponent />
            </div>
        )
    }
}