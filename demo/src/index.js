import React, {Component} from 'react'
import {render} from 'react-dom'

import {
  Diagram,
  Port,
  Node,
  Link,
  Point,
  Position,
  DefaultNode,
  DefaultLink,
  DefaultPort,
  DefaultPoint
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
      value: JSON.parse(localStorage.getItem(LS_KEY)) || {},
      enableDragging: true
    }
    window.demo = this
  }
  handleChange = (value, e) => {
    // console.log('[demo/index] Updating value: ', value)

    this.setState({value})
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
  handleClickAddLink = e => {
    this.refs.diagram.addLink()
  }
  handleClickDragging = e => {
    const { enableDragging } = this.state
    this.setState({
      enableDragging: !enableDragging
    })
  }

  handleClickClear = e => {
    if ( !confirm('Sure?') ) {
      return
    }

    localStorage.clear()
    this.setState({
      value: {}
    })
  }
  render() {
    const { value, enableDragging } = this.state
    return (
      <div>
        <h1>Drawit Demo</h1>
        <button onClick={this.handleClickAddNode}>Add Node</button>
        <button onClick={this.handleClickAddCircle}>Add Circle</button>
        <button onClick={this.handleClickAddDiamond}>Add Diamond</button>
        <button onClick={this.handleClickAddLink}>Add Link</button>
        <button onClick={this.handleClickDragging}>Toggle Dragging</button>
        <button onClick={this.handleClickClear}>Clear</button>
        <Diagram ref="diagram" value={value} onChange={this.handleChange} enableDragging={enableDragging}>
          <Node type="default" component={ DefaultNode }>
            <Position type="left" top="calc(50% - 0.2rem)" left="-0.2rem">
              <Port type="default" component={ DefaultPort }/>
            </Position>
            <Position type="right" top="calc(50% - 0.2rem)" right="-0.2rem">
              <Port type="default" component={ DefaultPort }/>
            </Position>
          </Node>
          <Node type="circle" component={ NodeCircle }>
            <Position type="left" top="calc(50% - 0.2rem)" left="-0.2rem">
              <Port type="default" component={ DefaultPort }/>
            </Position>
            <Position type="right" top="calc(50% - 0.2rem)" right="-0.2rem">
              <Port type="default" component={ DefaultPort }/>
            </Position>
          </Node>
          <Node type="diamond" component={ NodeDiamond }>
            <Position type="left" top="calc(50% - 0.2rem)" left="-1rem">
              <Port type="default" component={ DefaultPort }/>
            </Position>
            <Position type="right" top="calc(50% - 0.2rem)" right="-1rem">
              <Port type="default" component={ DefaultPort }/>
            </Position>
          </Node>
          <Link type="default" component={ DefaultLink }>
            <Point type="default" component={ DefaultPoint }/>
          </Link>
        </Diagram>
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#demo'))
