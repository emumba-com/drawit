import React from 'react'
import PropTypes from 'prop-types'

import { DefaultNode, DefaultLink } from './defaults'
import { buildConf, Node, Link } from './conf'
import { LayerNodes, LayerLinks } from './layers'
import { makeUID, toCache } from './utils'

const cache = {}
const getNodeByType = (type, children) => {
    if ( !cache[type] ) {
        cache[type] = children.find(child => child.props.type === type)
    }

    return cache[type]
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

        // const newPortModels = makePortModels(this.props, newNodeModel)
        // newNodeModel.ports = Object.keys(newPortModels)

        // if new, assign id
        
        // if has an id, ensure it doesn't already exist

        // if it already exists, throw an error

        // ensure a component for give 'type' exists

        this.updateValue({
            nodes: {
                ...nodes,
                [newNodeModel.id]: newNodeModel
            },
/*            ports: {
                ...ports,
                ...newPortModels
            }
        */        })

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
                    y: 0,
                    type: 'default'
                }, {
                    x: 100,
                    y: 100,
                    type: 'default'
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
                    onChangeLinkModel={ this.handleChangeLinkModel }/>
            </div>
        )
    }
}