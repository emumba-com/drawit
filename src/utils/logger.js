/* @flow */

import type { LogLevel, Log, Logger } from '../types'

const ordinals = {
    'verbose': 1,
    'debug': 2,
    'info': 3,
    'warn': 4,
    'error': 5,
    'silent': 6
}

export default ( logLevel: LogLevel ): Logger => {
    const n = ordinals[logLevel] - 1
    const v = ordinals['verbose'] > n
    const d = ordinals['debug']   > n
    const i = ordinals['info']    > n
    const w = ordinals['warn']    > n
    const e = ordinals['error']   > n

    const logger: Logger = {
        logLevel,
        verbose: (...args) => {
            if ( v ) {
                console.log('[drawit][verbose] ', ...args)
            }
        },
        debug: (...args) => {
            if ( d ) {
                console.log('[drawit][debug] ', ...args)
            }
        },
        info: (...args) => {
            if ( i ) {
                console.log('[drawit][info] ', ...args)
            }
        },
        warn: (...args) => {
            if ( w ) {
                console.log('[drawit][warn] ', ...args)
            }
        },
        error: (...args) => {
            if ( e ) {
                console.error('[drawit][error] ', ...args)
            }
        }
    }

    return logger
}