// libs
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// src
import DraggableElementHTML from './DraggableElementHTML'

const isPointWithinRect = (p, r) => {
    const o = p.x > r.x && p.x < (r.x + r.width) && p.y > r.y && p.y < (r.y + r.height)
    // console.log(`is p[${p.x}, ${p.y}] within r[${r.x}, ${r.y}, ${r.width}, ${r.height}] = ${o}`)

    return o
}

const getSnapTargetInRange = (point, snapTargets) =>
    snapTargets.find(({ target, strength }) => {
        // console.log('[getSnapTargetInRange]: snapTargets: ', snapTargets)
        const node = ReactDOM.findDOMNode(target)
        const rect = node.getBoundingClientRect()
        
        const width = rect.width * strength
        const height = rect.height * strength
        const x = rect.x - ( width - rect.width ) / 2
        const y = rect.y - ( height - rect.height ) / 2

        return isPointWithinRect(point, {x, y, width, height})
    })

const getCenterPoint = (x, y, { target }) => {
    const node = ReactDOM.findDOMNode(target)
    const rect = node.getBoundingClientRect()
    
    return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
    }
}

const getRelativePoint = ({x, y}) => ({x, y})

class Draggable extends React.Component {
    state = {
        relX: 0,
        relY: 0,
        deltaX: 0,
        deltaY: 0
    }

    static contextTypes = {
        getSnapTargetsByType: PropTypes.func
    }

    static propTypes = {
        snapTargets: PropTypes.arrayOf(PropTypes.string)
    }

    onMouseDown = e => {
        if (e.button !== 0) return

        const { x, y, offsetX, offsetY, onDragStart } = this.props

        onDragStart && onDragStart()

        const ref = ReactDOM.findDOMNode(this)
        const body = document.body
        const box = ref.getBoundingClientRect()

        const relX = e.pageX - (box.left + window.scrollX - offsetX)
        const relY = e.pageY - (box.top + window.scrollY - offsetY)

        // console.log(`${relX} = ${e.pageX} - (${box.left} + ${window.scrollX} + ${offsetX})`)
        // console.log(`${relY} = ${e.pageY} - (${box.top} + ${window.scrollY} - ${offsetY})`)

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
        e.preventDefault()

        const { relX, relY } = this.state
        const { snapTargets: snapTargetTypes, offsetX, offsetY } = this.props
        const { pageX, pageY } = e
        const x = pageX - relX
        const y = pageY - relY

        const snapTargets = this.context.getSnapTargetsByType( snapTargetTypes )
        // console.log(`snapTargets found: `, snapTargets, `against: `, snapTargetTypes)
        const snapTarget = getSnapTargetInRange({x: x + offsetX, y: y + offsetY}, snapTargets)

        if ( !snapTarget ) {
            this.props.onMove({
                x, y, isSnapped: false, snapTargetID: null
            })

            return
        }

        // console.log('snapTarget detected: ', snapTarget)
        const { x: cx, y: cy } = getCenterPoint(x, y, snapTarget)

        this.props.onMove({
            x: cx - offsetX,
            y: cy - offsetY,
            isSnapped: true,
            snapTargetID: snapTarget.id
        })
        
        // is near a snapTarget
        // if yes, move to center of the snapTarget
        // pass isSnapped=true to child

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
    const {
        draggableElement,
        toPositionAttributes,
        snapTargets = [],
        onDragStart = () => {},
        onDrag = () => {},
        onDragEnd = () => {}
    } = pOptions

    return class DraggableWrapper extends React.Component {
        static propTypes = {
            offsetX: PropTypes.number,
            offsetY: PropTypes.number
        }

        constructor(props) {
            super(props)
            
            const { model } = props
            const { x = 0, y = 0 } = model

            this.state = {
                x,
                y,
                isDragging: false,
                isSnapped: false,
                snapTargetID: null
            }
        }

        handleDragStart = e => {
            const { x, y } = this.state

            this.setState({
                isDragging: true
            })

            onDragStart({
                dragPosition: {
                    x, y
                }
            }, this.props, this.context)
        }

        handleMove = e => {
            this.setState(e)
            const { x, y } = e

            onDrag({
                dragPosition: {
                    x, y
                }
            }, this.props, this.context)
        }

        handleDragEnd = e => {
            this.setState({
                isDragging: false
            })

            const { x, y } = this.state
            onDragEnd({dragPosition: {x, y}}, this.props, this.context)
        }

        render() {
            const { x, y, isDragging, isSnapped, snapTargetID } = this.state
            const { offsetX = 0, offsetY = 0, ...rest } = this.props

            return (
                <Draggable
                    x={x}
                    y={y}
                    offsetX={offsetX}
                    offsetY={offsetY}
                    onDragStart={this.handleDragStart}
                    onMove={this.handleMove}
                    onDragEnd={this.handleDragEnd}
                    draggableElement={draggableElement}
                    toPositionAttributes={toPositionAttributes}
                    snapTargets={snapTargets}>

                    <WrappedElement
                        isDragging={isDragging}
                        isSnapped={isSnapped}
                        snapTargetID={snapTargetID}
                        {...rest}/>
                </Draggable>
            )
        }
    }
}