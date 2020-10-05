import axios from 'axios/dist/axios.min.js'
import { LANG } from './lang'

const createErrorMessage = function() {
    const error = document.createElement('div')
    error.style.color = 'white'
    error.style.backgroundColor = 'rgba(255,100,100,.8)'
    error.style.padding = '1rem'
    error.style.position = 'fixed'
    error.style.right = '1rem'
    error.style.bottom = '1rem'
    error.innerText = LANG.API_KEY_ERROR
    document.body.appendChild(error)
}

const validateKey = function() {

    return new Promise( resolve => {
        axios({
            url: '/check',
            baseURL: 'https://repo.awema.pl/',
            params: { key: AWEMA._config.key }
        })
        .then( () => {
            resolve(true)
        })
        .catch( error => {
            resolve(false)
            console.error(LANG.API_KEY_ERROR)
            createErrorMessage()
        })
    })
}

export default validateKey
