checkVoices = (voice, velocity) ->
  if voice.velocityMax >= velocity >= voice.velocityMin
    voice.trigger(velocity)
    return

class Drumy.Pad
  constructor: (options={}) ->
    @voices = []
    @context = options.context
    @note = options.note or 32
    @name = options.name or "Pad"
    # @[key] = option for own key, option of options
  
    @output = @context.createGainNode();
    @loadVoice(voice) for voice in options.voices if options.voices
  loadVoice: (voice) ->
    @addVoice({
      url: voice.url
      velocityMin: voice.vMin
      velocityMax: voice.vMax
      gain: 1
      offset: voice.offset
    })
    return this
  addVoice: (options={}) ->
    options.context = @context
    options.padOutput = @output
    voice = new Drumy.Voice(options)
    @voices.push(voice)
    return voice
  removeVoice: (index) ->
    if 0 <= index < @voices.length
      voice = @voices[index]
      i = @voices.indexOf(voice)
      voice.destroy()
      @voices.splice(i, 1)
    return this
  getVoice: (index) ->
    @voices[index] if 0 <= index < @voices.length   
  setNoteNumber: (number) ->
    @note = number if 0 <= number <= 127
    return this
  setGain: (value) ->
    @output.gain.value = value
    return this
  setName: (name) ->
    @name = name
    return this
  trigger: (velocity) ->
    checkVoices(voice, velocity) for own voice in @voices
    return this
  destroy: ->
    voice.destroy() for own voice in @voices
    return

