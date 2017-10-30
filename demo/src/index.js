import React, {Component} from 'react'
import {render} from 'react-dom'

import {
  Diagram,
  Port,
  Node,
  Link,
  DefaultNode,
  DefaultLink,
  DefaultPort
 } from '../../src'
import NodeCircle from './NodeCircle'
import NodeDiamond from './NodeDiamond'
import './style.css'

const LS_KEY = 'drawit-diagram-model'

const delay = (f, timestamp) => (...args) =>
  setTimeout(() => f(...args), timestamp)

class Demo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: JSON.parse(localStorage.getItem(LS_KEY) || '{}')
    }

    window.demo = this
  }
  handleChange = (value, e) => {
    this.setState({ value })

    localStorage.setItem(LS_KEY, JSON.stringify(value))
  }
  handleClickAddNode = e => {
    this.refs.diagram.addNode({
      title: 'Test Node'
    })
  }
  handleClickAddCircle = e => {
    this.refs.diagram.addNode({
      type: 'circle',
      title: 'Circle'
    })
  }
  handleClickAddDiamond = e => {
    this.refs.diagram.addNode({
      type: 'diamond',
      title: 'Diamond'
    })
  }
  render() {
    const { value } = this.state

    return (
      <div>
        <h1>drawit Demo</h1>
        <button onClick={this.handleClickAddNode}>Add Node</button>
        <button onClick={this.handleClickAddCircle}>Add Circle</button>
        <button onClick={this.handleClickAddDiamond}>Add Diamond</button>
        <Diagram ref="diagram" value={value} onChange={this.handleChange}>
          <Node type="default" component={ DefaultNode }>
            <Port top="calc(50% - 0.2rem)" left="-0.2rem" component={ DefaultPort }/>
            <Port top="calc(50% - 0.2rem)" right="-0.2rem" component={ DefaultPort }/>
          </Node>
          <Node type="circle" component={ NodeCircle }>
            <Port top="calc(50% - 0.2rem)" left="-0.2rem" component={ DefaultPort }/>
            <Port top="calc(50% - 0.2rem)" right="-0.2rem" component={ DefaultPort }/>
          </Node>
          <Node type="diamond" component={ NodeDiamond }>
            <Port top="calc(50% - 0.2rem)" left="-1rem" component={ DefaultPort }/>
            <Port top="calc(50% - 0.2rem)" right="-1rem" component={ DefaultPort }/>
          </Node>
          <Link type="default" component={ DefaultLink }/>
        </Diagram>
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#demo'))
