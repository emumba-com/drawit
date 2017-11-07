import React from 'react'
import ReactDOM from 'react-dom'

// src
import DraggableElementHTML from './DraggableElementHTML'
import eventSource from './eventSource'

export default (options = {}) => WrappedElement => {
    const {
        toPositionAttributes = (left, top) => ({style: {left, top}}),
        draggableElement: DraggableElement = DraggableElementHTML
    } = options

    return @eventSource() class Draggable extends React.Component {
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
                relY
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
            const { snapTargets: snapTargetTypes, offsetX, offsetY, triggerEvent, model } = this.props
            const { pageX, pageY } = e
            const dx = pageX - relX
            const dy = pageY - relY

            // console.log(x, y)
            triggerEvent('drag', model.id, {
                dx,
                dy,
                model
            })

            /*
            const snapTargets = this.context.getMountedEntitiesByType( snapTargetTypes )
            // console.log(`snapTargets found: `, snapTargets, `against: `, snapTargetTypes)
            const snapTarget = getSnapTargetInRange({x: x + offsetX, y: y + offsetY}, snapTargets)

            if ( !snapTarget ) {
                this.props.onMove({
                    x, y, isSnapped: false, snapTargetID: null
                })
    
                return
            }
            */
    
            /*
            // console.log('snapTarget detected: ', snapTarget)
            const { x: cx, y: cy } = getCenterPoint(x, y, snapTarget)
    
            this.props.onMove({
                x: cx - offsetX,
                y: cy - offsetY,
                isSnapped: true,
                snapTargetID: snapTarget.id
            })
            */
            
            // is near a snapTarget
            // if yes, move to center of the snapTarget
            // pass isSnapped=true to child
    
        }

        handleMouseUp = e => {
            const { triggerEvent, model } = this.props

            triggerEvent('drag-end', model.id, {
                model
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