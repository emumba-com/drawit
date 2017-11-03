import React from 'react'
import PropTypes from 'prop-types'

import { makeUID } from './utils'

const snapTargets = {}

export default class DragContext extends React.Component {
    static childContextTypes = {
        registerSnapTarget: PropTypes.func,
        unregisterSnapTarget: PropTypes.func,
        getSnapTargetsByType: PropTypes.func
    }
    registerSnapTarget = (type, strength, target) => {
        // console.log('Registering snap target')
        const uid = makeUID()

        snapTargets[uid] = {
            uid,
            type,
            strength,
            target
        }
    }
    unregisterSnapTarget = uid => {
        delete snapTargets[uid]
    }
    getSnapTargetsByType = types =>
        Object
            .keys(snapTargets)
            .map(key => snapTargets[key])
            .filter(({ type }) => types.indexOf(type) > -1)
            
    getChildContext() {
        return {
            registerSnapTarget: this.registerSnapTarget,
            unregisterSnapTarget: this.unregisterSnapTarget,
            getSnapTargetsByType: this.getSnapTargetsByType
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