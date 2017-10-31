import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import DraggableElementHTML from './DraggableElementHTML'

class Draggable extends React.Component {
    state = { relX: 0, relY: 0, deltaX: 0, deltaY: 0 }
    
    onMouseDown = e => {
        if (e.button !== 0) return

        const { x, y, offsetX, offsetY, onDragStart } = this.props

        onDragStart && onDragStart()

        const ref = ReactDOM.findDOMNode(this)
        const body = document.body
        const box = ref.getBoundingClientRect()

        const relX = e.pageX - (box.left + window.scrollX - offsetX)
        const relY = e.pageY - (box.top + window.scrollY - offsetY)

        this.setState({
            relX, 
            relY
        })

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        e.preventDefault();
    }

    onMouseUp = e => {
        const { onDragEnd } = this.props
        onDragEnd && onDragEnd()

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        e.preventDefault();
    }

    onMouseMove = e => {
        const { relX, relY } = this.state
        const { pageX, pageY } = e
        const x = pageX - relX
        const y = pageY - relY

        this.props.onMove({
          x, y
        })

        e.preventDefault()
    }

    render() {
        const {
            x,
            y,
            draggableElement: DraggableElement = DraggableElementHTML,
            toPositionAttributes = (left, top) => ({style: {left, top}}),
            children
        } = this.props

        return (
            <DraggableElement
                onMouseDown={this.onMouseDown}
                className="Drawit--Draggable"
                {...toPositionAttributes(x, y)}>
                {children}
            </DraggableElement>
        )
    }
}

export default (pOptions = {}) => WrappedElement => {
    const { draggableElement, toPositionAttributes } = pOptions

    return class DraggableWrapper extends React.Component {
        static propTypes = {
            offsetX: PropTypes.number,
            offsetY: PropTypes.number,

            onChange: PropTypes.func,
            onDragStart: PropTypes.func,
            onDrag: PropTypes.func,
            onDragEnd: PropTypes.func
        }

        constructor(props) {
            super(props)
            
            const { model } = props
            const { x = 0, y = 0 } = model

            this.state = {
                x,
                y,
                isDragging: false
            }
        }

        handleDragStart = e => {
            const { onDragStart } = this.props
            const { x, y } = this.state

            this.setState({
                isDragging: true
            })

            onDragStart && onDragStart({
                x, y
            })
        }

        handleMove = e => {
            const { onDrag } = this.props

            this.setState(e)

            onDrag && onDrag(e)
        }

        handleDragEnd = e => {
            this.setState({
                isDragging: false
            })

            const { x, y } = this.state
            const { model, onChange, onDragEnd } = this.props
            const nextModel = {...model, x, y}
            onChange && onChange(nextModel)
            onDragEnd && onDragEnd({x, y})
        }

        render() {
            const { x, y, isDragging } = this.state
            const { offsetX = 0, offsetY = 0, ...rest } = this.props

            return (
                <Draggable
                    x={x}
                    y={y}
                    offsetX={     offsetX    }
                    offsetY={     offsetY    }
                    onDragStart={ this.handleDragStart }
                    onMove={      this.handleMove      }
                    onDragEnd={   this.handleDragEnd   }
                    draggableElement={draggableElement}
                    toPositionAttributes={toPositionAttributes}>
                    <WrappedElement isDragging={isDragging} {...rest}/>
                </Draggable>
            )
        }
    }
}