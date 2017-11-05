import React from 'react'
import PropTypes from 'prop-types'

import { makeUID } from './utils'

const mountedEntities = {}

export default class DragContext extends React.Component {
    static childContextTypes = {
        registerMountedEntity: PropTypes.func,
        unregisterMountedEntity: PropTypes.func,
        getMountedEntityByID: PropTypes.func,
        getMountedEntitiesByType: PropTypes.func
    }
    registerMountedEntity = (id, type, model, mountedElement) => {
        // console.log('Registering snap target')
        mountedEntities[id] = {
            id, type, model, mountedElement
        }

        // console.log(`[DragContext] entity count: ${Object.keys(mountedEntities).length}`)

        return id
    }
    unregisterMountedEntity = id => {
        delete mountedEntities[id]
    }
    getMountedEntityByID = id => mountedEntities[id]
    getMountedEntitiesByType = types =>
        Object
            .keys(mountedEntities)
            .map(key => mountedEntities[key])
            .filter(({ type }) => (Array.isArray(types) ? types : [types]).indexOf(type) > -1)

    getChildContext() {
        const { registerMountedEntity, unregisterMountedEntity, getMountedEntityByID, getMountedEntitiesByType } = this

        return {
            registerMountedEntity, unregisterMountedEntity, getMountedEntityByID, getMountedEntitiesByType
        }
    }
    render() {
        const { children } = this.props

        return (
            <div>
                {children}
            </div>
        )
    }
}