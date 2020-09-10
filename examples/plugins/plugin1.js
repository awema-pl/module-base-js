(function(){
    const plugin = {

        install: function( AWEMA ) {
            AWEMA.on('test', function(e){
                console.log('From plugin 1 ', e.detail);
            })
            AWEMA.lang = {
                TEST_LANG_VAR: 'This shoul not appear if defined in AWEMA_CONFIG'
            }
        }
    }

    if (window && 'AWEMA' in window) {
        AWEMA.use(plugin)
    } else {
        window.__awema_plugins_stack__ = window.__awema_plugins_stack__ || []
        window.__awema_plugins_stack__.push(plugin)
    }
})()
