import React from 'react'
import PropTypes from 'prop-types'

import { Node, Link } from './conf'
import { LayerNodes, LayerLinks } from './layers'
import { makeUID, toCache } from './utils'

/**
 * Conf
 * {
 *     nodes: {
 *         'default': {
 *              ports: {
 *                  'default': {
 *                      positions: {
 *                          left: {
 *                              top: 'calc(50% - 0.2rem)',
 *                              left: '-0.2rem'
 *                          },
 *                          right: {
 *                              top: 'calc(50% - 0.2rem)',
 *                              right: '-0.2rem'
 *                          }
 *                      }
 *                  }
 *              }
 *         }
 *     }
 * }
 */

const cache = {}
const getNodeByType = (type, children) => {
    if ( !cache[type] ) {
        cache[type] = children.find(child => child.props.type === type)
    }

    return cache[type]
}

const getConf = () => {
    return {}
}

const makePortModels = (props, nodeModel) => {
    // how many ports are required for this node
    const { children } = props
    const node = getNodeByType(nodeModel.type, children.filter(child.type === Node))
    const ports = node.props.children.filter(child.type === Port)

    return {}
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
        const { value } = this.props
        const { nodes = {}, ports = {} } = value

        // can i modify model? no
        // const { id, type } = model
        const newNodeModel =
            Object.assign({
                id: makeUID(),
                type: 'default'
            }, model)

        const newPortModels = makePortModels(this.props, newNodeModel)
        newNodeModel.ports = Object.keys(newPortModels)

        // if new, assign id
        
        // if has an id, ensure it doesn't already exist

        // if it already exists, throw an error

        // ensure a component for give 'type' exists

        this.updateValue({
            nodes: {
                ...nodes,
                [newNodeModel.id]: newNodeModel
            },
            ports: {
                ...ports,
                ...newPortModels
            }
        })

        // return modified model
    }

    addLink( model = {} ) {
        const { value } = this.props
        const { links = [] } = value

        const nextModel =
            Object.assign({
                id: makeUID(),
                type: 'default',
                points: [{
                    x: 0,
                    y: 0
                }, {
                    x: 100,
                    y: 100
                }]
            }, model)

        this.updateValue({
            links: {
                ...links,
                [nextModel.id]: nextModel
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

    render() {
        const { value: pValue = {}, children } = this.props
        const value = { nodes: {}, links: {}, ports: {}, points: {}, ...pValue }

        return (
            <div className="Drawit--Diagram">
                <LayerNodes
                    value={value}
                    onChangeNodeModel={ this.handleChangeNodeModel }>
                    { children.filter(child => child.type === Node) }
                </LayerNodes>
                <LayerLinks
                    value={value}
                    onChangeLinkModel={ this.handleChangeLinkModel }>
                    { children.filter(child => child.type === Link) }
                </LayerLinks>
            </div>
        )
    }
}