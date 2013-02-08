Drumy = {}

checkPad = (pad, note, velocity) ->
  if pad.note is note
    pad.trigger velocity
  return

class Drumy.Core
  constructor: (options) ->
    options = options or {}
    @context = options.context or new webkitAudioContext()
    @pads = []
    @output = @context.createGainNode()
    @connectToMaster = true
    for own key of options
      @[key] = options[key]

    if @connectToMaster
      @connect @context.destination
  addPad: (options) ->
    options = options or {}
    options.context = @context
    pad = new Drumy.Pad options
    pad.output.connect(@output)
    @pads.push pad
    pad    
  getPad: (index) ->
    if 0 <= index < @pads.length
      @pads[index]
  connect: (node) ->
    @output.connect node
    @
  getContext: -> @context
  trigger: (note, velocity) ->
    checkPad pad, note, velocity for pad in @pads
    @

Drumy.create = (options) ->  
  new Drumy.Core options

@Drumy = Drumy;




