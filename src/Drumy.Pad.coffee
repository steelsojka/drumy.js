checkVoices = (voice, velocity) ->
  if voice.velocityMax >= velocity >= voice.velocityMin
    voice.trigger(velocity)
    return

class Drumy.Pad
  constructor: (options) ->
    options or= {}
    @voices = []
    @note = 32

    @[key] = option for own option in options
  
    @output = @context.createGainNode();
    @loadVoice(voice) for own voice in options.voices if options.voices
  loadVoice: (voice) ->
    @addVoice(
      url: voice.url
      velocityMin: voice.vMin
      velocityMax: voice.vMax
      gain: 1
      offset: 0  
    )
    this
  addVoice: (options) ->
    options or= {}
    options.context = @context
    options.padOutput = @output
    voice = new Drumy.Voice(options)
    @voices.push(voice)
    voice
  removeVoice: (index) ->
    if 0 <= index < @voices.length
      voice = @voices[index]
      i = @voices.indexOf(voice)
      voice.destroy()
      @voices.splice(i, 1)
    this
  getVoice: (index) ->
    @voices[index] if 0 <= index < @voices.length   
  setNoteNumber: (number) ->
    @note = number if 0 <= number <= 127
    this
  setGain: (value) ->
    @output.gain.value = value
    this
  setName: (name) ->
    @name = name
    this
  trigger: (velocity) ->
    checkVoices(voice, velocity) for own voice in @voices
    this
  destroy: ->
    voice.destroy() for own voice in @voices
    return

