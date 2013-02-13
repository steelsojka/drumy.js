
# Micro template by John Resig

cache = {}

_template = (str, data) ->
  if not /\W/.test(str)
    fn = cache[str] or _template(document.getElementById(str).innerHTML)
  else 
    string = "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('
      #{str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
      }
      ');}return p.join('');
    "
    fn = new Function("obj", string)
  if data then fn(data) else fn

_isElement = (o) ->
  if typeof HTMLElement is "object"
    o instanceof HTMLElement
  else
    o and typeof o is "object" and o.nodeType is 1 and typeof o.nodeName is "string"

_addClass = (o, className) -> o.className += " #{className}"
_removeClass = (o, className) -> o.className = o.className.replace(className, "").trim()
_addStyle = (o, style, value) -> o.style[style] = value

_prefix = "drumy"

_createElement = (className="") ->
  div = document.createElement('DIV')
  div.className = className
  return div

_padMethods = {
  prefix: _prefix
  render: (container) ->
    _temp = document.getElementById("#{@prefix}-pad-template")
    @container = if _isElement(container) then container else document.querySelector(container)
    @el = _createElement("drumy-pad")
    @el.innerHTML = _template(_temp.innerHTML, this)
    @container.appendChild(@el)
    @bindListeners()
  bindListeners: ->
    @el.addEventListener('click', @onClick.bind(this))
    @on('sampleStart', @onTrigger)
    @_addStyle()
  _addStyle: ->
    # @el.style.webkitTransition = "background"
  onClick: -> @trigger(127)
  onMouseOver: ->
  onMouseOut: ->
  onSampleEnd: (e, voice) ->
    _removeClass(@el, "drumy-pad-trigger")
  onTrigger: (e, voice) ->
    _addClass(@el, "drumy-pad-trigger")
    _removeClass(@el, "drumy-pad-trigger")
}

_coreMethods = {
  prefix: _prefix
  render: (container="body") ->
    @el = _createElement("drumy-console")
    @container = if _isElement(container) then container else document.querySelector(container)
    @container.appendChild(@el)
    pad.render(@el) for pad in @pads
    return
}

class Drumy.UI
  constructor: ->
  prefix: "drumy"
  render: (container="body") ->
    @renderContainer(container)
    @renderPads(@dContainer)
  renderPads: (container) ->
    _temp = document.getElementById("#{@prefix}-pad-template")
    template = _template(_temp.innerHTML)
    @dContainer.innerHTML += (template(pad)) for pad in @pads
    return 
  renderContainer: (container="body") ->
    _temp = document.getElementById("#{@prefix}-container-template")
    @container = document.querySelector(container)
    @container.innerHTML += _template(_temp.innerHTML, this)
    @dContainer = document.getElementsByClassName("#{@prefix}-container")[0]
    return

Drumy.UI.initialize = ->
  Drumy.Pad::[key] = method for own key, method of _padMethods
  Drumy.Core::[key] = method for own key, method of _coreMethods
  return

