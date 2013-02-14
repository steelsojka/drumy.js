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

    function Sample(buffer, velocity, offset, min, max, output, context, delay, callback) {
      this.context = context;
      this.offset = offset;
      this.callback = callback;
      this.source = context.createBufferSource();
      this.gainNode = context.createGainNode();
      this.source.buffer = buffer;
      this.source.connect(this.gainNode);
      this.gainNode.connect(output);
      this.trigger(velocity, min, max);
    }

    Sample.prototype.trigger = function(velocity, min, max) {
      this.source.start(this.context.currentTime + this.delay + this.offset);
      this.gainNode.gain.value = velocity / 127;
      setTimeout(this.destroy.bind(this), (this.source.buffer.duration + this.offset) * 1000);
    };

    Sample.prototype.destroy = function() {
      this.source.disconnect(0);
      this.gainNode.disconnect(0);
      this.callback();
    };

    return Sample;

  })();

  Drumy.Voice = (function() {

    function Voice(options) {
      var alt, _i, _len, _ref;
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
          this.alternates.push(new Drumy.Voice(alt));
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

    Voice.prototype.trigger = function(velocity, delay) {
      this.emit('sampleStart');
      if (Math.random() < this.alternateRate && this.alternates.length > 0) {
        this.alternates[_getRandomInt(0, this.alternates.length - 1)].trigger(velocity);
      } else {
        new Sample(this.buffer, velocity, this.offset, this.velocityMin, this.velocityMax, this.output, this.context, delay, this.onSampleDestroy.bind(this));
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

    Voice.prototype.destroy = function() {
      return this.output.disconnect(0);
    };

    return Voice;

  })();

  if (Drumy.Event != null) Drumy.Event.register(Drumy.Voice);

}).call(this);
