import React, {Component} from 'react'
import {render} from 'react-dom'

import {
  Diagram,
  Node,
  Link,
  DefaultNode,
  DefaultLink
 } from '../../src'

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
  render() {
    const { value } = this.state

    return (
      <div>
        <h1>drawit Demo</h1>
        <button onClick={this.handleClickAddNode}>Add Node</button>
        <Diagram ref="diagram" value={value} onChange={this.handleChange}>
          <Node type="default" component={ DefaultNode }/>
          <Link type="default" component={ DefaultLink }/>
        </Diagram>
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#demo'))