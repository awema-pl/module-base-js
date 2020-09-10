export const BODY_NO_SCROLL_CLASS = 'awema-overflow-hidden'

export function eventPolyfill () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

export function wrapEvents( context ) {

    eventPolyfill()

    Object.defineProperties(context, {

        'on': {
            value: function on(event, handler, capture = false) {
                window.addEventListener(event, handler, capture)
            }
        },

        'off': {
            value: function off(event, handler, capture = false) {
                window.removeEventListener(event, handler, capture)
            }
        },

        'once': {
            value: function once(event, handler, capture = false) {
                window.addEventListener(event, function func (data){
                    handler(data)
                    window.removeEventListener(event, func, capture)
                }, capture)
            }
        },

        'emit': {
            value: function emit(event, payload) {
                let e = new CustomEvent(event, {
                    detail: payload
                });
                window.dispatchEvent(e);
            }
        }
    })

    return context
}

export function fixBody(shouldFix) {
    document.documentElement.classList[shouldFix ? 'add' : 'remove'](BODY_NO_SCROLL_CLASS)
}

export function addDefaultEvents(context) {

    context.on('body.noscroll', () => {
        fixBody(true)
    })

    context.on('body.scroll', () => {
        fixBody(false)
    })
}
