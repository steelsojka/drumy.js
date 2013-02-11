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
