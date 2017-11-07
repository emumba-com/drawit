import React from 'react'
import PropTypes from 'prop-types'

export default options => WrappedElement =>
    class EventSource extends React.Component {
        static contextTypes = {
            triggerEvent: PropTypes.func
        }

        render() {
            const { triggerEvent } = this.context
            return <WrappedElement {...this.props} triggerEvent={triggerEvent}/>
        }
    }