import React from 'react'
import PropTypes from 'prop-types'
import { snapTarget } from '../utils'

@snapTarget({
    type: 'port',
    strength: 10
})
export default class PortShell extends React.Component {
    static propTypes = {
        conf: PropTypes.object.isRequired,
        model: PropTypes.object.isRequired,
    }
    render() {
        const { conf, model } = this.props
        const { component: PortComponent, top, left, bottom, right } = conf
        const style = { top, left, right, bottom }

        return (
            <div className="Drawit--PortShell" style={style}>
                <PortComponent />
            </div>
        )
    }
}