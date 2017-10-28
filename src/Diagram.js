import React from 'react'
import PropTypes from 'prop-types'

import Node from './Node'
import LayerNodes from './LayerNodes'
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
        console.log('Adding node: ', model)

        const { value } = this.props
        const { nodes = [] } = value

        // can i modify model? no
        // const { id, type } = model
        const isNew = !model.id
        const nextModel = isNew ? { id: makeUID(), ...model } : model

        // if new, assign id
        
        // if has an id, ensure it doesn't already exist

        // if it already exists, throw an error

        // ensure a component for give 'type' exists

        this.updateValue({
            nodes: [...nodes, nextModel]
        })

        // return modified model
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

    render() {
        const { value, children } = this.props
        const { nodes = [] } = value

        const child = children.find(child => child.type === Node)

        if ( !child ) {
            throw new Error(`Node child is required`)
        }

        const { component } = child.props
        
        // console.log('NodeComponent: ', NodeComponent)

        return (
            <div className="Drawit--Diagram">
                <LayerNodes
                    nodes={nodes}
                    component={component}
                    onChangeNodeModel={ this.handleChangeNodeModel }/>
                <div className="Drawit--Diagram--Links">
                </div>
            </div>
        )
    }
}