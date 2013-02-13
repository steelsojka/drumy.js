
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

_prefix = "drumy"

_padMethods = {
  prefix: _prefix
  _animCount: 1
  render: (container) ->
    $_temp = $("##{@prefix}-pad-template")
    @$container = $(container)
    @$el = $('<div class="drumy-pad"></div>')
    @$el.html(_template($_temp.html(), this))
    @$container.append(@$el)
    @$overlay = @$el.find('.drumy-overlay');
    @bindListeners()
  bindListeners: ->
    @$el.on('click', @onClick.bind(this))
    @$overlay.on('webkitAnimationEnd', @onAnimationEnd.bind(this))
    @on('sampleStart', @onTrigger)
  onClick: -> @trigger(127)
  onMouseOver: ->
  onMouseOut: ->
  onAnimationEnd: (e) ->
  onSampleEnd: (e, voice) ->
    # _removeClass(@el, "drumy-pad-trigger")
  onTrigger: (e, voice) ->
    @$el.removeClass("drumy-pad-anim#{@_animCount}")
        .addClass("drumy-pad-anim#{if @_animCount is 1 then 2 else 1}")
    @_animCount = if @_animCount is 1 then 2 else 1
}

_coreMethods = {
  prefix: _prefix
  render: (container="body") ->
    @$el = $('<div class="drumy-console"></div>')
    @$container = $(container)
    @$container.append(@$el)
    pad.render(@$el) for pad in @pads
    return
}

Drumy.UI = {}

Drumy.UI.initialize = ->
  Drumy.Pad::[key] = method for own key, method of _padMethods
  Drumy.Core::[key] = method for own key, method of _coreMethods
  return

