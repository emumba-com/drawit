import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// src
import DraggableElementHTML from './DraggableElementHTML'
import eventSource from './eventSource'

const isPointWithinRect = (p, r) => {
    const o = p.x > r.x && p.x < (r.x + r.width) && p.y > r.y && p.y < (r.y + r.height)
    // console.log(`is p[${p.x}, ${p.y}] within r[${r.x}, ${r.y}, ${r.width}, ${r.height}] = ${o}`)

    return o
}

const getSnapTargetInRange = (point, snapTargets) =>
    snapTargets.find(({ mountedElement, strength = 10 }) => {
        // console.log('[getSnapTargetInRange]: snapTargets: ', snapTargets)

        const node = ReactDOM.findDOMNode(mountedElement)
        const rect = node.getBoundingClientRect()
        
        const width = rect.width * strength
        const height = rect.height * strength
        const x = rect.x - ( width - rect.width ) / 2
        const y = rect.y - ( height - rect.height ) / 2

        return isPointWithinRect(point, {x, y, width, height})
    })

const getCenterPoint = (x, y, { mountedElement }) => {
    const node = ReactDOM.findDOMNode(mountedElement)
    const rect = node.getBoundingClientRect()
    
    return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
    }
}

const getRelativePoint = ({x, y}) => ({x, y})

export default (options = {}) => WrappedElement => {
    const {
        toPositionAttributes = (left, top) => ({style: {left, top}}),
        draggableElement: DraggableElement = DraggableElementHTML,
        snapTargets: snapTargetTypes = []
    } = options

    return @eventSource() class Draggable extends React.Component {
        static contextTypes = {
            getMountedEntitiesByType: PropTypes.func,
            getMountedEntityByID: PropTypes.func
        }

        state = { relX: 0, relY: 0, snapTarget: null }

        handleMouseDown = e => {
            if (e.button !== 0) return
            // console.log('handleMouseDown: ', e)
    
            const { x, y, offsetX, offsetY, triggerEvent, model } = this.props
    
            const ref = ReactDOM.findDOMNode(this)
            const body = document.body
            const box = ref.getBoundingClientRect()
    
            const relX = e.pageX - (box.left + window.scrollX - offsetX)
            const relY = e.pageY - (box.top + window.scrollY - offsetY)
    
            // console.log(`${relX} = ${e.pageX} - (${box.left} + ${window.scrollX} + ${offsetX})`)
            // console.log(`${relY} = ${e.pageY} - (${box.top} + ${window.scrollY} - ${offsetY})`)
    
            this.setState({
                relX, 
                relY,
                snapTarget: null
            })

            triggerEvent('drag-start', model.id, {
                model,
                relX,
                relY
            })
    
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
            e.preventDefault();
        }
    
        handleMouseMove = e => {
            e.preventDefault()
    
            const { relX, relY } = this.state
            const { offsetX, offsetY, triggerEvent, model } = this.props
            const { pageX, pageY } = e
            const dx = pageX - relX
            const dy = pageY - relY

            // console.log(x, y)

            const snapTargets = this.context.getMountedEntitiesByType( snapTargetTypes )
            // console.log(`snapTargets found: `, snapTargets, `against: `, snapTargetTypes)
            const snapTarget = getSnapTargetInRange({x: dx + offsetX, y: dy + offsetY}, snapTargets)
            // console.log(`[draggable] snapTarget: `, snapTarget)

            this.setState({
                snapTarget: snapTarget && snapTarget.model
            })

            if ( !snapTarget ) {
                /*
                this.props.onMove({
                    x, y, isSnapped: false, snapTargetID: null
                })
                */

                triggerEvent('drag', model.id, {
                    dx,
                    dy,
                    model,
                    isSnapped: false,
                    snapTargetID: null
                })
    
                return
            }
    
            // console.log('snapTarget detected: ', snapTarget)
            const { x: cx, y: cy } = getCenterPoint(dx, dy, snapTarget)
            
            /*
            this.props.onMove({
                x: cx - offsetX,
                y: cy - offsetY,
                isSnapped: true,
                snapTargetID: snapTarget.id
            })
            */

            triggerEvent('drag', model.id, {
                dx: cx - offsetX,
                dy: cy - offsetY,
                isSnapped: true,
                snapTarget,
                model
            })
            
            // is near a snapTarget
            // if yes, move to center of the snapTarget
            // pass isSnapped=true to child
    
        }

        handleMouseUp = e => {
            const { triggerEvent, model } = this.props
            const { snapTarget } = this.state

            triggerEvent('drag-end', model.id, {
                model, snapTarget
            })

            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('mouseup', this.handleMouseUp);
            e.preventDefault();
        }

        render() {
            return <WrappedElement onMouseDown={this.handleMouseDown} {...this.props}/>
        }
    }
}