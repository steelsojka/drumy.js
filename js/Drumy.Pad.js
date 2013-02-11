(function() {
  var checkVoices;

  checkVoices = function(voice, velocity) {
    if ((voice.velocityMax >= velocity && velocity >= voice.velocityMin)) {
      voice.trigger(velocity);
    }
  };

  Drumy.Pad = (function() {

    function Pad(options) {
      var voice, _i, _len, _ref;
      if (options == null) options = {};
      this.voices = [];
      this.context = options.context;
      this.note = options.note || 32;
      this.name = options.name || "Pad";
      this.output = this.context.createGainNode();
      if (options.voices) {
        _ref = options.voices;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          voice = _ref[_i];
          this.loadVoice(voice);
        }
      }
    }

    Pad.prototype.loadVoice = function(voice) {
      this.addVoice({
        url: voice.url,
        velocityMin: voice.vMin,
        velocityMax: voice.vMax,
        gain: 1,
        offset: voice.offset
      });
      return this;
    };

    Pad.prototype.addVoice = function(options) {
      var voice;
      if (options == null) options = {};
      options.context = this.context;
      options.padOutput = this.output;
      voice = new Drumy.Voice(options);
      this.voices.push(voice);
      return voice;
    };

    Pad.prototype.removeVoice = function(index) {
      var i, voice;
      if ((0 <= index && index < this.voices.length)) {
        voice = this.voices[index];
        i = this.voices.indexOf(voice);
        voice.destroy();
        this.voices.splice(i, 1);
      }
      return this;
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

    Pad.prototype.destroy = function() {
      var voice, _i, _len, _ref;
      _ref = this.voices;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        voice = _ref[_i];
        voice.destroy();
      }
    };

    return Pad;

  })();

}).call(this);
