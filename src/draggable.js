import React from 'react'
import ReactDOM from 'react-dom'

class Draggable extends React.Component {
    state = { relX: 0, relY: 0, deltaX: 0, deltaY: 0 }
    
    onMouseDown = e => {
        if (e.button !== 0) return

        const { x, y, offsetX, offsetY, onDragStart } = this.props

        onDragStart && onDragStart()

        const ref = ReactDOM.findDOMNode(this.refs.handle)
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
        const { x: left, y: top, children } = this.props

        return (
            <div
                onMouseDown={this.onMouseDown}
                className="Drawit--Draggable"
                style={{
                    left,
                    top
                }}
                ref="handle">
                {children}
            </div>
        )
    }
}

export default options => WrappedElement =>
    class DraggableWrapper extends React.Component {
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
            this.setState({
                isDragging: true
            })
        }

        handleMove = e => {
            this.setState(e)
        }

        handleDragEnd = e => {
            this.setState({
                isDragging: false
            })

            const { x, y } = this.state
            const { model, __drawit__onChange } = this.props
            const nextModel = {...model, x, y}
            __drawit__onChange(nextModel)
        }
        
        render() {
            const { x, y, isDragging } = this.state
            const { __drawit__offsetX, __drawit__offsetY, ...rest } = this.props

            return (
                <Draggable
                    x={x}
                    y={y}
                    offsetX={     __drawit__offsetX    }
                    offsetY={     __drawit__offsetY    }
                    onDragStart={ this.handleDragStart }
                    onMove={      this.handleMove      }
                    onDragEnd={   this.handleDragEnd   }>
                    <WrappedElement isDragging={isDragging} {...rest}/>
                </Draggable>
            )
        }
    }