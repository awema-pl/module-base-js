export function hasPromise() {
    try {
        new Promise(function(){}).finally(function(){})
        return true
    } catch(e) {
        return false
    }
}


export function hasObjectAssign() {
    return typeof Object.assign === 'function'
}


export function hasIntersectionObserver() {
    return typeof window.IntersectionObserver === 'function'
}


export function hasMutationObserver() {
    return typeof window.MutationObserver === 'function'
}


export function hasHistory() {

    const ua = navigator.userAgent;

    // omit buggy implementation
    if ((ua.indexOf('Android 2.') !== -1 ||
        (ua.indexOf('Android 4.0') !== -1)) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1 &&
        location.protocol !== 'file:') {
        return false;
    }

    // regular check
    return (window.history && typeof window.history.pushState === 'function');
}


export function hasCSSVariables() {

    // get CSS supports function
    let supportsFn = (window.CSS && window.CSS.supports.bind(window.CSS)) || (window.supportsCSS)

    return !!supportsFn && (supportsFn('--test:0') || supportsFn('--test', 0))
}


/**
 * Get required polyfills for initialization
 * 
 * @return {Array} array of polyfill sources
 */
export default function getPolyfills() {

    const polyfills = []

    if ( ! hasPromise() ) {
        polyfills.push('https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js')
    }

    if ( ! hasObjectAssign() ) {
        polyfills.push('https://cdn.jsdelivr.net/npm/object-assign-polyfill@0.1.0/index.min.js')
    }

    if ( ! hasIntersectionObserver() ) {
        polyfills.push('https://cdn.jsdelivr.net/npm/intersection-observer-polyfill@0.1.0/dist/IntersectionObserver.js')
    }

    if ( ! hasMutationObserver() ) {
        polyfills.push('https://cdn.jsdelivr.net/npm/mutationobserver-shim/dist/mutationobserver.min.js')
    }

    // if ( ! hasCSSVariables() ) {
    //     polyfills.push('https://cdn.jsdelivr.net/npm/css-vars-ponyfill@1')
    // }

    return polyfills
}