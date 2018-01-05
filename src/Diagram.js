/* @flow */

import React from 'react'

import { DefaultNode, DefaultLink } from './defaults'
import { buildConf, Node, Link } from './conf'
import { LayerNodes, LayerLinks } from './layers'
import { makeUID, toCache, DragContext, createValueBuilder } from './utils'
import type {
    DiagramProps,
    Configuration,
    NodeSpecification,
    LinkSpecification,
    NodeModel,
    LinkModel,
    PortModel,
    PointModel
} from './types'

export default class Diagram extends React.Component<DiagramProps> {
    conf: Configuration;
    valueBuilder: any;
    
    constructor( props:DiagramProps ) {
        super(props)

        this.updateConf(props)
    }

    addNode( spec: NodeSpecification ) {
        this.valueBuilder()
            .addNode( spec )
            .apply()
    }

    addLink( spec: LinkSpecification ) {
        this.valueBuilder()
            .addLink( spec )
            .apply()
    }

    handleChangeEntityModel = (entityKey: string, entityModel: Object) => {
        // console.log('entityKey: ', entityKey, ', entityModel: ', entityModel)

        const { value } = this.props
        const existingEntityModels = value[entityKey]
        const nextEntityModels = {
            ...existingEntityModels,
            [entityModel.id]: entityModel
        }

        this.valueBuilder({
            ...value,
            [entityKey]: nextEntityModels
        })
        .apply()
    }
    
    // TODO make this an external func
    handleChangeNodeModel = (model: NodeModel) => this.handleChangeEntityModel('nodes', model)
    handleChangeLinkModel = (model: LinkModel) => this.handleChangeEntityModel('links', model)
    handleChangePointModel = (model: PointModel) => this.handleChangeEntityModel('points', model)
    handleChangePortModel = (model: PortModel) => this.handleChangeEntityModel('ports', model)

    componentWillReceiveProps( nextProps: DiagramProps ) {
        // console.log(`[Diagram/componentWillReceiveProps] invoked ...`)
        this.updateConf( nextProps )
    }

    updateConf( props: DiagramProps ) {
        const { onChange, value } = props
        this.conf = buildConf(props)
        this.valueBuilder = createValueBuilder({ value, onChange, conf: this.conf })

        // console.log(`[updateConf] conf: `, this.conf)
    }

    render() {
        const { value: pValue = {}, children } = this.props
        const value = { nodes: {}, links: {}, ports: {}, points: {}, ...pValue }

        // console.log(`[Diagram] Created conf: `, conf)
        // console.log(`[Diagram/render] invoked ...`)

        return (
            <div className="Drawit--Diagram">
                <DragContext>
                    <LayerNodes
                        conf={this.conf}
                        value={value}
                        onChangeEntityModel={ this.handleChangeEntityModel }/>
                    <LayerLinks
                        conf={this.conf}
                        value={value}
                        valueBuilder={this.valueBuilder}
                        onChangeEntityModel={ this.handleChangeEntityModel }/>
                </DragContext>
            </div>
        )
    }
}