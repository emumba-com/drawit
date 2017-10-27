import React from 'react'
import draggable from './draggable'

export default draggable()(class DefaultNode extends React.Component {
    render() {
        const { title } = this.props

        return (
            <div className="Drawit--DefaultNode">
                <span>DefaultNode</span>
            </div>
        )
    }
})

/*
export default draggable()(class DefaultNode extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            x: 0,
            y: 0,
            dragStartX: 0,
            dragStartY: 0,
            deltaX: 0,
            deltaY: 0
        }
    }
    componentDidMount() {
        // borrowing coordinates from document
        // https://stackoverflow.com/a/24137885/162461
        this.__document_ondragover = document.ondragover
        this.__document_ondragenter = document.ondragenter
        document.ondragover = this.handleDragOver
        document.ondragenter = this.handleDragEnter
    }
    componentWillUnmount() {
        document.ondragover = this.__document_ondragover
        document.ondragenter = this.__document_ondragenter
    }
    handleDragStart = e => {
        // e.preventDefault()
        console.log('handleDragStart')

        // if no data is set, firefox won't let the element drag
        e.dataTransfer.setData('text', 'forFF')

        /*
        this.setState({
            dragStartX: e.screenX,
            dragStartY: e.screenY,
            deltaX: 0,
            deltaY: 0
        })
        *//*
    }
    handleDragEnd = e => {
        /*
        // e.preventDefault()
        const { x, y, dragStartX, dragStartY, deltaX, deltaY } = this.state
        const { dropEffect, screenX, screenY } = e
        // const deltaX = screenX - dragStartX
        // const deltaY = screenY - dragStartY
        const nextX = x // + deltaX
        const nextY = y // + deltaY
        
        console.log(`handleDragEnd: ${JSON.stringify({
            nextX, nextY, x, y, dragStartX, dragStartY, screenX, screenY, deltaX, deltaY
        })}`)

        this.setState({
            x: nextX,
            y: nextY,
            dragStartX: 0,
            dragStartY: 0,
            deltaX: 0,
            deltaY: 0
        })
        *//*

        const { x: prevX, y: prevY, dragStartX, dragStartY, deltaX, deltaY } = this.state
        const x = prevX + deltaX
        const y = prevY + deltaY

        this.setState({
            x, y
        })
    }
    handleDrag = e => {
        // e.preventDefault()

        // console.log('handleDrag')
        /*
        const { dragStartX, dragStartY } = this.state
        const { screenX, screenY } = e
        const deltaX = screenX - dragStartX
        const deltaY = screenY - dragStartY
        console.log(`handleDrag: `, JSON.stringify({deltaX, deltaY, dragStartX, dragStartY, screenX, screenY}))

        this.setState({
            deltaX,
            deltaY
        })
        */

        /*
        const { x: prevX, y: prevY, dragStartX, dragStartY, deltaX, deltaY } = this.state
        const x = prevX + deltaX
        const y = prevY + deltaY

        this.setState({
            x, y
        })
        *//*
    }
    handleDragOver = e => {
        const { dragStartX, dragStartY } = this.state
        const { pageX, pageY } = e
        const deltaX =  pageX - dragStartX
        const deltaY = pageY - dragStartY

        console.log('calling handleDragOver', JSON.stringify({
            deltaX,
            deltaY
        }))

        this.setState({
            deltaX,
            deltaY
        })
    }
    handleDragEnter = e => {
        const { pageX: dragStartX, pageY: dragStartY } = e
        console.log(`handleDragEnter: ${JSON.stringify({
            dragStartX, dragStartY
        })}`)

        this.setState({
            dragStartX,
            dragStartY,
            deltaX: 0,
            deltaY: 0
        })
    }
    render() {
        const { x, y } = this.state
        const { title } = this.props


        return (
            <div className="Drawit--DefaultNode"
                draggable
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onDrag={this.handleDrag}
                style={{top: y, left: x}}>
                <span>DefaultNode</span>
            </div>
        )
    }
})
*/