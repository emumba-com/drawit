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
        const { x: initX, y: initY } = nextValue.points[pointID]
        expect(initX).toNotBe(0)
        expect(initY).toNotBe(0)

        // update values with builder
        createValueBuilder({
            value,
            onChange: _nextValue_ => {
                nextValue = _nextValue_
            },
            conf 
        })()
        .updatePoint(pointID, {
            x: 0,
            y: 0
        })
        .apply()

        // verify if values are correctly updated
        const { x, y } = nextValue.points[pointID]
        expect(x).toBe(0)
        expect(y).toBe(0)
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
})
