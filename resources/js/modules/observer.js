// import { get } from '../utils/object'

/**
 * Init Vue app
 *
 * @property {HTMLElement} el - custom element to init
 */
export function initComponent(el) {
    el.removeAttribute('lazy')

    let app = new Vue({ 
        el,
        store: AWEMA._store,
        router: AWEMA._vueRouter
    })

    AWEMA._vueApps.push( app )

    app.$once('hook:destroyed', () => {
        let idx = AWEMA._vueApps.indexOf(app)
        if (idx > -1) AWEMA._vueApps.splice(idx, 1)
    })
}

/**
 * Loads components on scroll. IntersectionObserver callback
 *
 * @prop {Array} entries  IntersectionObserver entries
 * @prop {IntersectionObserver} observer IntersectionObserver
 */

export function initOnScroll(entries, observer) {
    entries.forEach( function(entry, index) {
        if (entry.intersectionRatio) {
            observer.unobserve(entry.target)
            initComponent(entry.target)
        }
    })
}


/**
 * Default custom elements to observe
 */
export const watchedNames = ['content-wrapper']


/**
 * Finds custom elements and creates Vue apps
 * or adds them to scroll observer for "lazy" loading
 */

export function createComponents(els) {

    if ( ! (els && els.length) ) return

    for ( let i = 0; i < els.length; i++ ) {
        let el = els[i]
        if ( el.isConnected === false || ! document.documentElement.contains(el) ) continue
        let lazy = el.getAttribute('lazy')
        if ( lazy === null || lazy === 'false' ) {
            initComponent(el)
        } else {
            AWEMA._initOnScroll.observe(el)
        }
    }
}


export function findComponentsToRemove(removedNodes) {

    let toRemove = [],
        ids = [];

    for (let i = 0, length = removedNodes.length; i < length; i++ ) {

        let removedNode = removedNodes[i]

        AWEMA._vueApps.forEach( app => {

            let el = app.$el

            if ( ids.indexOf(app._uid) === -1 &&
                 (el === removedNode || removedNode.contains(el)) ) {
                ids.push(app._uid)
                toRemove.push(app)
            }
        });
    }

    ids = null

    return toRemove
}


export function removeComponents(apps) {

    if ( ! (apps && apps.length) ) return
    
    apps.forEach( app => {

        destroyVue(app)
    })
}


export function destroyVue(component) {
    component.$children.forEach(destroyVue)
    component.$destroy()
    delete component.$el.__vue__
    component = null
}


export function updateComponents(mutations) {

    mutations.forEach( record => {
        
        let toCreate = document.querySelectorAll(AWEMA._watchedNames.join(', '))
        createComponents(toCreate)

        removeComponents(findComponentsToRemove(record.removedNodes))
    })
}