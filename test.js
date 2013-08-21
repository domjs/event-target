
var EventTarget = require('./');
console.log(EventTarget.prototype);

var e = new EventTarget();
console.log(e);

e.addEventListener('test', function (e) {
  console.error('"test" event', e);
});
console.log(e);

var event = {
  type: 'test'
};
var rtn = e.dispatchEvent(event);
console.log('dispatchEvent rtn:', rtn);
