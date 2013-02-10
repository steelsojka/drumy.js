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
    setTimeout(@destroy.bind(this), @source.buffer.duration * 1000)
    return
  destroy: ->
    @source.disconnect(0)
    @gainNode.disconnect(0)
    return


class Drumy.Voice
  constructor: (options) ->
    options or= {}
    @velocityMax = 127
    @velocityMin = 0
    @offset = 0

    @[key] = option for own option in options

    @output = @context.createGainNode()
    @output.connect(@padOutput)

    @setGain(options.gain) if options.gain
    @loadFromUrl(options.url) if options.url
    @loadBuffer(@buffer) if @buffer
  loadFromUrl: (url, callback) ->
    request = new XMLHttpRequest()
    request.open('GET', url)
    request.responseType = 'arraybuffer'
    request.onload = (res) =>
      @context.decodeAudioData(res.currentTarget.response, (buff) =>
        @loadBuffer(buff)
        callback?()
        return
      )
      return
    request.send()
    return this
  loadBuffer: (buffer) ->
    if Array.isArray(buffer)
      @buffer = @context.createBuffer(2, buffer[0].length, @context.sampleRate)
    else 
      @buffer = buffer
    return this
  trigger: (velocity) ->
    new Sample(@buffer, velocity, @offset, @velocityMin, @velocityMax, @output, @context)
    return this
  setVelocityMax: (velocity) ->
    @velocityMax = velocity if @velocityMin < velocity <= 127
    return this
  setVelocityMin: (velocity) ->
    @velocityMin = velocity if 0 <= velocity < @velocityMax
    return this
  setGain: (value) ->
    @output.gain.value = value
    return this
  setOffset: (offset) ->
    @offset = offset
    return this
  destroy: ->
    @output.disconnect(0)