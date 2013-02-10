Drumy = {}

checkPad = (pad, note, velocity) ->
  pad.trigger(velocity) if pad.note is note
  return

class Drumy.Core
  constructor: (options) ->
    options or= {}
    @context = options.context or new webkitAudioContext()
    @pads = []
    @output = @context.createGainNode()
    @connectToMaster = true
    @[key] = options[key] for own key of options

    @connect @context.destination if @connectToMaster
  loadConfig: (configJSON) ->
    @addPad(pad) for own pad of configJSON.pads
    this
  addPad: (options) ->
    options or= {}
    options.context = @context
    pad = new Drumy.Pad(options)
    pad.output.connect(@output)
    @pads.push(pad)
    pad 
  removePad: (index) ->
    @pads[index].destroy() if 0 <= index < @pads.length
    this
  getPad: (index) ->
    if 0 <= index < @pads.length
      @pads[index]
  connect: (node) ->
    @output.connect(node)
    this
  getContext: -> @context
  trigger: (note, velocity) ->
    checkPad(pad, note, velocity) for pad in @pads
    this

Drumy.create = (options) ->  
  new Drumy.Core(options)

@Drumy = Drumy;




