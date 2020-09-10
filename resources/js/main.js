import loadjs from 'loadjs'
import Vue from 'vue/dist/vue.esm.browser.js'
import Vuex from 'vuex/dist/vuex.esm.browser.min.js'
import VueRouter from 'vue-router/dist/vue-router.esm.browser.min.js'
import VTooltip from 'v-tooltip'
import VueSmoothScroll from 'vue-smoothscroll'
import Urlify from 'urlify'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { version } from '../../package.json'
import validateKey from './modules/validate-key.js'
import { wrapConfig } from './modules/config.js'
import { wrapLang } from './modules/lang.js'
import { wrapUtils } from './utils'
import * as urlUtils from './utils/url'
import * as objectUtils from './utils/object'
import * as metaUtils from './utils/meta'
import { loadModule, loadModules } from './modules/module-loader.js'
import { wrapEvents, addDefaultEvents } from './modules/events.js'
import { wrapPluggable } from './modules/pluggable.js'
import { wrapRequest } from './modules/server-request'
import { sharedStore, routerConfig, setParam } from './modules/vue-app'
import { watchedNames, createComponents, updateComponents, initOnScroll} from './modules/observer'
import getPolyfills, * as hasSupport from './utils/support.js'
import contentWrapper from '../vue/content-wrapper.vue'

function init() {

    const stack = '__awema_plugins_stack__'

    const AWEMA = {

        version,

        _inited: false,

        _watchedNames: watchedNames,

        notify(payload) {
            if ( objectUtils.isObject(payload) ) {
                let { status, message } = payload
                alert(`${status}:  ${message}`)
            } else {
                alert( String(payload) )
            }
        }
    }

    wrapConfig(AWEMA)
    wrapPluggable(AWEMA)
    window.AWEMA = AWEMA

    wrapEvents(AWEMA)
    addDefaultEvents(AWEMA)
    wrapLang(AWEMA)
    wrapRequest(AWEMA)

    wrapUtils(AWEMA, {
        loadModule,
        loadModules,
        ...urlUtils,
        ...metaUtils,
        object: objectUtils,
        support: hasSupport
    })

    // vue
    Vue.config.devtools = AWEMA_CONFIG.dev || false
    Vue.config.productionTip = AWEMA_CONFIG.dev || false
    window.Vue = Vue
    Vue.prototype.AWEMA = AWEMA
    Vue.prototype.$get = objectUtils.get
    Vue.prototype.$url = {
        ...urlUtils,
        urlify: Urlify.create(AWEMA._config.urlify)
    }
    Vue.component('content-wrapper', contentWrapper)

    // vuex
    window.Vuex = Vuex
    Vuex.Store.prototype.$set = function(param, data) {
        this.commit('setData', { param, data })
    }
    Vuex.Store.prototype.$unset = function(param) {
        this.commit('unsetData', param)
    }
    Vue.use(Vuex)
    AWEMA._store = new Vuex.Store(sharedStore)
    
    // vue-router
    VueRouter.prototype.$setParam = setParam
    Vue.use(VueRouter)
    AWEMA._vueRouter = new VueRouter(routerConfig)

    // v-tooltip
    Vue.use(VTooltip, {
        defaultClass: 'theme-default',
        popover: {
            defaultPlacement: 'right',
            defaultAutoHide: false,
            defaultTrigger: 'manual',
            defaultPopperOptions: {
                modifiers: {
                    flip: {
                        behavior: ['right', 'top']
                    }
                }

            }
        }
    })

    // smooth scroll
    Vue.use(VueSmoothScroll)

    // dayjs
    dayjs.extend(customParseFormat)
    Vue.prototype.$dayjs = dayjs


    function start() {

        AWEMA.emit('core:before-init')

        Promise.resolve()
            .then( () => {

                AWEMA._inited = true

                // validate key
                validateKey(AWEMA._config.key)
                    .then( result => {
                        Object.defineProperty(AWEMA, '_keyValid', {
                            value: result
                        })
                    })

                // load deferred plugins
                if ( window[stack] && window[stack].length ) {
                    let _stack = []
                    window[stack].forEach( plugin => {
                        _stack.push( AWEMA.use(plugin) )
                    })
                    return Promise.all(_stack)
                }

                return Promise.resolve()
            })
            .then( () => {

                // remove unnecessary data
                if ( window[stack] ) {
                    delete window[stack]
                }
                
                // set all lang variables from plugins
                Vue.prototype.$lang = AWEMA.lang

                // create Vue apps
                AWEMA._vueApps = []
                
                // create scroll observer
                AWEMA._initOnScroll = new IntersectionObserver(initOnScroll, { rootMargin: '200px 0px' })

                // inital call
                createComponents( document.querySelectorAll( AWEMA._watchedNames.join(', ') ) )

                AWEMA._bodyObserver = new MutationObserver(updateComponents)
                AWEMA._bodyObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                })
                
                AWEMA.emit('core:inited')
                
            })
            .catch( error => {
                console.log('Error initializing app: ', error);
            })
    }

    if ( document.readyState !== 'complete' ) {

        function deferredInit() {
            if ( document.readyState === 'complete' ) {
                document.removeEventListener('readystatechange', deferredInit );
                start()
            }
        }

        document.addEventListener('readystatechange', deferredInit );
    } else {
        start()
    }
}

const polyfills = getPolyfills()
polyfills.length ? loadjs(polyfills, 'polyfills', init) : init()