export const CONFIG = {
    ajax: {
        loadingDelay: 200, // ms
        serverRequestTimeout: 30000 // 30 seconds
    },
    urlify: {
        spaces: '-',
        toLower: true,
        trim: true,
        addEToUmlauts: true,
        nonPrintable: '',
        failureOutput: ''
    }
}

export function wrapConfig( context ) {

    if ( typeof AWEMA_CONFIG === typeof undefined ) {
        console.error('No config found')
    }

    let _config = Object.assign(CONFIG, AWEMA_CONFIG)

    Object.defineProperty(context, '_config', {
        value: _config
    })
}
