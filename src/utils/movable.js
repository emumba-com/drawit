/* @flow */

import * as React from 'react'

import Observer from './Observer'
import DraggableElementHTML from './DraggableElementHTML'

type HOCOptions = {
    DraggableElement?: React.Node,
    toPositionAttributes?: Function,
    getDockTargets?: (Props) => Array<Object>,
    onDragStart?: ({x: number, y: number}, Props) => void,
    onDrag?: ({x: number, y: number, isSnapped: boolean}, Props) => void,
    onDragEnd?: ({x: number, y: number, isSnapped: boolean}, Props) => void
}

type Props = {
    model: Object,
    onMouseDown: Function
}

type State = {
    x: number,
    y: number,
    initX: number,
    initY: number,
    isDragging: boolean,
    isSnapped: boolean,
    dragSource: null | Object, // model
}

export default (pOptions: HOCOptions = {}) => (WrappedElement: Class<React$Component<*>>) => {
    const options = {
        draggableElement: DraggableElementHTML,
        toPositionAttributes: (left, top) => ({style: {left, top}}),
        getDockTargets: ({}) => [],
        onDragStart: ({}, {}) => {},
        onDrag: ({}, {}) => {},
        onDragEnd: ({}, {}) => {},
        ...pOptions,
    }

    const {
        toPositionAttributes,
        onDragStart,
        onDrag,
        onDragEnd,
        draggableElement: DraggableElement,
        getDockTargets
    } = options

    return class Movable extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props)
            const { model } = props
            const { x = 0, y = 0 } = model

            this.state = {
                isDragging: false,
                isSnapped: false,
                initX: x,
                initY: y,
                x,
                y,
                dragSource: null
            }
        }
        componentWillReceiveProps( nextProps: Props ) {

            const { x: oldX, y: oldY, isDragging } = this.state
            const { id, parentID } = nextProps.model

            if ( !isDragging ) {
                const { x= oldX, y= oldY } = nextProps.model

                if ( parentID ) {
                    // console.log(`[movable/componentWillReceiveProps] ${id}: x[${x}], y[${y}]`)
                    // console.log(nextProps)
                }

                this.setState({
                    x, y
                })
            }
        }
        handleDragStart = (e: Object) => {
            const { model: dragSource } = e

            this.setState({
                isDragging: true,
                isSnapped: false,
                dragSource
            })

            const { x, y } = this.state

            this.setState({
                initX: x,
                initY: y
            })

            onDragStart({
                x, y
            }, this.props)
        }
        handleDrag = (e: Object) => {
            const { dx, dy, isSnapped } = e
            const { initX, initY } = this.state
            const x = dx + initX
            const y = dy + initY
            // console.log(e)

            this.setState({
                x,
                y,
                isSnapped
            })

            onDrag({
                x, y, isSnapped
            }, this.props)
        }
        handleDragEnd = (e: Object) => {
            const { isSnapped } = e

            this.setState({
                isDragging: false,
                isSnapped,
                dragSource: null
            })

            const { x, y } = this.state

            onDragEnd({
                x,
                y,
                isSnapped,
                ...e
            }, this.props)
        }
        handleDockTargetDragStart = (e: Object) => {
            const { model: dragSource } = e

            this.setState({
                isDragging: true,
                isSnapped: false,
                dragSource
            })

            const { x, y } = this.state

            this.setState({
                initX: x,
                initY: y
            })

            onDragStart({
                x, y
            }, this.props)
        }
        handleDockTargetDrag = (e: Object) => {
            const { dx, dy, isSnapped } = e
            const { initX, initY } = this.state
            const x = dx + initX
            const y = dy + initY
            // console.log(e)

            this.setState({
                x,
                y,
                isSnapped
            })

            onDrag({
                x, y, isSnapped
            }, this.props)
        }
        handleDockTargetDragEnd = (e: Object) => {
            const { isSnapped } = e

            this.setState({
                isDragging: false,
                isSnapped,
                dragSource: null
            })

            const { x, y } = this.state

            onDragEnd({
                x,
                y,
                isSnapped,
                ...e
            }, this.props)
        }
        render() {
            const { x, y } = this.state
            const { model, onMouseDown } = this.props
            return (
                <DraggableElement onMouseDown={onMouseDown} className="Drawit--Movable" {...toPositionAttributes(x, y)}>
                    <WrappedElement {...this.props} {...this.state}/>
                    <Observer event="drag-start" id={model.id} handler={this.handleDragStart}/>
                    <Observer event="drag" id={model.id} handler={this.handleDrag}/>
                    <Observer event="drag-end" id={model.id} handler={this.handleDragEnd}/>
                    {
                      getDockTargets(this.props).map(id => (
                            <span key={id}>
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
