import React from 'react'
import PropTypes from 'prop-types'

export default ({ type = 'default', strength = 1 }) => WrappedElement =>
    class SnapTarget extends React.Component {
        static contextTypes = {
            registerSnapTarget: PropTypes.func,
            unregisterSnapTarget: PropTypes.func,
            getSnapTargetsByType: PropTypes.func
        }
        componentDidMount() {
            this.targetID = this.context.registerSnapTarget(type, strength, this)
        }
        componentWillUnmount() {
            this.context.unregisterSnapTarget(this.targetID)
        }
        render() {
            return <WrappedElement {...this.props}/>
        }
    }