/* @flow */

// libs
import * as React from 'react'

// src
import Node from './Node'
import Link from './Link'
import Port from './Port'
import Point from './Point'
import Position from './Position'
import { DefaultNode, DefaultLink, DefaultPort, DefaultPoint } from '../defaults'
import type
 {
    Configuration,
    LinkConfiguration,
    NodeConfiguration,
    PointConfiguration,
    PortConfiguration,
    PositionConfiguration,
} from '../types'

const buildPortConf = (element: React$Element<*>): PortConfiguration => {
    const { props: { type = 'default', component = DefaultPort, children = [] } } = element

    return {
        type,
        component
    }
}
const buildPositionConf = (element: React$Element<*>): PositionConfiguration => {
    const { props: { type = 'default', top = '', left = '', bottom = '', right = '', children = [] } } = element

    return {
        type,
        top,
        left,
        bottom,
        right,
        ports: React.Children.toArray(children).reduce((output, child) => {
            if ( child.type !== Port ) {
                console.warn(`Position[${type}] contains an unrecognized child of type: `, child.type)
                return output
            }

            const portConf = {
                top, left, bottom, right,
                ...buildPortConf(child)
            }
            output[portConf.type] = portConf

            return output
        }, {})
    }
}

const buildNodeConf = (element: React$Element<*>): NodeConfiguration => {
    const { props: { type = 'default', component = DefaultNode, children = [] } } = element

    return {
        type,
        component,
        positions: React.Children.toArray(children).reduce((output, child) => {
            if ( child.type !== Position ) {
                console.warn(`Node[${type}] contains an unrecognized child of type: `, child.type)
                return output
            }

            const positionConf = buildPositionConf(child)
            output[positionConf.type] = positionConf
            return output
        }, {})
    }
}
const buildPointConf = (element: React$Element<*>): PointConfiguration => {
    const { props: { type = 'default', component = DefaultPoint, children = [] } } = element

    return {
        type,
        component
    }
}
const buildLinkConf = (element: React$Element<*>): LinkConfiguration => {
    const { props: { type = 'default', component = DefaultLink, children = [] } } = element

    return {
        type,
        component,
        points: React.Children.toArray(children).reduce((output, child) => {
            if ( child.type !== Point ) {
                console.warn(`Link[${type}] contains an unrecognized child of type: `, child.type)
                return output
            }

            const pointConf = buildPointConf(child)
            output[pointConf.type] = pointConf
            return output
        }, {})
    }
}

export default (props): Configuration => {
    // const props: DiagramProps = element.props
    const { children, enableDragging } = props
    return React.Children.toArray(children).reduce((output, child) => {
        if ( child.type === Node ) {
            const nodeConf = buildNodeConf(child)
            output.nodes[nodeConf.type] = nodeConf
        } else if ( child.type === Link ) {
            const linkConf = buildLinkConf(child)
            output.links[linkConf.type] = linkConf
        } else {
            console.warn(`Couldn't recorgnize type of node: `, child.type)
        }

        return output
    }, {
        nodes: {},
        links: {},
        enableDragging
    })
}
