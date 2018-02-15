import ReactDOM from 'react-dom'

export const makeUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })

export const toCache = array => array.reduce((output, item) => {
    output[item.id] = item
    return output
}, {})

/**
 * Returns a shallow copy of an object, without key/values specified by rest
 * of the arguments
 * 
 * @param {Object} object 
 * @param {Array<string>} keys 
 * @return {Object} - A shallow copy of input object without key/values provided
 */
export const without = (object, ...keys) =>
    Array.isArray(object)
        ? object
            .filter(item => keys.indexOf(item) < 0)
        : Object.keys(object)
            .filter(key => keys.indexOf(key) < 0)
            .reduce((r, key) => {
                r[key] = object[key]
                return r
            }, {})

export const isPointWithinRect = (p, r) => {
    const o = p.x > r.x && p.x < (r.x + r.width) && p.y > r.y && p.y < (r.y + r.height)
    // console.log(`is p[${p.x}, ${p.y}] within r[${r.x}, ${r.y}, ${r.width}, ${r.height}] = ${o}`)

    return o
}

export const getSnapTargetInRange = (point, snapTargets) =>
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

export const getCenterPoint = ({ mountedElement }) => {
        const node = ReactDOM.findDOMNode(mountedElement)
        const rect = node.getBoundingClientRect()

        return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
        }
    }
export const evaluteHOCParam = (param, props) => {
        if ( typeof param === 'function' ) {
            return param(props)
        }
        return param
    }

/**
 *
 * @param {string} key
 * @param {Object} thisProps
 * @param {Object} nextProps
 */
export const hasPropChanged = (
    key,
    thisProps,
    nextProps
  ) => thisProps[key] !== nextProps[key]
