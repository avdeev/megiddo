window.App ||= {}
class App.MegiddoSolver
  constructor: (@a, @b, @c) ->

  solve: ->
    @setAlpha()
    @setI()
    @setU()
    @setDeltaGamma()
    @setMedians()

  setAlpha: ->
    @alpha = []

    for _, i in @a
      @alpha.push []
      @alpha[i][0] = @a[i][0] - (@c[0] / @c[1]) * @a[i][1]
      @alpha[i][1] = @a[i][1] / @c[1]

  setI: ->
    @I =
      '-': []
      '0': []
      '+': []

    for alpha, i in @alpha
      if alpha[1] is 0
        @I['0'].push i
      else if alpha[1] > 0
        @I['+'].push i
      else if alpha[1] < 0
        @I['-'].push i
      
  setU: ->
    @U = []

    positives = []
    negatives = []
    for i in @I['0']
      alpha = @alpha[i][0]
      positives.push alpha if alpha > 0
      negatives.push alpha if alpha < 0

    @U[0] = Math.max(negatives) if negatives
    @U[1] = Math.min(positives) if positives

    # Удалить ограничения из @a, @b
    @removeRestriction i for i in positives.concat negatives

  removeRestriction: (i) ->
    @a.splice i, 1 if @a[i]?
    @b.splice i, 1 if @b[i]?

  isRestrictionExist: (i) -> @a[i]?

  setDeltaGamma: ->
    @delta = []
    @gamma = []

    for i in @I['+'].concat @I['-']
      @delta[i] = - (@alpha[i][0] / @alpha[i][1])
      @gamma[i] = @b[i] / @alpha[i][1]

  setMedians: ->
    @medians = []

    for i in @I['+'] by 2
      if @isRestrictionExist i + 1
        console.log i, i + 1
        if @delta[i] is @delta[i + 1]
          if @gamma[i] > @gamma[i + 1] then @removeRestriction i
          else @removeRestriction i + 1
        else
          x = (@gamma[i + 1] - @gamma[i]) / (@delta[i] - @delta[i + 1])
          if @U[0]? and x < @U[0]
            if @delta[i] > @delta[i + 1] then @removeRestriction i
            else @removeRestriction i + 1
          else if @U[1]? and x > @U[1]
            if @delta[i] < @delta[i + 1] then @removeRestriction i
            else @removeRestriction i + 1
          else
            @medians.push x

    for i in @I['-'] by 2
      if @isRestrictionExist i + 1
        console.log i, i + 1
        if @delta[i] is @delta[i + 1]
          if @gamma[i] < @gamma[i + 1] then @removeRestriction i
          else @removeRestriction i + 1
        else
          x = (@gamma[i + 1] - @gamma[i]) / (@delta[i] - @delta[i + 1])
          if @U[0]? and x < @U[0]
            if @delta[i] < @delta[i + 1] then @removeRestriction i
            else @removeRestriction i + 1
          else if @U[1]? and x > @U[1]
            if @delta[i] > @delta[i + 1] then @removeRestriction i
            else @removeRestriction i + 1
          else
            @medians.push x