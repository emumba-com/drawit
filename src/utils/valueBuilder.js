/* @flow */

import { makeUID, toCache, without, difference, intersection } from './utils'
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

const buildPortModel = (spec: PortSpecification, parentID: string, position: string): PortModel => {
    const id = makeUID()

    return {
        id,
        parentID,
        position,
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
            const port = buildPortModel( portModelSpec, id, key )
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
    let nextValue: DiagramModel = initialValue || value || {}

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

    /**
     * Updates a node's type, and takes care of all of the side effects.
     * 
     * @param {string} id - Node ID
     * @param {string} type - The type that is needed to be set.
     * @return {Object} - Current ValueBuilder instance
     */
    const updateNodeType = ( id: string, type: string ) => {
        const model = nextValue.nodes[id]

        if ( !model ) {
            throw `Node with ID[${id}] was not found`
        }

        if ( !type || !type.trim() ) {
            throw `Node with ID[${id}] cannot be set of type '${type}'`
        }

        if ( model.type === type ) {
            throw `Node with ID[${id}] is already of type '${type}'`
        }

        // A = ports in the current type conf
        // B = ports in the next type conf

        // INTERSECTION(A, B) = ports to keep as they are
        // A - B = ports to be deleted
        // B - A = ports to be created

        const prevPositions = conf.nodes[model.type].positions
        const prevPositionKeys = Object.keys(prevPositions)

        const nextPositions = conf.nodes[type].positions
        const nextPositionKeys = Object.keys(nextPositions)

        const common = intersection(prevPositionKeys, nextPositionKeys)
        const toDelete = difference(prevPositionKeys, nextPositionKeys)
        const toCreate = difference(nextPositionKeys, prevPositionKeys)
        const portsCreated = {}
        const portsCreatedByPositionKeys = {}

        toDelete
            .map(positionKey => model.ports[positionKey])
            .forEach(removePort)

        toCreate
            .forEach(positionKey => {
                const portConf = nextPositions[positionKey]
                const portSpec = applyDefaultsToPortModelSpec({}, portConf)
                const portModel = buildPortModel(portSpec, id, positionKey)

                portsCreated[portModel.id] = portModel
                portsCreatedByPositionKeys[positionKey] = portModel.id
            })

        const nextModel = {
            // ...model, // <-- expired by now, since it still contains deleted ports
            ...nextValue.nodes[id],
            type,
            ports: {
                ...nextValue.nodes[id].ports,
                ...portsCreatedByPositionKeys
            }
        }

        nextValue = {
            ...nextValue,
            nodes: {
                ...nextValue.nodes,
                [id]: nextModel
            },
            ports: {
                ...nextValue.ports,
                ...portsCreated
            }
        }

        return builder
    }

    const updateNode = ( id: string, spec: NodeSpecification ) => {
        const model = nextValue.nodes[id]

        if ( !model ) {
            throw `Node with ID[${id}] was not found`
        }

        const safeSpec = without(spec, 'id', 'ports', 'type')
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
        
        if ( spec.type && model.type !== spec.type ) {
            updateNodeType(model.id, spec.type)
        }

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

    const removePoint = ( id: string ) => {
        const model = nextValue.points[id]
        const { [id]: thisPoint, ...remainingPoints } = nextValue.points
        const parentLink = nextValue.links[thisPoint.parentID]
        parentLink.points = without(parentLink.points, id)

        nextValue = {
            ...nextValue,
            points: {
                ...remainingPoints
            },
            links: {
                ...nextValue.links,
                [parentLink.id]: parentLink
            }
        }

        if ( thisPoint.dockTarget ) {
            const targetPort = nextValue.ports[thisPoint.dockTarget]

            nextValue = {
                ...nextValue,
                ports: {
                    ...nextValue.ports,
                    [targetPort.id]: {
                        ...targetPort,
                        dockedPoints: without(targetPort.dockedPoints, id)
                    }
                }
            }
        }

        return builder
    }
    
    const removeLink = ( id: string ) => {
        const link = nextValue.links[id]
        const remainingLinks = without(nextValue.links, id)

        link.points.forEach(removePoint)

        nextValue = {
            ...nextValue,
            links: remainingLinks
        }

        return builder
    }

    const removePort = ( id: string ) => {
        // undock all of the docked points
        // remove reference from parent node
        // remove item from list

        const port = nextValue.ports[id]
        const parentNode = nextValue.nodes[port.parentID]

        nextValue = {
            ...nextValue,
            nodes: {
                ...nextValue.nodes,
                [parentNode.id]: {
                    ...parentNode,
                    ports: without(parentNode.ports, port.position)
                }
            },
            ports: without(nextValue.ports, id)
        }

        if ( port.dockedPoints ) {
            port.dockedPoints.forEach(pointID => {
                const point = nextValue.points[pointID]

                nextValue = {
                    ...nextValue,
                    points: {
                        ...nextValue.points,
                        [pointID]: without(point, 'dockTarget')
                    }
                }
            })
        }

        return builder
    }

    const removeNode = ( id: string ) => {
        const node = nextValue.nodes[id]
        
        // $FlowFixMe
        Object.values(node.ports).forEach(removePort)

        nextValue = {
            ...nextValue,
            nodes: without(nextValue.nodes, id)
        }

        return builder
    }

    const updatePoint = ( id: string, spec: PointSpecification ) => {
        const model = nextValue.points[id]

        if ( !model ) {
            throw `Point with ID[${id}] was not found`
        }

        // const { x = model.x, y = model.y } = spec
        const safeSpec = without(spec, 'id', 'parentID', 'dockTarget')
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

    const getValue = () => JSON.parse(JSON.stringify(nextValue))

    Object.assign(builder, {
        addNode,
        addLink,
        removePoint,
        removeLink,
        removePort,
        removeNode,
        updateNode,
        updateNodeType,
        updatePoint,
        dock,
        undock,
        replace,
        apply,
        evaluate,
        value: getValue
    })

    return builder
}