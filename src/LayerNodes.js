import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import NodeShell from './NodeShell'

const cache = {}

const getNodeByType = (type, children) => {
    if ( !cache[type] ) {
        cache[type] = children.find(child => child.props.type === type)
    }

    return cache[type]
}

export default class LayerNodes extends React.Component {
    state = { offsetX: 0, offsetY: 0 }

    static propTypes = {
        models: PropTypes.array,
        children: PropTypes.any,
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
        const { models, children, onChangeNodeModel } = this.props

        return (
            <div className="Drawit--Diagram--Nodes">
            {
                models.map(model => {
                    const { type } = model
                    const node = getNodeByType(type, children)

                    return (
                        <NodeShell
                            key={model.id}
                            model={model}
                            node={node}
                            offsetX={offsetX}
                            offsetY={offsetY}
                            onChange={onChangeNodeModel}
                        />
                    )
                })
            }
            </div>
        )
    }
}