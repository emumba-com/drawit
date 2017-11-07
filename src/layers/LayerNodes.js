import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import { NodeShell } from '../shells'

export default class LayerNodes extends React.Component {
    state = { offsetX: 0, offsetY: 0 }

    static propTypes = {
        conf: PropTypes.object.isRequired,
        value: PropTypes.object.isRequired,
        onChangeEntityModel: PropTypes.func.isRequired
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
        const { conf, value, onChangeEntityModel } = this.props
        const { nodes } = value

        return (
            <div className="Drawit--Diagram--Nodes">
            {
                Object.keys(nodes).map(key => {
                    const model = nodes[key]
                    const { type } = model

                    return (
                        <NodeShell
                            key={model.id}
                            model={model}
                            value={value}
                            conf={conf.nodes[type]}
                            offsetX={offsetX}
                            offsetY={offsetY}
                            onChangeEntityModel={onChangeEntityModel}
                        />
                    )
                })
            }
            </div>
        )
    }
}