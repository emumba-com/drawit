import React, {Component} from 'react'
import {render} from 'react-dom'

import {
  Diagram,
  Node,
  Link,
  DefaultNode,
  DefaultLink
 } from '../../src'

class Demo extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      value: ''
    }
  }
  handleChange = (value, e) => {
    this.setState({ value })
  }
  render() {
    const { value } = this.state

    return (
      <div>
        <h1>drawit Demo</h1>
        <Diagram value={value} onChange={this.handleChange}>
          <Node name="default" component={ DefaultNode }/>
          <Link name="default" component={ DefaultLink }/>
        </Diagram>
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#demo'))
