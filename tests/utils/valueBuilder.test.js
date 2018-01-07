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
})
