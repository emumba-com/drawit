import React from 'react'
import ReactDOM from 'react-dom'

export default class LayerNodes extends React.Component {
    state = { offsetX: 0, offsetY: 0 }

    componentDidMount() {
        const ref = ReactDOM.findDOMNode(this)
        const rect = ref.getBoundingClientRect()

        this.setState({
            offsetX: rect.left,
            offsetY: rect.top
        })
    }

    render() {
        const { offsetX, offsetY } = this.state
        const { nodes, component: NodeComponent } = this.props

        return (
            <div className="Drawit--Diagram--Nodes">
            {
                nodes.map(node =>
                    <NodeComponent
                        key={node.id}
                        model={node}
                        __drawit__offsetX={offsetX}
                        __drawit__offsetY={offsetY}
                    />)
            }
            </div>
        )
    }
}