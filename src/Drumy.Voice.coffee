class Sample
  constructor: (buffer, velocity, offset, min, max, output, context) ->
    @context = context
    @offset = offset
    @source = context.createBufferSource()
    @gainNode = context.createGainNode()
    @source.buffer = buffer
    @source.connect(@gainNode)
    @gainNode.connect(output)
    @trigger velocity, min, max
  trigger: (velocity, min, max) ->
    @source.start(@context.currentTime + @offset)
    @gainNode.gain.value = velocity / 127
    setTimeout(@destroy.bind(@), @source.buffer.duration * 1000)
    return
  destroy: ->
    @source.disconnect(0)
    @gainNode.disconnect(0)
    return


class Drumy.Voice
  constructor: (options) ->
    options = options or {}
    @velocityMax = 127
    @velocityMin = 0
    @offset = 0

    for own key of options
      @[key] = options[key]

    @output = @context.createGainNode()
    @output.connect(@padOutput)

    if @buffer
      @loadBuffer @buffer
  loadBuffer: (buffer) ->
    if Array.isArray(buffer)
      @buffer = @context.createBuffer(2, buffer[0].length, @context.sampleRate)
    else 
      @buffer = buffer
    @
  trigger: (velocity) ->
    new Sample @buffer, velocity, @offset, @velocityMin, @velocityMax, @output, @context
    @
  setVelocityMax: (velocity) ->
    if @velocityMin < velocity <= 127
      @velocityMax = velocity
    @
  setVelocityMin: (velocity) ->
    if 0 <= velocity < @velocityMax
      @velocityMin = velocity
    @
  setGain: (value) ->
    @output.gain.value = value
    @
  setOffset: (offset) ->
    @offset = offset
    @