/* @flow */

import * as React from 'react'

import { DefaultNode, DefaultLink } from './defaults'
import { buildConf, Node, Link } from './conf'
import { LayerNodes, LayerLinks } from './layers'
import { makeUID, toCache, DragContext, createValueBuilder, createLogger } from './utils'
import type {
    Configuration,
    NodeSpecification,
    LinkSpecification,
    NodeModel,
    LinkModel,
    PortModel,
    PointModel,
    LogLevel,
    Logger
} from './types'

type Props = {
    value: any,
    logLevel: LogLevel,
    onChange: Function,
    children?: React.Node
}

export default class Diagram extends React.Component<Props> {
    logger: Logger;
    conf: Configuration;
    valueBuilder: any;
    
    constructor( props:Props ) {
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

    componentWillReceiveProps( nextProps: Props ) {
        // console.log(`[Diagram/componentWillReceiveProps] invoked ...`)
        this.updateConf( nextProps )
    }

    updateConf( props: Props ) {
        const { onChange, value, logLevel = 'silent' } = props

        this.logger = createLogger( logLevel )
        this.conf = buildConf(props)
        this.valueBuilder = createValueBuilder({
            value,
            onChange,
            conf: this.conf,
            logger: this.logger
        })

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