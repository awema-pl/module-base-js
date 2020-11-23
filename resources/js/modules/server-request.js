import axios from 'axios/dist/axios.min.js'
import { getMeta } from '../utils/meta'
import { get, isEmpty } from '../utils/object'

export function serverRequest(params = {}, url, method = 'post') {

    let requestParams = {
        url,
        method,
        timeout: AWEMA._config.ajax.serverRequestTimeout,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        }
    }

    if (requestParams.method.toLowerCase() === 'get') {
        requestParams.params = params;
    } else {
        // fresh value of CSRF token
        const token = getMeta('csrf-token')
        if (token) params._token = token
        requestParams.data = params;
    }

    let timer = setTimeout(() => {
        AWEMA.emit('core:ajax', { url, active: true })
    }, +AWEMA._config.ajax.loadingDelay );

    return new Promise( resolve => {

        let redirect
        let showModal

        const serverResponse = {
            success: true
        };

        axios(requestParams)
            .then(response => {

                // check for redirect
                redirect = get(response, 'data.redirectUrl')

                // check for show modal
                showModal = get(response, 'data.showModal')

               let message = get(response, 'data.message');
                if (message) {
                    AWEMA.notify({
                        status: 'success',
                        message: message
                    });
                } else if (showModal){
                    let modalName = get(response, 'data.showModal.modalName')
                    let storeDataParam = get(response, 'data.showModal.storeDataParam')
                    let storeData = get(response, 'data.showModal.storeData')
                    setTimeout( () => {
                        AWEMA._store.commit('setData', {param: storeDataParam, data: storeData});
                        AWEMA.emit('modal::'+modalName+':open');
                    }, 0)

                }

                serverResponse.data = response.data
            })
            .catch( error => {

                serverResponse.success = false

                // check for Laravel error response
                if ( [422, 429].includes( get(error, 'response.status') ) ) {
                    serverResponse.data = get(error, 'response.data.errors')
                }

                // show nothing if errors present
                if ( ! isEmpty(serverResponse.data) ) return

                // check which message to show
                let message = get(error, 'response.data.message')

                // error from response
                if ( message ) {
                    AWEMA.notify({
                        status: 'error',
                        message
                    });

                // error from Error object
                } else if ( error.message ) {
                    AWEMA.notify({
                        status: 'error',
                        message: error.message
                    });

                // timeout error if nothing found
                } else {
                    AWEMA.notify({
                        status: 'error',
                        message: AWEMA.lang.TIMEOUT_ERROR
                    });
                }
            })
            .finally( () => {

                clearTimeout(timer);

                if (showModal){
                    resolve( serverResponse )
                } else if (redirect) {
                    window.location.href = redirect
                    resolve( serverResponse )
                } else {
                    resolve( serverResponse )

                    // shedule OFF loading event
                    setTimeout( () => {
                        AWEMA.emit('core:ajax', {url, active: false})
                    }, 0)
                }
            })
    })
}

export function wrapRequest( context ) {

    Object.defineProperty( context, 'ajax', {
        value: serverRequest
    })
}
