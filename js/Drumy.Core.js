(function() {
  var checkPad,
    __hasProp = Object.prototype.hasOwnProperty;

  checkPad = function(pad, note, velocity, delay) {
    if (pad.note.indexOf(note) !== -1) pad.trigger(velocity, delay);
  };

  Drumy.Core = (function() {

    function Core(options) {
      var key;
      if (options == null) options = {};
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

    Core.prototype.loadConfig = function(configJSON) {
      var pad, _i, _len, _ref;
      _ref = configJSON.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        this.addPad(pad);
      }
      return this;
    };

    Core.prototype.save = function() {
      var pad, _pads;
      _pads = (function() {
        var _i, _len, _ref, _results;
        _ref = this.pads;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pad = _ref[_i];
          _results.push(pad.save());
        }
        return _results;
      }).call(this);
      return JSON.stringify({
        pads: _pads
      });
    };

    Core.prototype.addPad = function(options) {
      var pad;
      options || (options = {});
      options.context = this.context;
      pad = new Drumy.Pad(options);
      pad.output.connect(this.output);
      this.pads.push(pad);
      return pad;
    };

    Core.prototype.removePad = function(index) {
      if ((0 <= index && index < this.pads.length)) this.pads[index].destroy();
      return this;
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

    Core.prototype.trigger = function(note, velocity, delay) {
      var pad, _i, _len, _ref;
      _ref = this.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        checkPad(pad, note, velocity, delay);
      }
      return this;
    };

    return Core;

  })();

  Drumy.create = function(options) {
    return new Drumy.Core(options);
  };

  if (Drumy.Event != null) Drumy.Event.register(Drumy.Core);

}).call(this);
