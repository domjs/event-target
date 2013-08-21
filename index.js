
/**
 * Module exports.
 */

module.exports = EventTarget;

/**
 * `listeners` key name
 */

var key = '_eventtarget_listeners';

/**
 * W3C EventTarget implementation.
 * Create an instance manually, or use prototypal inheritance to subclass.
 *
 * References:
 *   - https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 *   - http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */

function EventTarget () {
  init(this);
}

function init (eventTarget) {
  eventTarget[key] = {};
}

/**
 * Register an event handler of a specific event type on the `EventTarget`.
 *
 * @api public
 */

function addEventListener (type, listener, useCapture) {
  var listeners = this[key];
  if (!listeners) {
    init(this);
    listeners = this[key];
  }
  listeners = listeners[type];
  if ('function' == typeof listeners) {
    // there's a single event listener for this `type` already,
    // need to create an array
    this[key][type] = [ listeners, listener ];
  } else if (listeners) {
    // `listeners` is already an array
    listeners.push(listener);
  } else {
    this[key][type] = listener;
  }
}

/**
 * Removes an event listener from the `EventTarget`.
 *
 * @api public
 */

function removeEventListener (type, listener, useCapture) {
  var listeners = this[key];
  if (listeners) {
    listeners = listeners[type];
    if ('function' == typeof listeners) {
      // `listeners` is a single function instance
      delete this[key][type];
    } else if (listeners) {
      // `listeners` is an array
      var index = listeners.indexOf(listener);
      if (-1 !== index) {
        listeners.splice(index, 1);
      }
    } else {
      // this listener doesn't seem to be registered in the first place...
    }
  }
}

/**
 * Dispatch an event to this `EventTarget.
 *
 * @api public
 */

function dispatchEvent (evt) {
  if (null == evt) throw new TypeError('Not enough arguments');
  if ('string' == typeof evt) {
    // NON-STANDARD API extension: pass a "string" in directly...
    evt = { type: evt };
  }
  var type = evt.type;
  if (!type) throw new Error('An attempt was made to use an object that is not, or is no longer, usable.');
  // set the `target` property on the Event instance
  evt.target = this;
  var listeners = this[key];
  if (!listeners) return true;
  listeners = listeners[type];
  if (!listeners) return true;
  if ('function' == typeof listeners) {
    // single callback function
    invoke(this, evt, listeners);
  } else {
    // an array of callback functions
    for (var i = 0, l = listeners.length; i < l; i++) {
      invoke(this, evt, listeners[i]);
    }
  }
  return !evt.defaultPrevented;
}

/**
 * Invokes the given `fn` in a try/catch with `target` as "this" and the `evt`
 * event instance as the only passed in argument.
 *
 * @api private
 */

function invoke (target, evt, fn) {
  try {
    fn.call(target, evt);
  } catch (e) {
    uncaught(e);
  }
}

/**
 * Throws the Error instance `e` as an "uncaught exception".
 *
 * @param {Error} e Error object to throw as "uncaught"
 * @api private
 */

function uncaught (e) {
  if ('object' == typeof process && process.emit) {
    // is Node.js
    process.emit('uncaughtException', e);
  } else if ('object' == typeof window && window.onerror) {
    // assume we're in the Browser
    window.onerror(e.message, __filename, 0);
  } else if ('object' == typeof console && console.error) {
    console.error('UNCAUGHT', e);
  }
}

EventTarget.prototype.addEventListener = addEventListener;
EventTarget.prototype.removeEventListener = removeEventListener;
EventTarget.prototype.dispatchEvent = dispatchEvent;
EventTarget.prototype[key] = void(0);
