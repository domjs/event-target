
var EventTarget = require('./');
console.log(EventTarget.prototype);

var target = new EventTarget();
console.log(target);

function first (e) {
  console.error('"test" event', e);
  throw new Error('test error');
}
target.addEventListener('test', first, false);
console.log(target);

var event = {
  type: 'test'
};
var rtn = target.dispatchEvent(event);
console.log('dispatchEvent rtn:', rtn);



function second (e) {
  console.error('"test" event 2', e);
  e.defaultPrevented = true;
  throw new Error('test error 2');
}
target.addEventListener('test', second, false);
console.log(target);

rtn = target.dispatchEvent(event);
console.log('dispatchEvent rtn 2:', rtn);

target.removeEventListener('test', second);

rtn = target.dispatchEvent(event);
console.log('dispatchEvent rtn 3:', rtn);

target.removeEventListener('test', first);

rtn = target.dispatchEvent(event);
console.log('dispatchEvent rtn 4:', rtn);
