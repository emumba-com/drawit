/* @flow */

import { makeUID, toCache } from './utils'
import type {
    PointSpecification,
    PortSpecification,
    NodeSpecification,
    NodeModel,
    PortModel,
    LinkModel,
    PointModel,
    LinkSpecification,
    DiagramModel,
    Configuration,
    Logger
} from '../types'

const applyDefaultsToNodeModelSpec = (spec: NodeSpecification, conf: Configuration): NodeSpecification => {
    const { type = 'default', ports: _portModelSpecs_ } = spec
    const nodeConf = conf.nodes[type]
    
    if ( !nodeConf ) {
        throw `Cannot add node, conf not found for type: ${type}`
    }

    const { positions = {} } = nodeConf
    const portModelSpecs = _portModelSpecs_ || Object.entries(positions)
        .reduce((output, [key, value]) => {
            output[key] = {}
            return output
        }, {})
    
    const ports =
        Object
            .entries(portModelSpecs)
            .reduce((output, [key, value]) => {
                // $FlowFixMe
                output[key] = applyDefaultsToPortModelSpec(value, conf)
                return output
            }, {})

    return {
        type,
        ports,
        ...spec
    }
}

const applyDefaultsToLinkModelSpec = (spec: LinkSpecification, conf: Configuration): LinkSpecification => {
    const { type = 'default', points: _pointModelSpecs_ = [] } = spec
    const linkConf = conf.links[type]
    
    if ( !linkConf ) {
        throw `Cannot add link, conf not found for type: ${type}`
    }

    if ( _pointModelSpecs_.length < 2 ) {
        for ( let i = 0, max = 2 - _pointModelSpecs_.length; i < max;  i++) {
            _pointModelSpecs_.push({})
        }
    }

    const points = _pointModelSpecs_.map((pointSpec: PointSpecification, index: number) => applyDefaultsToPointModelSpec(pointSpec, index, conf))
        
    return {
        ...spec,
        type,
        points
    }
}

const applyDefaultsToPortModelSpec = (spec: PortSpecification, conf: Configuration): PortSpecification => {
    return {
        type: 'default',
        ...spec
    }
}

const applyDefaultsToPointModelSpec = (spec: PointSpecification, index: number, conf: Configuration): PointSpecification => {
    return {
        type: 'default',
        x: index * 100,
        y: index * 100,
        ...spec
    }
}

const buildPortModel = (spec: PortSpecification, parentID: string): PortModel => {
    const id = makeUID()

    return {
        id,
        parentID,
        ...spec
    }
}

const buildNodeModel = (spec: NodeSpecification): { model: NodeModel, ports: PortModel[] } => {
    const id = makeUID()
    const model: NodeModel = {
        ...spec,
        id,
        ports: {},
    }
    const ports = []
    
    Object
        .entries(spec.ports)
        .forEach(([key, portModelSpec]) => {
            // $FlowFixMe
            const port = buildPortModel( portModelSpec, id )
            ports.push( port )

            model.ports[key] = port.id
        }, {})

    
    return {
        model,
        ports
    }
}

const buildPointModel = (spec: PointSpecification, parentID: string): PointModel => {
    const id = makeUID()
    
    return {
        ...spec,
        id,
        parentID
    }
}

const buildLinkModel = (spec: LinkSpecification): { model: LinkModel, points: PointModel[] } => {
    const id = makeUID()
    const model = {
        ...spec,
        id,
        points: [],
    }

    if ( !spec.points ) {
        throw `link spec must contain points`
    }

    const points = spec.points.map((pointSpec: PointSpecification) => buildPointModel(pointSpec, id))
    model.points = points.map(point => point.id)

    return {
        model,
        points
    }
}

export default ({
        value,
        onChange,
        conf,
        logger
    }: {
        value: DiagramModel,
        onChange: (DiagramModel) => void,
        conf: Configuration,
        logger: Logger
    }) => (initialValue: Object) => {

    const builder = {}
    const contextObjects = []
    let nextValue = initialValue || value || {}

    const evaluate = (param) => {
        if ( typeof param === 'function' ) {
            return param.apply(null, [...contextObjects, nextValue])
        }

        return param
    }

    const addNode = ( spec: NodeSpecification = {} ) => {
        const modelSpec = applyDefaultsToNodeModelSpec(spec, conf)
        const { model, ports } = buildNodeModel( modelSpec )
        const portModels = toCache( ports )

        nextValue = {
            ...nextValue,
            nodes: {
                ...nextValue.nodes,
                [model.id]: model,
            },
            ports: {
                // $FlowFixMe
                ...nextValue.ports,
                ...portModels
            }
        }

        contextObjects.push( model )

        return builder
    }

    const updateNode = ( id: string, spec: NodeSpecification ) => {
        const model = nextValue.nodes[id]

        if ( !model ) {
            throw `Node with ID[${id}] was not found`
        }

        const { x = model.x, y = model.y } = spec
        const safeSpec = { x, y }
        const nextModel = {
            ...model,
            ...safeSpec
        }

        nextValue = {
            ...nextValue,
            nodes: {
                ...nextValue.nodes,
                [id]: nextModel
            }
        }
        
        // console.log(`[updateNode] nextModel: `, nextModel, ', nextValue: ', nextValue)

        return builder
    }

    const addLink = ( spec: LinkSpecification = {} ) => {
        const modelSpec = applyDefaultsToLinkModelSpec(spec, conf)
        const { model, points } = buildLinkModel( modelSpec )
        const pointModels = toCache( points )

        nextValue = {
            ...nextValue,
            links: {
                ...nextValue.links,
                [model.id]: model
            },
            points: {
                // $FlowFixMe
                ...nextValue.points,
                ...pointModels
            }
        }

        contextObjects.push( model )

        return builder
    }

    const updatePoint = ( id: string, spec: PointSpecification ) => {
        const model = nextValue.points[id]

        if ( !model ) {
            throw `Point with ID[${id}] was not found`
        }

        const { x = model.x, y = model.y } = spec
        const safeSpec = { x, y }
        const nextModel = {
            ...model, ...safeSpec
        }

        nextValue = {
            ...nextValue,
            points: {
                ...nextValue.points,
                [id]: nextModel
            }
        }

        // console.log(`[updatePoint] nextModel: `, nextModel, ', nextValue: ', nextValue)

        return builder
    }

    const dock = ( _pointID_: string | Function, _portID_: string | Function ) => {
        const pointID = evaluate(_pointID_)
        const portID = evaluate(_portID_)

        const port = nextValue.ports[portID]
        const point = nextValue.points[pointID]

        if ( !port ) {
            throw `Port with ID[${portID}] not found`
        }

        if ( !point ) {
            throw `Point with ID[${pointID}] not found`
        }

        if ( point.dockTarget === portID && (new Set(port.dockedPoints)).has(pointID) ) {
            throw `Point[${pointID}] is already docked at port[${portID}]`
        }

        if ( point.dockTarget ) {
            throw `Point[${pointID}] is already docked with port[${point.dockTarget}]. Undock it first before docking it again.`
        }

        // console.log(`[dockPointToPort] point: `, pointID, ', port: ', portID)
        const dockedPoints = port.dockedPoints || []

        nextValue = {
            ...nextValue,
            ports: {
                ...nextValue.ports,
                [portID]: {
                    ...port,
                    dockedPoints: [...dockedPoints, pointID]
                }
            },
            points: {
                ...nextValue.points,
                [pointID]: {
                    ...point,
                    dockTarget: portID
                }
            }
        }

        return builder
    }

    const undock = ( _pointID_: string ) => {
        const pointID = evaluate(_pointID_)
        const point = nextValue.points[pointID]

        if ( !point ) {
            throw `Point with ID[${pointID}] doesn't exist`
        }

        if ( !point.dockTarget ) {
            throw `Point[${pointID}] doesn't have a dockTarget`
        }

        const portID = point.dockTarget
        const port = nextValue.ports[portID]

        if ( !port ) {
            throw `Port with ID[${portID}] doesn't exist`
        }

        if ( !port.dockedPoints ) {
            throw `Port[${portID}] doesn't have dockedPoints`
        }

        nextValue = {
            ...nextValue,
            points: {
                ...nextValue.points,
                [pointID]: {
                    ...point,
                    dockTarget: null
                }
            },
            ports: {
                ...nextValue.ports,
                [portID]: {
                    ...port,
                    dockedPoints: port.dockedPoints.filter(p => p !== pointID)
                }
            }
        }

        return builder
    }

    const replace = ( value: DiagramModel ) => {
        nextValue = value

        return builder
    }

    const apply = () => {
        // console.log(`apply called with value: `, nextValue)
        onChange( nextValue )

        return builder
    }

    Object.assign(builder, {
        addNode, addLink, updateNode, updatePoint, dock, undock, replace, apply
    })

    return builder
}