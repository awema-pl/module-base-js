(function(){
    const plugin = {

        install: function( AWEMA ) {
            AWEMA.on('test', function(e){
                console.log('From plugin 2 ', e.detail);
            })
        }
    }

    if (window && 'AWEMA' in window) {
        AWEMA.use(plugin)
    } else {
        window.__awema_plugins_stack__ = window.__awema_plugins_stack__ || []
        window.__awema_plugins_stack__.push(plugin)
    }
})()
