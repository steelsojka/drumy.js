checkVoices = (voice, velocity) ->
  if voice.velocityMax >= velocity >= voice.velocityMin
    voice.trigger(velocity)
    return

class Drumy.Pad
  constructor: (options) ->
    @voices = []
    @note = 32

    @[key] = options[key] for own key of options
  
    @output = @context.createGainNode();
  addVoice: (options) ->
    options = options or {}
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
    @
  getVoice: (index) ->
    @voices[index] if 0 <= index < @voices.length   
  setNoteNumber: (number) ->
    @note = number if 0 <= number <= 127
    @
  setGain: (value) ->
    @output.gain.value = value
    @
  setName: (name) ->
    @name = name
    @
  trigger: (velocity) ->
    checkVoices(voice, velocity) for voice in @voices
    @
  destroy: ->
    voice.destroy() for voice in @voices
    return

