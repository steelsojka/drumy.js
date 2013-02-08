(function() {
  var checkVoices,
    __hasProp = Object.prototype.hasOwnProperty;

  checkVoices = function(voice, velocity) {
    if ((voice.velocityMax >= velocity && velocity >= voice.velocityMin)) {
      voice.trigger(velocity);
    }
  };

  Drumy.Pad = (function() {

    function Pad(options) {
      var key;
      this.voices = [];
      this.note = 32;
      for (key in options) {
        if (!__hasProp.call(options, key)) continue;
        this[key] = options[key];
      }
      this.output = this.context.createGainNode();
    }

    Pad.prototype.addVoice = function(options) {
      var voice;
      options = options || {};
      options.context = this.context;
      options.padOutput = this.output;
      voice = new Drumy.Voice(options);
      this.voices.push(voice);
      return voice;
    };

    Pad.prototype.getVoice = function(index) {
      if ((0 <= index && index < this.voices.length)) return this.voices[index];
    };

    Pad.prototype.setNoteNumber = function(number) {
      if ((0 <= number && number <= 127)) this.note = number;
      return this;
    };

    Pad.prototype.setGain = function(value) {
      this.output.gain.value = value;
      return this;
    };

    Pad.prototype.setName = function(name) {
      this.name = name;
      return this;
    };

    Pad.prototype.trigger = function(velocity) {
      var voice, _i, _len, _ref;
      _ref = this.voices;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        voice = _ref[_i];
        checkVoices(voice, velocity);
      }
      return this;
    };

    return Pad;

  })();

}).call(this);