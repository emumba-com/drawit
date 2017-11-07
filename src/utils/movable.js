import React from 'react'
import Observer from './Observer'

import DraggableElementHTML from './DraggableElementHTML'

export default (pOptions = {}) => WrappedElement => {
    const options = {
        draggableElement: DraggableElementHTML,
        toPositionAttributes: (left, top) => ({style: {left, top}}),
        onDragStart: () => {},
        onDrag: () => {},
        onDragEnd: () => {},
        ...pOptions
    }

    const {
        toPositionAttributes,
        onDragStart,
        onDrag,
        onDragEnd,
        draggableElement: DraggableElement } = options

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

            const { dx, dy } = this.state

            onDragStart({
                dx, dy
            }, this.props)
        }
        handleDrag = e => {
            const { dx, dy } = e
            // console.log(e)

            this.setState({
                dx, dy
            })

            onDrag({
                dx, dy
            }, this.props)
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
            const { model, onMouseDown } = this.props

            return (
                <DraggableElement onMouseDown={onMouseDown} className="Drawit--Movable" {...toPositionAttributes(dx, dy)}>
                    <WrappedElement {...this.props} {...this.state}/>
                    <Observer event="drag-start" id={model.id} handler={this.handleDragStart}/>
                    <Observer event="drag" id={model.id} handler={this.handleDrag}/>
                    <Observer event="drag-end" id={model.id} handler={this.handleDragEnd}/>
                </DraggableElement>
            )
        }
    }
}