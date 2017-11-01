import React from 'react'
import Node from './Node'
import Link from './Link'
import Port from './Port'
import Position from './Position'
import { DefaultNode, DefaultLink, DefaultPort } from '../defaults'

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

const buildPositionConf = ({ props: { type = 'default', top = '', left = '', bottom = '', right = '' } }) => 
    ({
        type,
        top,
        left,
        bottom,
        right
    })

const buildPortConf = ({ props: { type = 'default', component = DefaultPort, children = [] } }) =>
    ({
        type,
        component,
        positions: React.Children.toArray(children).reduce((output, child) => {
            if ( child.type !== Position ) {
                console.warn(`Port[${type}] contains an unrecognized child of type: `, child.type)
                return output
            }

            const positionConf = buildPositionConf(child)
            output[positionConf.type] = positionConf

            return output
        }, {})
    })

const buildNodeConf = ({ props: { type = 'default', component = DefaultNode, children = [] } }) =>
    ({
        type,
        component,
        ports: React.Children.toArray(children).reduce((output, child) => {
            if ( child.type !== Port ) {
                console.warn(`Node[${type}] contains an unrecognized child of type: `, child.type)
                return output
            }

            const portConf = buildPortConf(child)
            output[portConf.type] = portConf
            return output
        }, {})
    })

const buildLinkCOnf = ({ props: { type = 'default', component = DefaultLink } }) =>
    ({
        type,
        component
    })

export default ({ props: {children} }) =>
    children.reduce((output, child) => {
        if ( child.type === Node ) {
            const nodeConf = buildNodeConf(child)
            output.nodes[nodeConf.type] = nodeConf
        } else if ( child.type === Link ) {
            const linkConf = buildLinkCOnf(child)
            output.links[linkConf.type] = linkConf
        } else {
            console.warn(`Couldn't recorgnize type of node: `, child.type)
        }

        return output
    }, {
        nodes: {},
        links: {}
    })