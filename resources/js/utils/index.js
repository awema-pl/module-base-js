/**
 * Exports helpers to global
 *
 * @param {Object} context - global variable
 * @param {Object} helperObject - object with helper methods
 *
 * @returns global variable with added utils
 *
 */

export function wrapUtils(context, helperObject) {

    context.utils = context.utils || {}

    Object.assign(context.utils, helperObject)

    return context
}


/**
 * Sets a deprecation 'message' on 'target', when getting it's `key`
 *
 * @param {Object} target - targat, containing deprecated `key`
 * @param {String} key - key to deprecate
 * @param {Any} replacer - a new object instead of old
 * @param {String} message - deprecation message in console
 */

export function deprecate(target, key, replacer, message) {

    Object.defineProperty(target, key, {
        get() {
            console.warn(message)
            return replacer
        },
        set(val) {
            replacer = val
        }
    })
}


export function getFunctionName(fn) {
    var result = /^function\s+([\w\$]+)\s*\(/.exec( fn.toString() )
    return result ? result[ 1 ]  :  ''
}