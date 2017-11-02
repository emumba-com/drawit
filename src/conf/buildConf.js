import React from 'react'
import Node from './Node'
import Link from './Link'
import Port from './Port'
import Point from './Point'
import Position from './Position'
import { DefaultNode, DefaultLink, DefaultPort, DefaultPoint } from '../defaults'

/**
 * Conf
 * {
 *     nodes: {
 *         'default': {
 *              component: React$Element,
 *              ports: {
 *                  'default': {
 *                      positions: {
 *                          left: {
 *                              top: 'calc(50% - 0.2rem)',
 *                              left: '-0.2rem'
 *                          },
 *                          right: {
 *                              top: 'calc(50% - 0.2rem)',
 *                              right: '-0.2rem'
 *                          }
 *                      }
 *                  }
 *              }
 *         }
 *     },
 *     links: {
 *         'default': {
 *             
 *         }
 *     }
 * }
 */

const buildPortConf = ({ props: { type = 'default', component = DefaultPort, children = [] } }) =>
    ({
        type,
        component
    })

const buildPositionConf = ({ props: { type = 'default', top = '', left = '', bottom = '', right = '', children = [] } }) => 
    ({
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
    })

const buildNodeConf = ({ props: { type = 'default', component = DefaultNode, children = [] } }) =>
    ({
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
    })

const buildPointConf = ({ props: { type = 'default', component = DefaultPoint, children = [] } }) =>
    ({
        type,
        component
    })

const buildLinkConf = ({ props: { type = 'default', component = DefaultLink, children = [] } }) =>
    ({
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
    })

export default ({ props: {children} }) =>
    children.reduce((output, child) => {
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
        links: {}
    })