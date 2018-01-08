import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// src
import DraggableElementHTML from './DraggableElementHTML'
import eventSource from './eventSource'
import { getSnapTargetInRange, getCenterPoint, evaluteHOCParam } from './utils'

export default (options = {}) => WrappedElement => {
    const {
        toPositionAttributes = (left, top) => ({style: {left, top}}),
        draggableElement: DraggableElement = DraggableElementHTML,
        snapTargets: snapTargetTypes = [],
        enable: __enable__ = false
    } = options

    return @eventSource() class Draggable extends React.Component {
        static contextTypes = {
            getMountedEntitiesByType: PropTypes.func,
            getMountedEntityByID: PropTypes.func
        }

        constructor(props) {
            super(props)
            const { model } = this.props
            const { x, y } = model

            this.state = {
                relX: 0,
                relY: 0,
                snapTarget: null,

                initPageX: 0,
                initPageY: 0,
                initX: x,
                initY: y
            }
        }

        handleMouseDown = e => {
            if (e.button !== 0) return
            // console.log('handleMouseDown: ', e)

            const { offsetX, offsetY, triggerEvent, model } = this.props
            const { x, y } = model

            const ref = ReactDOM.findDOMNode(this)
            const body = document.body
            const box = ref.getBoundingClientRect()

            // const relX = e.pageX - (box.left + window.scrollX - offsetX)
            // const relY = e.pageY - (box.top + window.scrollY - offsetY)

            // console.log(`${relX} = ${e.pageX} - (${box.left} + ${window.scrollX} + ${offsetX})`)
            // console.log(`${relY} = ${e.pageY} - (${box.top} + ${window.scrollY} - ${offsetY})`)

            this.setState({
                // relX,
                // relY,
                initPageX: e.pageX,
                initPageY: e.pageY,
                snapTarget: null,
                initX: x,
                initY: y
            })

            triggerEvent('drag-start', model.id, {
                model
            })

            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
            e.preventDefault();
        }

        handleMouseMove = e => {
            e.preventDefault()

            // const { relX, relY } = this.state
            const { initPageX, initPageY, initX, initY } = this.state
            const { offsetX, offsetY, triggerEvent, model } = this.props
            const { pageX, pageY } = e
            // const dx = pageX - relX
            // const dy = pageY - relY

            const dx = pageX - initPageX
            const dy = pageY - initPageY
            const x = dx + initX
            const y = dy + initY

            // console.log(x, y)

            const snapTargets = this.context.getMountedEntitiesByType( snapTargetTypes )
            // console.log(`snapTargets found: `, snapTargets, `against: `, snapTargetTypes)
            // const snapTarget = getSnapTargetInRange({x: dx + offsetX, y: dy + offsetY}, snapTargets)
            const snapTarget = getSnapTargetInRange({x: x + offsetX, y: y + offsetY}, snapTargets)
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
            const { x: cx, y: cy } = getCenterPoint(snapTarget)

            /*
            this.props.onMove({
                x: cx - offsetX,
                y: cy - offsetY,
                isSnapped: true,
                snapTargetID: snapTarget.id
            })
            */

            triggerEvent('drag', model.id, {
                dx: dx + cx - x - offsetX,
                dy: dy + cy - y - offsetY,
                model,
                isSnapped: true,
                snapTarget
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
            const { value, model } = this.props
            const enable = evaluteHOCParam(__enable__, this.props)

            if ( enable ) {
              return <WrappedElement onMouseDown={this.handleMouseDown}  {...this.props}/>
            }

            return <WrappedElement  {...this.props}/>
        }
    }
}
