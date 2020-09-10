(function(){
    const plugin = {

        // no install function
    }

    if (window && 'AWEMA' in window) {
        AWEMA.use(plugin)
    } else {
        window.__awema_plugins_stack__ = window.__awema_plugins_stack__ || []
        window.__awema_plugins_stack__.push(plugin)
    }
})()
