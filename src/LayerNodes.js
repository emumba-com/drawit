import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

export default class LayerNodes extends React.Component {
    state = { offsetX: 0, offsetY: 0 }

    static propTypes = {
        nodes: PropTypes.array,
        component: PropTypes.func,
        onChangeNodeModel: PropTypes.func
    }
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
        const { nodes, component: NodeComponent, onChangeNodeModel } = this.props

        return (
            <div className="Drawit--Diagram--Nodes">
            {
                nodes.map(model =>
                    <NodeComponent
                        key={model.id}
                        model={model}
                        __drawit__offsetX={offsetX}
                        __drawit__offsetY={offsetY}
                        __drawit__onChange={onChangeNodeModel}
                    />)
            }
            </div>
        )
    }
}