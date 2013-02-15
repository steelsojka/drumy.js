checkPad = (pad, note, velocity, time) ->
  pad.trigger(velocity, time) if pad.note.indexOf(note) isnt -1
  return

class Drumy.Core
  constructor: (options={}) ->
    @context = options.context or new webkitAudioContext()
    @pads = []
    @output = @context.createGainNode()
    @connectToMaster = true
    @[key] = options[key] for own key of options

    @connect @context.destination if @connectToMaster
  loadConfig: (configJSON) ->
    @addPad(pad) for pad in configJSON.pads
    return this
  save: ->
    _pads = (pad.save() for pad in @pads)
    return JSON.stringify({pads : _pads})
  addPad: (options) ->
    options or= {}
    options.context = @context
    pad = new Drumy.Pad(options)
    pad.output.connect(@output)
    @pads.push(pad)
    return pad 
  removePad: (index) ->
    @pads[index].destroy() if 0 <= index < @pads.length
    return this
  getPad: (index) ->
    if 0 <= index < @pads.length
      @pads[index]
  connect: (node) ->
    @output.connect(node)
    return this
  stop: ->
    for pad in @pads
      voice.stop() for voice in pad.voices
    return
  getContext: -> @context
  trigger: (note, velocity, time) ->
    checkPad(pad, note, velocity, time) for pad in @pads
    return this

Drumy.create = (options) ->  
  new Drumy.Core(options)

Drumy.Event.register(Drumy.Core) if Drumy.Event?




