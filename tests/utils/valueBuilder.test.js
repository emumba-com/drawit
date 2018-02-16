import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import createValueBuilder from 'src/utils/valueBuilder'
import sampleValue from './sampleValue'

describe('utils/valueBuilder', () => {
    const value = sampleValue
    const onChange = () => {}
    const conf = {}

    it('exists', () => {
        expect(createValueBuilder).toExist()
    })

    it('is a function', () => {
        expect(createValueBuilder).toBeA('function')
    })

    it('returns a function', () => {
        expect(createValueBuilder({
            value,
            onChange,
            conf 
        })).toBeA('function')
    })

    it('returns a function that returns an object', () => {
        expect(createValueBuilder({
            value,
            onChange,
            conf 
        })()).toBeA('object')
    })

    it('updates a point correctly', () => {
        let nextValue = value
        const pointID = '61c3c50b-f2ee-45a4-8d91-74e7941ff5a7'
        
        // verify initial value not to be zero
        const {
            // non-referential data
            x:          initX,
            y:          initY,
            type:       initType,

            // referential data
            id:         initID,
            parentID:   initParentID,
            dockTarget: initDockTarget
        } = nextValue.points[pointID]

        expect(initX).toNotBe(0)
        expect(initY).toNotBe(0)
        expect(initType).toNotBe('dummy')
        expect(initID).toNotBe('dummy')
        expect(initParentID).toNotBe('dummy')
        expect(initDockTarget).toNotBe('dummy')

        // update values with builder
        createValueBuilder({
            value,
            onChange: _nextValue_ => {
                nextValue = _nextValue_
            },
            conf 
        })()
        .updatePoint(pointID, {
            // attempt updating non-referential data
            x:          0,
            y:          0,
            type:       'dummy',

            // attempt updating referential data
            id:         'dummy',
            parentID:   'dummy',
            dockTarget: 'dummy'
        })
        .apply()

        // verify if values are correctly updated
        const { x, y, type, id, parentID, dockTarget } = nextValue.points[pointID]
        expect(x).toBe(0)
        expect(y).toBe(0)
        expect(type).toBe('dummy')

        // referential data should remain the same
        expect(id).toNotBe('dummy')
        expect(parentID).toNotBe('dummy')
        expect(dockTarget).toNotBe('dummy')
    })

    it('undocks a point correctly', () => {
        let nextValue = value
        const pointID = '61c3c50b-f2ee-45a4-8d91-74e7941ff5a7'
        
        // verify we have a dock target
        const { dockTarget: initialDockTarget } = nextValue.points[pointID]
        expect(initialDockTarget).toExist()
        
        // verify this port has current point present in its `dockedPoints`
        const port = nextValue.ports[initialDockTarget]
        expect(port.dockedPoints).toInclude(pointID)

        // update values with builder
        createValueBuilder({
            value,
            onChange: _nextValue_ => {
                nextValue = _nextValue_
            },
            conf 
        })()
        .undock(pointID)
        .apply()

        // verify dockTarget is undefined
        const { dockTarget } = nextValue.points[pointID]
        expect(dockTarget).toNotExist()

        // verify if node is also updated
        const nextPort = nextValue.ports[initialDockTarget]
        expect(nextPort.dockedPoints).toNotInclude(pointID)
    })

    it('docks a point correctly', () => {
        let nextValue = value
        const pointID = '61c3c50b-f2ee-45a4-8d91-74e7941ff5a7'
        
        // verify we have a dock target
        const { dockTarget: initialDockTarget } = nextValue.points[pointID]
        expect(initialDockTarget).toExist()
        
        // verify this port has current point present in its `dockedPoints`
        const port = nextValue.ports[initialDockTarget]
        expect(port.dockedPoints).toInclude(pointID)

        // update values with builder
        const builder = createValueBuilder({
            value,
            onChange: _nextValue_ => {
                nextValue = _nextValue_
            },
            conf 
        })()
        .undock(pointID)
        .apply()

        // verify dockTarget is undefined
        const { dockTarget } = nextValue.points[pointID]
        expect(dockTarget).toNotExist()

        // verify if node is also updated
        const nextPort = nextValue.ports[initialDockTarget]
        expect(nextPort.dockedPoints).toNotInclude(pointID)

        // redock
        builder
            .dock(pointID, initialDockTarget)
            .apply()
        
        // verify we have a dock target
        const { dockTarget: finalDockTarget } = nextValue.points[pointID]
        expect(finalDockTarget).toExist()
        
        // verify this port has current point present in its `dockedPoints`
        const finalPort = nextValue.ports[finalDockTarget]
        expect(finalPort.dockedPoints).toInclude(pointID)
    })

    it('updates a node correctly', () => {
        let nextValue = value
        const nodeID = '3f173971-3c81-4f4a-90a8-65f6a3a880e5'
        
        // verify initial value not to be zero
        const {
            x:     initX,
            y:     initY,
            type:  initType,
            id:    initID,
            ports: initPorts,
        } = nextValue.nodes[nodeID]

        expect(initX).toNotBe(0)
        expect(initY).toNotBe(0)
        expect(initType).toNotBe('execution')
        expect(initID).toBe(nodeID)
        expect(initPorts).toNotBe('dummy')

        // update values with builder
        createValueBuilder({
            value,
            onChange: _nextValue_ => {
                nextValue = _nextValue_
            },
            conf 
        })()
        .updateNode(nodeID, {
            // attempt updating non-referential data
            x: 0,
            y: 0,
            type: 'execution',

            // attempt updating referential data
            id: 'dummy',
            ports: 'dummy'
        })
        .apply()

        // verify if values are correctly updated
        const { id, x, y, type, ports } = nextValue.nodes[nodeID]
        expect(x).toBe(0)
        expect(y).toBe(0)
        expect(type).toBe('execution')

        // referential data shouldn't be updated
        expect(id).toBe(initID)
        expect(ports).toBe(initPorts)
    })

    it('removes a point correctly', () => {
        let nextValue = value
        const pointID = '61c3c50b-f2ee-45a4-8d91-74e7941ff5a7'
        
        // undock the point from any port
        // remove it        

        expect(value.points).toIncludeKey(pointID)

        const {
            parentID,
            dockTarget
        } = nextValue.points[pointID]

        const initParentLink = value.links[parentID]
        const initTargetPort = value.ports[dockTarget]

        expect(initParentLink.points).toInclude(pointID)
        expect(initTargetPort.dockedPoints).toInclude(pointID)
        
        // update values with builder
        createValueBuilder({
            value,
            onChange: _nextValue_ => {
                nextValue = _nextValue_
            },
            conf 
        })()
        .removePoint(pointID)
        .apply()

        // verify if values are correctly updated
        const parentLink = nextValue.links[parentID]
        const targetPort = nextValue.ports[dockTarget]

        expect(nextValue.points).toExcludeKey(pointID)
        expect(parentLink.points).toExclude(pointID)
        expect(targetPort.dockedPoints).toExclude(pointID)
    })

    it('removes a link correctly', () => {
        let nextValue = value
        const linkID = '8541311f-9ac9-4457-b307-22eb300d6972'
        const link = nextValue.links[linkID]

        const linkPoints = link.points
        const dockTargets = {}

        // undock the point from any port
        // remove it        

        expect(nextValue.links).toIncludeKey(linkID)
        link.points.forEach(pointID => {
            expect(nextValue.points).toIncludeKey(pointID)

            const point = nextValue.points[pointID]

            if ( point.dockTarget ) {
                const targetPort = nextValue.ports[point.dockTarget]

                dockTargets[pointID] = point.dockTarget
                expect(targetPort.dockedPoints).toInclude(pointID)
            }
        })

        // update values with builder
        createValueBuilder({
            value,
            onChange: _nextValue_ => {
                nextValue = _nextValue_
            },
            conf 
        })()
        .removeLink(linkID)
        .apply()

        expect(nextValue.links).toExcludeKey(linkID)
        expect(nextValue.points).toExcludeKeys(linkPoints)

        Object.keys(dockTargets).forEach(pointID => {
            const portID = dockTargets[pointID]
            const port = nextValue.ports[portID]
            expect(port.dockedPoints).toExclude(pointID)
        })
    })

    it('removes a port correctly', () => {
        let nextValue = value
        // console.log('target port: ', value.ports[portID])

        const portID = '25d7949f-2799-4c90-b380-8693376304bf'
        
        // undock all the points from the port
        // clear ref in parent node
        // remove it        

        expect(nextValue.ports).toIncludeKey(portID)

        const {
            parentID,
            dockedPoints
        } = nextValue.ports[portID]

        const initParentNode = value.nodes[parentID]
        // console.log('port: ', nextValue.ports[portID])
        // console.log('dockedPoints: ', dockedPoints)
        const initDockedPointModels = dockedPoints.map(pointID => value.points[pointID])

        // console.log('dockedPointModels: ', initDockedPointModels)
        expect(initParentNode.ports.bottom).toBe(portID)
        expect(initDockedPointModels.map(point => point.dockTarget)).toInclude(portID)
        
        // update values with builder
        createValueBuilder({
            value,
            onChange: _nextValue_ => {
                nextValue = _nextValue_
            },
            conf 
        })()
        .removePort(portID)
        .apply()

        // verify if values are correctly updated
        const parentNode = nextValue.nodes[parentID]
        const dockedPointModels = dockedPoints.map(pointID => nextValue.points[pointID])

        expect(nextValue.ports).toExcludeKey(portID)
        expect(parentNode.ports.bottom).toNotExist()
        expect(dockedPointModels.map(point => point.dockTarget)).toExclude(portID)
    })

    it('removes a node correctly', () => {
        let nextValue = value
        const nodeID = '8ee71a4f-8ae3-4a62-bf11-e026ba47c5bd'
        
        // remove all ports
        // remove node      

        expect(nextValue.nodes).toIncludeKey(nodeID)

        const {
            ports
        } = nextValue.nodes[nodeID]

        expect(nextValue.ports).toIncludeKeys( Object.values(ports) )

        // update values with builder
        createValueBuilder({
            value,
            onChange: _nextValue_ => {
                nextValue = _nextValue_
            },
            conf 
        })()
        .removeNode(nodeID)
        .apply()

        // verify if values are correctly updated
        expect(nextValue.nodes).toExcludeKey(nodeID)
        expect(nextValue.ports).toExcludeKeys( Object.values(ports) )
    })
})
