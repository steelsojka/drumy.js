checkVoices = (voice, velocity) ->
  if voice.velocityMax >= velocity >= voice.velocityMin
    voice.trigger velocity
    return

class Drumy.Pad
  constructor: (options) ->
    @voices = []
    @note = 32

    for own key of options
      @[key] = options[key]
  
    @output = @context.createGainNode();
  addVoice: (options) ->
    options = options or {}
    options.context = @context
    options.padOutput = @output
    voice = new Drumy.Voice options
    @voices.push voice
    voice
  getVoice: (index) ->
    if 0 <= index < @voices.length
      @voices[index]
  setNoteNumber: (number) ->
    if 0 <= number <= 127
      @note = number
    @
  setGain: (value) ->
    @output.gain.value = value
    @
  setName: (name) ->
    @name = name
    @
  trigger: (velocity) ->
    checkVoices voice, velocity for voice in @voices
    @


