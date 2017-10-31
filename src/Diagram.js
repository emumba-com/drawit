import React from 'react'
import PropTypes from 'prop-types'

import Node from './Node'
import Link from './Link'
import LayerNodes from './LayerNodes'
import LayerLinks from './LayerLinks'
import { makeUID } from './utils'

export default class Diagram extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        value: PropTypes.object,
        onChange: PropTypes.func
    }

    updateValue(nextProps) {
        const { value, onChange = () => {} } = this.props

        onChange({
            ...value,
            ...nextProps
        })
    }

    addNode( model ) {
        const { value } = this.props
        const { nodes = [] } = value

        // can i modify model? no
        // const { id, type } = model
        const nextModel =
            Object.assign({
                id: makeUID(),
                type: 'default'
            }, model)

        // if new, assign id
        
        // if has an id, ensure it doesn't already exist

        // if it already exists, throw an error

        // ensure a component for give 'type' exists

        this.updateValue({
            nodes: [...nodes, nextModel]
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
            links: [...links, nextModel]
        })
    }

    handleChangeNodeModel = model => {
        const { value: { nodes } } = this.props
        const nextNodes = [...nodes]

        const node = nextNodes.find(n => n.id === model.id)
        Object.assign(node, model)

        this.updateValue({
            nodes: nextNodes
        })
    }

    handleChangeLinkModel = model => {
        // console.log('link model updated: ', model)
        const { value: { links } } = this.props
        const nextLinks = [...links]

        const link = nextLinks.find(n => n.id === model.id)
        Object.assign(link, model)

        this.updateValue({
            links: nextLinks
        })
    }

    render() {
        const { value, children } = this.props
        const { nodes: nodeModels = [], links: linkModels = [] } = value

        return (
            <div className="Drawit--Diagram">
                <LayerNodes
                    models={nodeModels}
                    onChangeNodeModel={ this.handleChangeNodeModel }>
                    { children.filter(child => child.type === Node) }
                </LayerNodes>
                <LayerLinks
                    models={linkModels}
                    onChangeLinkModel={ this.handleChangeLinkModel }>
                    { children.filter(child => child.type === Link) }
                </LayerLinks>
            </div>
        )
    }
}