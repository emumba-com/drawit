import React from 'react'
import PropTypes from 'prop-types'

export default ({ type = 'default', strength = 1 }) => WrappedElement =>
    class SnapTarget extends React.Component {
        render() {
            return <WrappedElement {...this.props}/>
        }
    }