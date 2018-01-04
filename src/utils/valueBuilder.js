import { makeUID, toCache } from './utils'

const applyDefaultsToPortModelSpec = (modelSpec, conf) => {
    return {
        type: 'default',
        ...modelSpec
    }
}

const applyDefaultsToNodeModelSpec = (modelSpec, conf) => {
    const { type = 'default', ports: _portModelSpecs_ } = modelSpec
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
    
    const ports = Object.entries(portModelSpecs)
        .reduce((output, [key, value]) => {
            output[key] = applyDefaultsToPortModelSpec(value)
            return output
        }, {})

    return {
        type,
        ports,
        ...modelSpec
    }
}

const applyDefaultsToPointModelSpec = (modelSpec, conf) => {
    
}

const applyDefaultsToLinkModelSpec = (modelSpec, conf) => {

}

const buildPortModel = (modelSpec, parentID) => {
    const id = makeUID()

    return {
        id,
        parentID,
        ...modelSpec
    }
}

const buildNodeModel = modelSpec => {
    const id = makeUID()
    const ports = 
        Object
        .entries(modelSpec.ports)
        .reduce((output, [key, portModelSpec]) => {
            output[key] = buildPortModel( portModelSpec, id )

            return output
        }, {})

    return {
        id,
        ports,
        ...modelSpec
    }
}

export default ({ onChange, conf }) => ( initialValue = {} ) => {
    const builder = {}
    const contextObjects = []
    let nextValue = initialValue

    const addNode = ( _modelSpec_ = {} ) => {
        const modelSpec = applyDefaultsToNodeModelSpec(_modelSpec_, conf)
        const model = buildNodeModel( modelSpec )
        const portModels = toCache(Object.values(model.ports))

        model.ports =
            Object
                .entries(model.ports)
                .reduce((output, [position, portModel]) => {
                    output[position] = portModel.id
                    return output
                }, {})

        nextValue = {
            ...nextValue,
            nodes: {
                ...nextValue.nodes,
                [model.id]: model,
            },
            ports: {
                ...nextValue.ports,
                ...portModels
            }
        }

        contextObjects.push( model )

        return builder
    }

    const addLink = ( model = {} ) => {
        console.log(`addLink called`)
        return builder
    }

    const dockPointToPort = ( _pointID_, _portID_ ) => {
        // const pointID = evaluate(_pointID_)
        // const portID = evaluate(_portID_)

        // console.log(`dockPointToPort called`)
        return builder
    }

    const apply = () => {
        // console.log(`apply called`)
        onChange( nextValue )

        return builder
    }

    Object.assign(builder, {
        addNode, addLink, dockPointToPort, apply
    })

    return builder
}