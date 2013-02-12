/**
 * Drumy.js v0.1
 *
 * A customizable drum pad console for trigger drum sounds
 * @author Steven Sojka - Tuesday, February 12, 2013
 *
 * MIT Licensed
 */
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
(function() {
  var Sample;

  Sample = (function() {

    function Sample(buffer, velocity, offset, min, max, output, context) {
      this.context = context;
      this.offset = offset;
      this.source = context.createBufferSource();
      this.gainNode = context.createGainNode();
      this.source.buffer = buffer;
      this.source.connect(this.gainNode);
      this.gainNode.connect(output);
      this.trigger(velocity, min, max);
    }

    Sample.prototype.trigger = function(velocity, min, max) {
      this.source.start(this.context.currentTime + this.offset);
      this.gainNode.gain.value = velocity / 127;
      setTimeout(this.destroy.bind(this), (this.source.buffer.duration + this.offset) * 1000);
    };

    Sample.prototype.destroy = function() {
      this.source.disconnect(0);
      this.gainNode.disconnect(0);
    };

    return Sample;

  })();

  Drumy.Voice = (function() {

    function Voice(option) {
      if (option == null) option = {};
      this.velocityMax = options.velocityMax || 127;
      this.velocityMin = options.velocityMin || 0;
      this.offset = options.offset || 0;
      this.context = options.context;
      this.padOutput = options.padOutput;
      this.output = this.context.createGainNode();
      this.output.connect(this.padOutput);
      if (options.gain) this.setGain(options.gain);
      if (options.url) this.loadFromUrl(options.url);
      if (this.buffer) this.loadBuffer(this.buffer);
    }

    Voice.prototype.loadFromUrl = function(url, callback) {
      var request,
        _this = this;
      request = new XMLHttpRequest();
      request.open('GET', url);
      request.responseType = 'arraybuffer';
      request.onload = function(res) {
        _this.context.decodeAudioData(res.currentTarget.response, function(buff) {
          _this.loadBuffer(buff);
          if (typeof callback === "function") callback();
        });
      };
      request.send();
      return this;
    };

    Voice.prototype.loadBuffer = function(buffer) {
      if (Array.isArray(buffer)) {
        this.buffer = this.context.createBuffer(2, buffer[0].length, this.context.sampleRate);
      } else {
        this.buffer = buffer;
      }
      return this;
    };

    Voice.prototype.trigger = function(velocity) {
      new Sample(this.buffer, velocity, this.offset, this.velocityMin, this.velocityMax, this.output, this.context);
      return this;
    };

    Voice.prototype.setVelocityMax = function(velocity) {
      if ((this.velocityMin < velocity && velocity <= 127)) {
        this.velocityMax = velocity;
      }
      return this;
    };

    Voice.prototype.setVelocityMin = function(velocity) {
      if ((0 <= velocity && velocity < this.velocityMax)) {
        this.velocityMin = velocity;
      }
      return this;
    };

    Voice.prototype.setGain = function(value) {
      this.output.gain.value = value;
      return this;
    };

    Voice.prototype.setOffset = function(offset) {
      this.offset = offset;
      return this;
    };

    Voice.prototype.destroy = function() {
      return this.output.disconnect(0);
    };

    return Voice;

  })();

}).call(this);
