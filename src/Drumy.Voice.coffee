class Sample
  constructor: (buffer, velocity, offset, min, max, output, context) ->
    @context = context
    @offset = offset
    @source = context.createBufferSource()
    @gainNode = context.createGainNode()
    @source.buffer = buffer
    @source.connect(@gainNode)
    @gainNode.connect(output)
    @trigger(velocity, min, max)
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

    @[key] = options[key] for own key of options

    @output = @context.createGainNode()
    @output.connect(@padOutput)

    @loadBuffer @buffer if @buffer
  loadBuffer: (buffer) ->
    if Array.isArray(buffer)
      @buffer = @context.createBuffer(2, buffer[0].length, @context.sampleRate)
    else 
      @buffer = buffer
    @
  trigger: (velocity) ->
    new Sample(@buffer, velocity, @offset, @velocityMin, @velocityMax, @output, @context)
    @
  setVelocityMax: (velocity) ->
    @velocityMax = velocity if @velocityMin < velocity <= 127
    @
  setVelocityMin: (velocity) ->
    @velocityMin = velocity if 0 <= velocity < @velocityMax
    @
  setGain: (value) ->
    @output.gain.value = value
    @
  setOffset: (offset) ->
    @offset = offset
    @
  destroy: ->
    @output.disconnect(0)