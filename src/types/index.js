/* @flow */

import * as React from 'react'

// --- Models --- //

export type DiagramModel = {
    nodes: {
        [string]: NodeModel
    },
    links: {
        [string]: LinkModel
    },
    ports: {
        [string]: PortModel
    },
    points: {
        [string]: PointModel
    }
}

export type NodeModel = {
    id: string,
    type: string,
    ports: {} | {
        [string]: string
    },
    x: number,
    y: number
}

export type LinkModel = {
    id: string,
    type: string
}

export type PortModel = {
    id: string,
    parentID: string,
    type: string,
    dockedPoints?: Array<string>
}

export type PointModel = {
    id: string,
    parentID: string,
    type: string,
    dockTarget?: string,
    x: number,
    y: number
}

// --- Specifications --- //

export type NodeSpecification = {
    type?: string,
    ports?: {
        [string]: PortSpecification
    },
    x?: number,
    y?: number
}

export type LinkSpecification = {
    type?: string,

    // Funny, if you change prop name to something else, there's no error.
    // Flow doesn't like the name "points"
    // $FlowFixMe
    points?: Array<PointSpecification>
}

export type PortSpecification = {
    type?: string
}

export type PointSpecification = {
    type?: string,
    x?: number,
    y?: number
}

// --- Configuration --- //

export type NodeConfiguration = {
    type: string,
    component: React$Element<*>,
    positions: {
        [string]: PositionConfiguration
    }
}

export type LinkConfiguration = {
    type: string,
    component: React$Element<*>,
    points: {
        [string]: PointConfiguration
    }
}

export type PortConfiguration = {
    type: string,
    component: React$Element<*>
}

export type PointConfiguration = {
    type: string,
    component: React$Element<*>
}

export type PositionConfiguration = {
    type: string,
    top: string,
    right: string,
    bottom: string,
    left: string,
    ports: {
        [string]: PortConfiguration
    }
}

export type Configuration = {
    nodes: {
        [string]: NodeConfiguration
    },
    links: {
        [string]: LinkConfiguration
    },
    enableDragging: boolean
}

/* -- Logging -- */

export type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error'

export type Log = (Array<*>) => void

export type Logger = {
    verbose: Log,
    debug: Log,
    info: Log,
    warn: Log,
    error: Log,
}
