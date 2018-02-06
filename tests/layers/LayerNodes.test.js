import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import LayerNodes from 'src/layers/LayerNodes'

describe('layers/LayerNodes.test.js', () => {
    let node

    beforeEach(() => {
        node = document.createElement('div')
    })

    afterEach(() => {
        unmountComponentAtNode(node)
    })

    it('exists', () => {
        expect(LayerNodes).toExist()
    })
})