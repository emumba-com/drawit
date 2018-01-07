import React from 'react'
import PropTypes from 'prop-types'

import { hasPropChanged } from './utils'

export default class Observer extends React.Component {
    static contextTypes = {
        addEventListener: PropTypes.func,
        removeEventListener: PropTypes.func,
    }
    componentDidMount() {
        const { event, id, handler } = this.props
        const { addEventListener } = this.context

        addEventListener(event, id, handler)
    }
    componentWillUnmount() {
        const { event, id, handler } = this.props
        const { removeEventListener } = this.context

        removeEventListener(event, id, handler)
    }
    componentWillReceiveProps(nextProps) {
        const { addEventListener, removeEventListener } = this.context

        if ( hasPropChanged('id', this.props, nextProps) ) {
            const { event, id, handler } = this.props
            removeEventListener(event, id, handler)

            const { event: nextEvent, id: nextID, handler: nextHandler } = nextProps
            addEventListener(nextEvent, nextID, nextHandler)
        }
    }
    render() {
        return null
    }
}