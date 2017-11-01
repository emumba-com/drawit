export const makeUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })

export const toCache = array => array.reduce((output, item) => {
    output[item.id] = item
    return output
}, {})
