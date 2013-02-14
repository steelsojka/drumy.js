(function() {
  var Drumy,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = Object.prototype.hasOwnProperty;

  Drumy = {};

  Drumy.Event = (function() {

    function Event() {}

    Event.prototype.on = function(events, listener) {
      var event, _base, _i, _len, _ref;
      this._events || (this._events = {});
      _ref = events.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        (_base = this._events)[event] || (_base[event] = []);
        this._events[event].push(listener);
      }
    };

    Event.prototype.off = function(events, listener) {
      var event, _i, _len, _ref;
      this._events || (this._events = {});
      _ref = events.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        if (__indexOf.call(this._events, event) < 0) continue;
        this._events[event].splice(this._events[event].indexOf(listener), 1);
      }
    };

    Event.prototype.emit = function(events) {
      var binding, event, _i, _j, _len, _len2, _ref, _ref2;
      this._events || (this._events = {});
      _ref = events.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        if (!(event in this._events)) continue;
        _ref2 = this._events[event];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          binding = _ref2[_j];
          binding.apply(this, [
            {
              type: event,
              target: this
            }
          ].concat(Array.prototype.slice.call(arguments, 1)));
        }
      }
    };

    return Event;

  })();

  Drumy.Event.register = function(obj) {
    var key, prop, _ref;
    _ref = Drumy.Event.prototype;
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      prop = _ref[key];
      obj.prototype[key] = prop;
    }
  };

  this.Drumy = Drumy;

}).call(this);
