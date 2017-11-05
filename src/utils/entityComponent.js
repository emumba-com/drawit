import React from 'react'
import PropTypes from 'prop-types'

export default (pOptions = {}) => WrappedElement => {
    const options = {
        entityType: 'node',
        getModel: props => props.model,
        ...pOptions
    }
    return class EntityComponent extends React.Component {
        static contextTypes = {
            registerMountedEntity: PropTypes.func,
            unregisterMountedEntity: PropTypes.func
        }
        componentDidMount() {
            const model = options.getModel(this.props)
            this.targetID = this.context.registerMountedEntity(model.id, options.entityType, model, this)
        }
        componentWillUnmount() {
            this.context.unregisterMountedEntity(this.targetID)
        }
        render() {
            return <WrappedElement {...this.props}/>
        }
    }
}