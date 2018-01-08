import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import { LinkShell } from '../shells'

export default class LayerLinks extends React.Component {
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
        const { value, conf, onChangeEntityModel, onChangePortModel, valueBuilder, logger } = this.props
        const { links } = value
        const { enableDragging } = conf
        return (
            <div className="Drawit--Diagram--Links">
                <svg>
                {
                    Object.keys(links).map(key => {
                        const model = links[key]
                        const { type } = model

                        return (
                            <LinkShell
                                key={model.id}
                                logger={logger}
                                model={model}
                                value={value}
                                conf={conf.links[type]}
                                offsetX={offsetX}
                                offsetY={offsetY}
                                valueBuilder={valueBuilder}
                                onChangeEntityModel={onChangeEntityModel}
                                enableDragging={enableDragging}
                            />
                        )
                    })
                }
                </svg>
            </div>
        )
    }
}
