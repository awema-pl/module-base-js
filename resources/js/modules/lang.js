export const LANG = {
    API_KEY_ERROR: 'API key is invalid',
    TIMEOUT_ERROR: 'Timeout error',
    CONTENT_EMPTY: "No data",
    CONTENT_ERROR: "Error",
    CONTENT_LOADING: "Loading..."
}

export function wrapLang( context ) {

    let _lang = Object.assign( {}, LANG, context._config.lang )
    delete context._config.lang

    Object.defineProperty( context, 'lang', {
        get() {
            return _lang
        },
        set( lang ) {
            try {
                let merged = Object.assign( lang, _lang )
                _lang = merged
            } catch (e) {
                console.log('Error setting lang: ', e);
            }
        }
    })
}
