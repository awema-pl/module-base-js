import { loadModules } from './module-loader.js'

export function wrapPluggable( context ) {

    Object.defineProperty(context, 'use', {
        get() {
            return function use( plugin ) {
                if ( ! this._inited ) {
                    window.__awema_plugins_stack__ = window.__awema_plugins_stack__ || []
                    window.__awema_plugins_stack__.push(plugin)
                    return Promise.resolve()
                }
                return loadModules( plugin.modules )
                    .then(() => plugin.install && plugin.install(this))
                    .catch(error => {
                        console.warn('Error installing plugin: ', plugin, error);
                    })
            }
        }
    })
}
