import React from 'react'
import PropTypes from 'prop-types'

import { DefaultNode, DefaultLink } from './defaults'
import { buildConf, Node, Link } from './conf'
import { LayerNodes, LayerLinks } from './layers'
import { makeUID, toCache } from './utils'

const createPortModel = ( pModel = {}, parentID, position ) => {
    /**
     * model: {
     *      id,
     *      type,
     *      parentID,
     *      position
     * }
     */

    return {
        id: makeUID(),
        type: 'default',
        parentID,
        position,
        ...pModel
    }
}

const createPointModel = ( pModel = {}, parentID ) => {
    return {
        id: makeUID(),
        type: 'default',
        parentID,
        x: 0,
        y: 0,
        ...pModel
    }
}

export default class Diagram extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        value: PropTypes.object,
        onChange: PropTypes.func
    }

    // TODO make this an external func
    updateValue(nextProps) {
        const { value, onChange = () => {} } = this.props

        onChange({
            ...value,
            ...nextProps
        })
    }

    addNode( model ) {
        /**
         * model: {
         *      id,
         *      type,
         *      ports: {
         *          left: portID,
         *          top: portID
         *      }
         * }
         */

        const { value } = this.props
        const { nodes = {}, ports = {} } = value

        // can i modify model? no
        // const { id, type } = model
        const newNodeModel =
            Object.assign({
                id: makeUID(),
                type: 'default',
                ports: {
                    left: {
                        type: 'default'
                    },
                    right: {
                        type: 'default'
                    }
                }
            }, model)
        
        const newPortModels = Object.keys(newNodeModel.ports).reduce((output, key) => {
            const portModel = createPortModel(newNodeModel.ports[key], newNodeModel.id, key)
            output[key] = portModel

            return output
        }, {})

        newNodeModel.ports = Object.keys(newPortModels).reduce((output, key) => {
            output[key] = newPortModels[key].id

            return output
        }, {})

        this.updateValue({
            nodes: {
                ...nodes,
                [newNodeModel.id]: newNodeModel
            },
            ports: {
                ...ports,
                ...Object.keys(newPortModels).reduce((output, key) => {
                    const portModel = newPortModels[key]
                    output[portModel.id] = portModel

                    return output
                }, {})
            }
        })

        // return modified model
    }

    addLink( model = {} ) {
        const { value } = this.props
        const { links = [], points = [] } = value

        const nextModel =
            Object.assign({
                id: makeUID(),
                type: 'default',
                points: [{
                    x: 0,
                    y: 0,
                    type: 'default'
                }, {
                    x: 100,
                    y: 100,
                    type: 'default'
                }]
            }, model)
        
        const newPointModels = nextModel.points.map(model => createPointModel(model, nextModel.id))
        nextModel.points = newPointModels.map(model => model.id)

        this.updateValue({
            links: {
                ...links,
                [nextModel.id]: nextModel
            },
            points: {
                ...points,
                ...toCache(newPointModels)
            }
        })
    }

    // TODO make this an external func
    handleChangeNodeModel = model => {
        const { value: { nodes } } = this.props
        const nextNodes = {
            ...nodes,
            [model.id]: model
        }

        this.updateValue({
            nodes: nextNodes
        })
    }

    // TODO make this an external func
    handleChangeLinkModel = model => {
        // console.log('link model updated: ', model)
        const { value: { links } } = this.props
        const nextLinks = {
            ...links,
            [model.id]: model
        }

        this.updateValue({
            links: nextLinks
        })
    }

    handleChangePointModel = model => {
        const { value: { points } } = this.props
        const nextPoints = {
            ...points,
            [model.id]: model
        }

        this.updateValue({
            points: nextPoints
        })
    }

    render() {
        const { value: pValue = {}, children } = this.props
        const value = { nodes: {}, links: {}, ports: {}, points: {}, ...pValue }
        const conf = buildConf(this)

        // console.log(`[Diagram] Created conf: `, conf)

        return (
            <div className="Drawit--Diagram">
                <LayerNodes
                    conf={conf}
                    value={value}
                    onChangeNodeModel={ this.handleChangeNodeModel }/>
                <LayerLinks
                    conf={conf}
                    value={value}
                    onChangePointModel={ this.handleChangePointModel }/>
            </div>
        )
    }
}