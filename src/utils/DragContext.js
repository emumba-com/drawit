import React from 'react'
import PropTypes from 'prop-types'

import { makeUID } from './utils'

const mountedEntities = {}
const listeners = {}

const ensureListenerStructure = (event, id) => {
    if ( !listeners[event] ) {
        listeners[event] = {}
    }

    if ( !listeners[event][id] ) {
        listeners[event][id] = []
    }
}

export default class DragContext extends React.Component {
    static childContextTypes = {
        registerMountedEntity: PropTypes.func,
        unregisterMountedEntity: PropTypes.func,
        getMountedEntityByID: PropTypes.func,
        getMountedEntitiesByType: PropTypes.func,
        triggerEvent: PropTypes.func,
        addEventListener: PropTypes.func,
        removeEventListener: PropTypes.func
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

    triggerEvent = (type, id, event) => {
        // console.log(`event of type[${type}] triggered: `, event)
        ensureListenerStructure(type, id)

        listeners[type][id].forEach(listener => listener(event))
    }

    addEventListener = (event = 'default', id = 'default', listener) => {
        ensureListenerStructure(event, id)

        listeners[event][id].push(listener)
    }

    removeEventListener = (event = 'default', id = 'default', listener) => {
        ensureListenerStructure(event, id)

        listeners[event][id].splice(listeners[event].indexOf(handler), 1)
    }

    getChildContext() {
        const {
            registerMountedEntity,
            unregisterMountedEntity,
            getMountedEntityByID,
            getMountedEntitiesByType,

            triggerEvent,
            addEventListener,
            removeEventListener
        } = this

        return {
            registerMountedEntity,
            unregisterMountedEntity,
            getMountedEntityByID,
            getMountedEntitiesByType,

            triggerEvent,
            addEventListener,
            removeEventListener
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