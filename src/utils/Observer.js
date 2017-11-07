import React from 'react'
import PropTypes from 'prop-types'

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
    render() {
        return null
    }
}