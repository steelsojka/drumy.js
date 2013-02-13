// Generated by CoffeeScript 1.4.0
(function() {
  var cache, _addClass, _addStyle, _coreMethods, _createElement, _isElement, _padMethods, _prefix, _removeClass, _template,
    __hasProp = {}.hasOwnProperty;

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

  _isElement = function(o) {
    if (typeof HTMLElement === "object") {
      return o instanceof HTMLElement;
    } else {
      return o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string";
    }
  };

  _addClass = function(o, className) {
    return o.className += " " + className;
  };

  _removeClass = function(o, className) {
    return o.className = o.className.replace(className, "").trim();
  };

  _addStyle = function(o, style, value) {
    return o.style[style] = value;
  };

  _prefix = "drumy";

  _createElement = function(className) {
    var div;
    if (className == null) {
      className = "";
    }
    div = document.createElement('DIV');
    div.className = className;
    return div;
  };

  _padMethods = {
    prefix: _prefix,
    render: function(container) {
      var _temp;
      _temp = document.getElementById("" + this.prefix + "-pad-template");
      this.container = _isElement(container) ? container : document.querySelector(container);
      this.el = _createElement("drumy-pad");
      this.el.innerHTML = _template(_temp.innerHTML, this);
      this.container.appendChild(this.el);
      return this.bindListeners();
    },
    bindListeners: function() {
      this.el.addEventListener('click', this.onClick.bind(this));
      this.on('sampleStart', this.onTrigger);
      return this._addStyle();
    },
    _addStyle: function() {},
    onClick: function() {
      return this.trigger(127);
    },
    onMouseOver: function() {},
    onMouseOut: function() {},
    onSampleEnd: function(e, voice) {
      return _removeClass(this.el, "drumy-pad-trigger");
    },
    onTrigger: function(e, voice) {
      _addClass(this.el, "drumy-pad-trigger");
      return _removeClass(this.el, "drumy-pad-trigger");
    }
  };

  _coreMethods = {
    prefix: _prefix,
    render: function(container) {
      var pad, _i, _len, _ref;
      if (container == null) {
        container = "body";
      }
      this.el = _createElement("drumy-console");
      this.container = _isElement(container) ? container : document.querySelector(container);
      this.container.appendChild(this.el);
      _ref = this.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        pad.render(this.el);
      }
    }
  };

  Drumy.UI = (function() {

    function UI() {}

    UI.prototype.prefix = "drumy";

    UI.prototype.render = function(container) {
      if (container == null) {
        container = "body";
      }
      this.renderContainer(container);
      return this.renderPads(this.dContainer);
    };

    UI.prototype.renderPads = function(container) {
      var pad, template, _i, _len, _ref, _temp;
      _temp = document.getElementById("" + this.prefix + "-pad-template");
      template = _template(_temp.innerHTML);
      _ref = this.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        this.dContainer.innerHTML += template(pad);
      }
    };

    UI.prototype.renderContainer = function(container) {
      var _temp;
      if (container == null) {
        container = "body";
      }
      _temp = document.getElementById("" + this.prefix + "-container-template");
      this.container = document.querySelector(container);
      this.container.innerHTML += _template(_temp.innerHTML, this);
      this.dContainer = document.getElementsByClassName("" + this.prefix + "-container")[0];
    };

    return UI;

  })();

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