import React from 'react'
import Observer from './Observer'

export default (pOptions = {}) => WrappedElement => {
    const options = {
        toPositionAttributes: (left, top) => ({style: {left, top}}),
        onDragEnd: () => {},
        ...pOptions
    }

    const { toPositionAttributes, onDragEnd } = options

    return class Movable extends React.Component {
        constructor(props) {
            super(props)
            const { model } = props
            const { x = 0, y = 0 } = model

            this.state = {
                isDragging: false,
                dx: x,
                dy: y,
                dragSource: null
            }
        }
        handleDragStart = e => {
            const { model: dragSource } = e

            this.setState({
                isDragging: true,
                dragSource
            })
        }
        handleDrag = e => {
            const { dx, dy } = e

            this.setState({
                dx, dy
            })
        }
        handleDragEnd = e => {
            this.setState({
                isDragging: false,
                dragSource: null
            })

            const { dx, dy } = this.state

            onDragEnd({
                dx,
                dy,
                ...e
            }, this.props)
        }
        render() {
            const { dx, dy } = this.state
            const { model } = this.props

            return (
                <div className="Drawit--Movable" {...toPositionAttributes(dx, dy)}>
                    <WrappedElement {...this.props} {...this.state}/>
                    <Observer event="drag-start" id={model.id} handler={this.handleDragStart}/>
                    <Observer event="drag" id={model.id} handler={this.handleDrag}/>
                    <Observer event="drag-end" id={model.id} handler={this.handleDragEnd}/>
                </div>
            )
        }
    }
}