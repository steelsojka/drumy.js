(function() {
  var checkVoices, _bindVoiceEvents, _handleVoiceEvent;

  checkVoices = function(voice, velocity) {
    if ((voice.velocityMax >= velocity && velocity >= voice.velocityMin)) {
      voice.trigger(velocity);
    }
  };

  _bindVoiceEvents = function() {
    var voice, _i, _len, _ref;
    _ref = this.voices;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voice = _ref[_i];
      voice.off('sampleStart sampleEnd', _handleVoiceEvent.bind(this));
      voice.on('sampleStart sampleEnd', _handleVoiceEvent.bind(this));
    }
  };

  _handleVoiceEvent = function(e) {
    return this.emit(e.type, e.target);
  };

  Drumy.Pad = (function() {

    function Pad(options) {
      var voice, _i, _len, _ref;
      if (options == null) options = {};
      this.voices = [];
      this.note = [];
      this.context = options.context;
      this.name = options.name || "Pad";
      if (Array.isArray(options.note)) {
        this.note = this.note.concat(options.note);
      } else if (options.note) {
        this.note.push(options.note);
      } else {
        this.note.push(32);
      }
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
      this.addVoice(voice);
      return this;
    };

    Pad.prototype.save = function() {
      var voice;
      return {
        "name": this.name,
        "note": this.note,
        "voices": (function() {
          var _i, _len, _ref, _results;
          _ref = this.voices;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            voice = _ref[_i];
            _results.push(voice.save());
          }
          return _results;
        }).call(this)
      };
    };

    Pad.prototype.addVoice = function(options) {
      var voice;
      if (options == null) options = {};
      options.context = this.context;
      options.padOutput = this.output;
      voice = new Drumy.Voice(options);
      this.voices.push(voice);
      _bindVoiceEvents.call(this);
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
      if ((0 <= number && number <= 127) && this.note.indexOf(number) === -1) {
        this.note.push(number);
      }
      return this;
    };

    Pad.prototype.removeNoteNumber = function(number) {
      var index;
      index = this.note.indexOf(number);
      if (index === -1) return;
      this.note.splice(index, 1);
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

  if (Drumy.Event != null) Drumy.Event.register(Drumy.Pad);

}).call(this);
