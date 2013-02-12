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
  trigger: (events) ->
    @_events or= {}
    for event in events.split(" ")
      continue if event not in @_events
      for binding in @_events[event]
        binding.apply(this, Array::slice.call(arguments, 1))
    return
