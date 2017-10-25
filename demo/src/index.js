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

class Demo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }

    window.demo = this
  }
  componentDidMount() {
    this.refs.diagram.addNode({
      title: 'Test Node 1'
    })
  }
  handleChange = (value, e) => {
    this.setState({ value })
  }
  render() {
    const { value } = this.state

    return (
      <div>
        <h1>drawit Demo</h1>
        <Diagram ref="diagram" value={value} onChange={this.handleChange}>
          <Node type="default" component={ DefaultNode }/>
          <Link type="default" component={ DefaultLink }/>
        </Diagram>
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#demo'))
