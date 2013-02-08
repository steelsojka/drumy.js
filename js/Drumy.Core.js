(function() {
  var Drumy, checkPad,
    __hasProp = Object.prototype.hasOwnProperty;

  Drumy = {};

  checkPad = function(pad, note, velocity) {
    if (pad.note === note) pad.trigger(velocity);
  };

  Drumy.Core = (function() {

    function Core(options) {
      var key;
      options = options || {};
      this.context = options.context || new webkitAudioContext();
      this.pads = [];
      this.output = this.context.createGainNode();
      this.connectToMaster = true;
      for (key in options) {
        if (!__hasProp.call(options, key)) continue;
        this[key] = options[key];
      }
      if (this.connectToMaster) this.connect(this.context.destination);
    }

    Core.prototype.addPad = function(options) {
      var pad;
      options = options || {};
      options.context = this.context;
      pad = new Drumy.Pad(options);
      pad.output.connect(this.output);
      this.pads.push(pad);
      return pad;
    };

    Core.prototype.getPad = function(index) {
      if ((0 <= index && index < this.pads.length)) return this.pads[index];
    };

    Core.prototype.connect = function(node) {
      this.output.connect(node);
      return this;
    };

    Core.prototype.getContext = function() {
      return this.context;
    };

    Core.prototype.trigger = function(note, velocity) {
      var pad, _i, _len, _ref;
      _ref = this.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        checkPad(pad, note, velocity);
      }
      return this;
    };

    return Core;

  })();

  Drumy.create = function(options) {
    return new Drumy.Core(options);
  };

  this.Drumy = Drumy;

}).call(this);