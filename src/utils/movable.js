import React from 'react'
import Observer from './Observer'

import DraggableElementHTML from './DraggableElementHTML'

export default (pOptions = {}) => WrappedElement => {
    const options = {
        draggableElement: DraggableElementHTML,
        toPositionAttributes: (left, top) => ({style: {left, top}}),
        getDockTargets: () => [],
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
        draggableElement: DraggableElement,
        getDockTargets
    } = options

    return class Movable extends React.Component {
        constructor(props) {
            super(props)
            const { model } = props
            const { x = 0, y = 0 } = model

            this.state = {
                isDragging: false,
                isSnapped: false,
                dx: x,
                dy: y,
                dragSource: null
            }
        }
        handleDragStart = e => {
            const { model: dragSource } = e

            this.setState({
                isDragging: true,
                isSnapped: false,
                dragSource
            })

            const { dx, dy } = this.state

            onDragStart({
                dx, dy
            }, this.props)
        }
        handleDrag = e => {
            const { dx, dy, isSnapped } = e
            // console.log(e)

            this.setState({
                dx, dy, isSnapped
            })

            onDrag({
                dx, dy, isSnapped
            }, this.props)
        }
        handleDragEnd = e => {
            const { isSnapped } = e

            this.setState({
                isDragging: false,
                isSnapped,
                dragSource: null
            })

            const { dx, dy } = this.state

            onDragEnd({
                dx,
                dy,
                isSnapped,
                ...e
            }, this.props)
        }
        handleDockTargetDragStart = e => {
            // console.log(`[handleDockTargetDragStart]`)
            const { model: dragSource } = e
            
            this.setState({
                isDragging: true,
                isSnapped: false,
                dragSource
            })

            const { dx, dy } = this.state

            onDragStart({
                dx, dy
            }, this.props)
        }
        handleDockTargetDrag = e => {
            // console.log(`[handleDockTargetDrag]`)
            const { dx, dy, isSnapped } = e
            // console.log(e)

            this.setState({
                dx, dy, isSnapped
            })

            onDrag({
                dx, dy, isSnapped
            }, this.props)
        }
        handleDockTargetDragEnd = e => {
            // console.log(`[handleDockTargetDragEnd]`)
            const { isSnapped } = e
            
            this.setState({
                isDragging: false,
                isSnapped,
                dragSource: null
            })

            const { dx, dy } = this.state

            onDragEnd({
                dx,
                dy,
                isSnapped,
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
                    {
                        getDockTargets(this.props).map(id => (
                            <span>
                                <Observer event="drag-start" id={id} handler={this.handleDockTargetDragStart}/>
                                <Observer event="drag" id={id} handler={this.handleDockTargetDrag}/>
                                <Observer event="drag-end" id={id} handler={this.handleDockTargetDragEnd}/>
                            </span>
                        ))
                    }
                </DraggableElement>
            )
        }
    }
}