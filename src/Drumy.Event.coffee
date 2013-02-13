Drumy = {}

class Drumy.Event
  constructor: ->
  on: (events, listener) ->
    @_events or= {}
    for event in events.split(" ")
      @_events[event] or= []
      @_events[event].push(listener)
    return
  off: (events, listener) ->
    @_events or= {}
    for event in events.split(" ")
      continue if event not in @_events
      @_events[event].splice(@_events[event].indexOf(listener), 1)
    return
  emit: (events) ->
    @_events or= {}
    for event in events.split(" ")
      continue if event not of @_events
      for binding in @_events[event]
        binding.apply(this, [{type: event, target: this}].concat(Array::slice.call(arguments, 1)))
    return

Drumy.Event.register = (obj) ->
  obj::[key] = prop for own key, prop of Drumy.Event::
  return

@Drumy = Drumy
