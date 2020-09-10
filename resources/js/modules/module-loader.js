import loadjs from 'loadjs'

export const loadModule = ( name, src, callback ) => {

    return new Promise( resolve => {

        function resolver() {
            if ( typeof callback === 'function' ) {
                loadjs.ready(name, callback)
                resolve()
            } else {
                resolve()
            }
        }

        if ( loadjs.isDefined(name) ) {
            resolver()
        } else {
            loadjs(src, name, resolver)
        }
    })
}

export const loadDependentModule = ( deps, name, src, callback ) => {

    return new Promise( resolve => {
        loadjs.ready(deps, function() {
            loadModule(name, src, callback).then( resolve )
        })
    })
}

export const loadModules = ( modules ) => {

    if ( ! modules || ! Object.keys(modules).length ) return Promise.resolve()

    return new Promise( (resolve, reject) => {

        const names = Object.keys(modules)
        const loaders = []

        for ( let i = 0; i < names.length; i++ ) {

            let name = names[i]
            let src = typeof modules[name] === 'string' ? modules[name] : modules[name].src
            let deps = modules[name].deps
            if ( deps ) {
                loaders.push( loadDependentModule(deps, name, src, modules[name].cb) )
            } else {
                loaders.push( loadModule(name, src, modules[name].cb) )
            }
        }

        Promise.all( loaders )
            .then(resolve)
            .catch( e => {
                console.log('Error loading modules: ', e);
            })
    })
}
