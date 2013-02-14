checkVoices = (voice, velocity) ->
  if voice.velocityMax >= velocity >= voice.velocityMin
    voice.trigger(velocity)
    return

_bindVoiceEvents = ->
  for voice in @voices
    voice.off('sampleStart sampleEnd', _handleVoiceEvent.bind(this)) 
    voice.on('sampleStart sampleEnd', _handleVoiceEvent.bind(this))
  return

_handleVoiceEvent = (e) -> 
  @emit(e.type, e.target)

class Drumy.Pad
  constructor: (options={}) ->
    @voices = []
    @note = []
    @context = options.context
    @name = options.name or "Pad"
    if Array.isArray(options.note)
      @note = @note.concat(options.note)
    else if options.note
      @note.push(options.note)
    else
      @note.push(32)
    
    # @[key] = option for own key, option of options
  
    @output = @context.createGainNode();
    @loadVoice(voice) for voice in options.voices if options.voices
  loadVoice: (voice) ->
    @addVoice(voice)
    return this
  save: ->
    {
      "name": @name
      "note": @note
      "voices": voice.save() for voice in @voices
    }
  addVoice: (options={}) ->
    options.context = @context
    options.padOutput = @output
    voice = new Drumy.Voice(options)
    @voices.push(voice)
    _bindVoiceEvents.call(this)
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
    @note.push(number) if 0 <= number <= 127 and @note.indexOf(number) is -1
    return this
  removeNoteNumber: (number) ->
    index = @note.indexOf(number)
    return if index is -1
    @note.splice(index, 1)
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

Drumy.Event.register(Drumy.Pad) if Drumy.Event?


