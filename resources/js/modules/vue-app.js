import { get, set, pathToArr, forEach, isEmpty } from '../utils/object'
import { parseQuery, stringifyQuery } from '../utils/url'

export const sharedStore = {

    strict: get(AWEMA_CONFIG, 'dev'),

    state: {},

    mutations: {
        
        setData(state, {param, data}) {
            if ( ! param || typeof param !== 'string' ) {
                console.error('Store: param must be a string, ', param, ' given')
                return
            }
            let path = pathToArr(param)
            let key = path.shift()
            let obj

            if ( path.length ) {
                obj = Object.assign({}, state[key])
                set(obj, path.join('.'), data)
            } else {
                obj = data
            }
            
            Vue.set(state, key, obj)
        },

        unsetData(state, param) {
            Vue.delete(state, param)
        }
    }
}

export const routerConfig = { 
    mode: 'history',
    parseQuery,
    stringifyQuery: obj => {
        const queryStr = stringifyQuery(obj)
        return isEmpty(queryStr) ? '' : ('?' + queryStr)
    }
}

/**
 * Modifies VueRouter current GET-params and pushes next route
 * applied to VueRouter.prototype
 * 
 * @param {Object} queryObj - params object. If param is set to `null`, 
 *                           `undefined`, or empty `String`,
 *                          it will be deleted from query.
 *                          To set param=null, pass a string `'null'`
 * @param {Boolean} push - true to use history.pushState,
 *                         false to use history.replaceState
 *
 * @return {Object<VueRouter>} - AWEMA._vueRouter - global Vue router instance
 */
export function setParam(queryObj, push = true) {

    // do nothing if nothing passed
    if ( isEmpty(queryObj) ) return

    // shallow copy next route is enough for reactivity
    let next = Object.assign({}, this.currentRoute)

    // shallow copy route query
    let query = Object.assign({}, this.currentRoute.query)

    // merge queries
    Object.assign(query, queryObj)

    // remove null values
    query = forEach(query, function(val, key, obj) {
        if ( typeof val === 'undefined' || val === '' || val === null ) {
            delete obj[key]
        }
    })

    // set query and push route
    next.query = query
    this[push ? 'push' : 'replace'](next)

    return this
}