(function() {
  var cache, _coreMethods, _padMethods, _prefix, _template,
    __hasProp = Object.prototype.hasOwnProperty;

  cache = {};

  _template = function(str, data) {
    var fn, string;
    if (!/\W/.test(str)) {
      fn = cache[str] || _template(document.getElementById(str).innerHTML);
    } else {
      string = "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('      " + (str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")) + "      ');}return p.join('');    ";
      fn = new Function("obj", string);
    }
    if (data) {
      return fn(data);
    } else {
      return fn;
    }
  };

  _prefix = "drumy";

  _padMethods = {
    prefix: _prefix,
    _animCount: 1,
    glow: true,
    animation: true,
    render: function(container) {
      var $_temp;
      $_temp = $("#" + this.prefix + "-pad-template");
      this.$container = $(container);
      this.$el = $('<div class="drumy-pad-container"></div>');
      this.$el.html(_template($_temp.html(), this));
      this.$container.append(this.$el);
      this.$pad = this.$el.find('.drumy-pad');
      this.$overlay = this.$el.find('.drumy-overlay > div');
      return this.bindListeners();
    },
    bindListeners: function() {
      this.$el.on('click', this.onClick.bind(this));
      return this.on('sampleStart', this.onTrigger);
    },
    onClick: function() {
      return this.trigger(127);
    },
    onTrigger: function(e, voice) {
      if (this.animation) {
        this.$el.removeClass("drumy-pad-anim" + this._animCount).addClass("drumy-pad-anim" + (this._animCount === 1 ? 2 : 1));
      }
      if (this.glow) {
        this.$overlay.removeClass("drumy-overlay-anim" + this._animCount).addClass("drumy-overlay-anim" + (this._animCount === 1 ? 2 : 1));
      }
      return this._animCount = this._animCount === 1 ? 2 : 1;
    }
  };

  _coreMethods = {
    prefix: _prefix,
    render: function(container) {
      var pad, _i, _len, _ref;
      if (container == null) container = "body";
      this.$el = $('<div class="drumy-console"></div>');
      this.$container = $(container);
      this.$container.append(this.$el);
      _ref = this.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        pad.render(this.$el);
      }
    },
    setGlow: function(bool) {
      var pad, _i, _len, _ref;
      _ref = this.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        pad.glow = bool;
      }
    },
    setAnimation: function(bool) {
      var pad, _i, _len, _ref;
      _ref = this.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        pad.animation = bool;
      }
    }
  };

  Drumy.UI = {};

  Drumy.UI.initialize = function() {
    var key, method;
    for (key in _padMethods) {
      if (!__hasProp.call(_padMethods, key)) continue;
      method = _padMethods[key];
      Drumy.Pad.prototype[key] = method;
    }
    for (key in _coreMethods) {
      if (!__hasProp.call(_coreMethods, key)) continue;
      method = _coreMethods[key];
      Drumy.Core.prototype[key] = method;
    }
  };

}).call(this);
