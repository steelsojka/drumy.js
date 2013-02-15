/**
 * Drumy.js v0.2.4
 *
 * A customizable drum pad console for triggering drum sounds.
 * @author Steven Sojka - Friday, February 15, 2013
 *
 * MIT Licensed
 */
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
(function() {
  var checkPad,
    __hasProp = Object.prototype.hasOwnProperty;

  checkPad = function(pad, note, velocity, time) {
    if (pad.note.indexOf(note) !== -1) pad.trigger(velocity, time);
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

    Core.prototype.stop = function() {
      var pad, voice, _i, _j, _len, _len2, _ref, _ref2;
      _ref = this.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        _ref2 = pad.voices;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          voice = _ref2[_j];
          voice.stop();
        }
      }
    };

    Core.prototype.getContext = function() {
      return this.context;
    };

    Core.prototype.trigger = function(note, velocity, time) {
      var pad, _i, _len, _ref;
      _ref = this.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        checkPad(pad, note, velocity, time);
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
(function() {
  var checkVoices, _bindVoiceEvents, _handleVoiceEvent;

  checkVoices = function(voice, velocity, time) {
    if ((voice.velocityMax >= velocity && velocity >= voice.velocityMin)) {
      voice.trigger(velocity, time);
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

    Pad.prototype.trigger = function(velocity, time) {
      var voice, _i, _len, _ref;
      _ref = this.voices;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        voice = _ref[_i];
        checkVoices(voice, velocity, time);
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
(function() {
  var Sample, _ajax, _getRandomInt;

  _ajax = function(url, callback) {
    var request;
    request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'arraybuffer';
    request.onload = callback;
    return request.send();
  };

  _getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  Sample = (function() {

    function Sample(buffer, velocity, offset, min, max, output, context, time, voice, callback, onTriggerCallback) {
      this.context = context;
      this.offset = offset;
      this.callback = callback;
      this.source = context.createBufferSource();
      this.gainNode = context.createGainNode();
      this.source.buffer = buffer;
      this.source.connect(this.gainNode);
      this.gainNode.connect(output);
      this.onTriggerCallback = onTriggerCallback;
      this.trigger(velocity, min, max, time);
      this.voice = voice;
      voice.on('stop', this.stop.bind(this));
    }

    Sample.prototype.trigger = function(velocity, min, max, time) {
      if (time == null) time = this.context.currentTime;
      this.source.start(time + this.offset);
      this.gainNode.gain.value = velocity / 127;
      this.onTriggerTimeout = setTimeout(this.onTriggerCallback, ((time - this.context.currentTime) + this.offset) * 1000);
      this.onDestroyTimeout = setTimeout(this.destroy.bind(this), (this.source.buffer.duration + this.offset + (time - this.context.currentTime)) * 1000);
    };

    Sample.prototype.stop = function() {
      clearTimeout(this.onTriggerTimeout);
      clearTimeout(this.onDestroyTimeout);
      this.source.disconnect(0);
      return this.gainNode.disconnect(0);
    };

    Sample.prototype.destroy = function() {
      this.stop();
      this.callback();
    };

    return Sample;

  })();

  Drumy.Voice = (function() {

    function Voice(options) {
      var alt, alternate, _i, _len, _ref;
      if (options == null) options = {};
      this.velocityMax = options.velocityMax || 127;
      this.velocityMin = options.velocityMin || 0;
      this.offset = options.offset || 0;
      this.alternateRate = options.alternateRate != null ? options.alternateRate : 0.25;
      this.context = options.context;
      this.alternates = [];
      this.padOutput = options.padOutput;
      this.url = options.url || "";
      this.gain = options.gain || 1;
      this.onTriggerTimeouts = [];
      this.output = this.context.createGainNode();
      this.output.connect(this.padOutput);
      if (options.gain) this.setGain(options.gain);
      if (options.url) this.loadFromUrl(options.url);
      if (this.buffer) this.loadBuffer(this.buffer);
      if (options.alternates) {
        _ref = options.alternates;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          alt = _ref[_i];
          alt.context = this.context;
          alt.padOutput = this.padOutput;
          alternate = new Drumy.Voice(alt);
          alternate.on('sampleStart', this.onTrigger.bind(this));
          alternate.on('sampleEnd', this.onSampleDestroy.bind(this));
          this.alternates.push(alternate);
        }
      }
    }

    Voice.prototype.save = function() {
      var voice;
      return {
        "url": this.url,
        "gain": this.gain,
        "velocityMin": this.velocityMin,
        "velocityMax": this.velocityMax,
        "offset": this.offset,
        "alternateRate": this.alternateRate,
        "alternates": (function() {
          var _i, _len, _ref, _results;
          _ref = this.alternates;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            voice = _ref[_i];
            _results.push(voice.save());
          }
          return _results;
        }).call(this)
      };
    };

    Voice.prototype.loadFromUrl = function(url, callback) {
      var _this = this;
      _ajax(url, function(res) {
        _this.context.decodeAudioData(res.currentTarget.response, function(buff) {
          _this.loadBuffer(buff);
          if (typeof callback === "function") callback();
        });
      });
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

    Voice.prototype.onTrigger = function(e) {
      return this.emit('sampleStart');
    };

    Voice.prototype.trigger = function(velocity, time) {
      if (Math.random() < this.alternateRate && this.alternates.length > 0) {
        this.alternates[_getRandomInt(0, this.alternates.length - 1)].trigger(velocity);
      } else {
        new Sample(this.buffer, velocity, this.offset, this.velocityMin, this.velocityMax, this.output, this.context, time, this, this.onSampleDestroy.bind(this), this.onTrigger.bind(this));
      }
      return this;
    };

    Voice.prototype.onSampleDestroy = function() {
      return this.emit('sampleEnd');
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

    Voice.prototype.getDuration = function() {
      return this.buffer.duration;
    };

    Voice.prototype.stop = function() {
      return this.emit('stop');
    };

    Voice.prototype.destroy = function() {
      return this.output.disconnect(0);
    };

    return Voice;

  })();

  if (Drumy.Event != null) Drumy.Event.register(Drumy.Voice);

}).call(this);
