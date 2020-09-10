<template>
    <component
        :is="tag"
        class="content-wrapper"
        :class="{'is-empty': isEmpty, 'is-loading': isLoading, 'has-error': hasError, 'has-content': ! isEmpty && ! hasError}"
    >

        <!-- empty -->
        <slot name="empty" v-if="isEmpty && ! hasError && ! isLoading">{{ $lang.CONTENT_EMPTY }}</slot>

        <!-- loading -->
        <slot name="loading" v-if="isLoading">{{ $lang.CONTENT_LOADING }}</slot>

        <!-- error -->
        <slot name="error" v-if="hasError && ! isLoading">{{ $lang.CONTENT_ERROR }}</slot>
        
        <!-- default -->
        <slot v-bind="content" v-if="! isEmpty && ! hasError"></slot>

    </component>
</template>

<script>
import { isEmpty } from '../js/utils/object'

let _uniqId = 0
let _uniqName = function() {
    return 'content-wrapper-' + this._uniqId
}

export default {

    name: 'content-wrapper',


    props: {

        name: {
            type: String,
            default: _uniqName
        },

        tag: {
            type: String,
            default: 'div'
        },

        default: {
            default: null
        },

        storeData: {
            type: String,
            default: _uniqName
        },

        url: String,

        checkEmpty: {
            type: Function,
            default: isEmpty
        }

        // method: {
        //     type: String,
        //     default: 'GET'
        // }
    },


    data() {
        return {
            hasError: false
        }
    },


    computed: {

        loadingName() {
            return this.storeData + '_loading'
        },

        isLoading() {
            return this.$store.state[this.loadingName];
        },

        providesData() {
            return !! ( this.url || this.default ) || isEmpty(this.$slots.default)
        },

        isEmpty() {
            if ( this.providesData ) {
                return this.checkEmpty(this.data)
            } else {
                return isEmpty(this.$slots.default)
            }
        },

        data() {
            return this.$store.state[this.storeData]
        },

        content() {
            return typeof this.data === 'object' && ! Array.isArray(this.data) ?
                   this.data :
                   { data: this.data }
        },

        isDev() {
            return AWEMA_CONFIG.dev
        }
    },


    watch: {

        url(oldVal, newVal) {
            if (oldVal !== newVal) this.fetchData()
        },

        hasError(error) {
            this.$emit('error', error)
        },

        isLoading(loading) {
            this.$emit('loading', loading)
        }
    },


    methods: {

        setLoader(event) {
            let data = event.detail
            if ( data.url !== this.url ) return
            this.$store.$set(this.loadingName, data.active)
        },

        fetchData() {
            
            /* uncomment to test loading with 2 seconds delay */
            // this.setLoader({url: this.url, detail: true})
            // AWEMA.ajax({}, this.url, this.method)
            //     .then( res => {
            //         setTimeout(() => {
            //             this.setLoader({url: this.url, detail: false})

            //             if ( res.success ) {
            //                 AWEMA._store.commit('setData', {
            //                     param: this.storeData,
            //                     data: res.data
            //                 });
            //                 this.hasError = false;
            //             } else {
            //                 this.hasError = true
            //             }
            //         }, 2000)
            //     })

            /* comment to test loading */
            AWEMA.on('core:ajax', this.setLoader)
            AWEMA.ajax(null, this.url, 'get'/*this.method*/)
                .then( res => {

                    // unsubscribe from default 'core:ajax' event to prevent 'no-content' blink
                    AWEMA.off('core:ajax', this.setLoader)

                    if ( res.success ) {
                        this.$store.$set(this.storeData, res.data)
                        this.hasError = false
                    } else {
                        this.hasError = true
                    }
                })
                .then( () => {
                    // disable loading state manually after response handler
                    if ( this.isLoading ) {
                        this.setLoader({detail: {url: this.url, active: false}})
                    }
                })
        },

        update() {
            if ( this.url ) this.fetchData()
        }
    },


    beforeCreate() {
        this._uniqId = _uniqId++
    },


    created() {
        if ( this.default ) {
            this.$store.$set(this.storeData, this.default)
        } else if ( this.url ) {
            this.setLoader({detail: {url: this.url, active: true}}) // set loading state
            this.fetchData()
        }

        AWEMA.on(`content::${this.name}:update`, this.update)
    },


    errorCaptured(error, component, info) {
        this.hasError = true
        let errorHandler = Vue.config.errorHandler
        if ( this.isDev ) {
            AWEMA.notify({status:'error', message: error.message})
            console.log(error, component, info)
        } else if ( typeof errorHandler === 'function' ) {
            errorHandler(error, component, info)
        }
        return false
    },


    beforeDestroy() {
        AWEMA.off('core:ajax', this.setLoader)
        AWEMA.off(`content::${this.name}:update`, this.update)
        this.$store.$unset(this.storeData)
    }
}
</script>
