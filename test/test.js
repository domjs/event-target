
var assert = require('assert');
var Event = require('event');
var EventTarget = require('../');

describe('EventTarget', function () {

  it('should export a constructor function', function () {
    assert('function' == typeof EventTarget);
    var instance = new EventTarget();
    assert(instance instanceof EventTarget);
  });

  it('should have the `addEventListener` function', function () {
    var instance = new EventTarget();
    assert('function' == typeof instance.addEventListener);
  });

  it('should have the `removeEventListener` function', function () {
    var instance = new EventTarget();
    assert('function' == typeof instance.removeEventListener);
  });

  it('should have the `dispatchEvent` function', function () {
    var instance = new EventTarget();
    assert('function' == typeof instance.dispatchEvent);
  });

  describe('dispatching events', function () {

    it('should work with 1 listener', function () {
      var type = 'event';
      var count = 0;
      var event = new Event(type);
      var instance = new EventTarget();
      function one (e) {
        count++;
      }
      instance.addEventListener(type, one, false);
      assert(0 === count);
      instance.dispatchEvent(event);
      assert(1 === count);
    });

    it('should work with 2 listener', function () {
      var type = 'event';
      var count1 = 0;
      var count2 = 0;
      var event = new Event(type);
      var instance = new EventTarget();
      function one (e) {
        count1++;
      }
      function two (e) {
        count2++;
      }
      instance.addEventListener(type, one, false);
      assert(0 === count1);
      assert(0 === count2);
      instance.dispatchEvent(event);
      assert(1 === count1);
      assert(0 === count2);
      instance.addEventListener(type, two, false);
      instance.dispatchEvent(event);
      assert(2 === count1);
      assert(1 === count2);
    });

  });

  describe('cancelling events', function () {

    it('should return `false` if the event was cancelled', function () {
      var type = 'event';
      var event = new Event(type);
      event.initEvent(type, true, true);
      var instance = new EventTarget();
      function one (e) {
        e.preventDefault();
      }
      instance.addEventListener(type, one, false);
      var rtn = instance.dispatchEvent(event);
      assert(false === rtn);
    });

    it('should return `true` if the event was not cancelled', function () {
      var type = 'event';
      var event = new Event(type);
      event.initEvent(type, true, true);
      var instance = new EventTarget();
      function one (e) {
        // no-op
      }
      instance.addEventListener(type, one, false);
      var rtn = instance.dispatchEvent(event);
      assert(true === rtn);
    });

  });

});
