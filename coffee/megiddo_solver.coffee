window.App ||= {}
class App.MegiddoSolver
  result: undefined
  point: {}

  constructor: (@a, @b, @c) ->
    @removedRestrictions = []

  solve: ->
    @setAlpha()

    @setI()
    @setU()
    @setDeltaGamma()

    loop
      @setMedians()
      break if @findMax() is false
      @setI()
      break if @restrictionCount() <= 4

    if @restrictionCount() > 0
      @solveBySimplex()

  setAlpha: ->
    @alpha = []

    for _, i in @a
      @alpha.push []
      @alpha[i][0] = @a[i][0] - (@c[0] / @c[1]) * @a[i][1]
      @alpha[i][1] = @a[i][1] / @c[1]

  setI: ->
    @I = {}
    @I['0'] = (i for alpha, i in @alpha when alpha[1] is 0 and @isRestrictionExist(i))
    @I['+'] = (i for alpha, i in @alpha when alpha[1] > 0 and @isRestrictionExist(i))
    @I['-'] = (i for alpha, i in @alpha when alpha[1] < 0 and @isRestrictionExist(i))
      
  setU: ->
    @U = []

    return unless @I['0'].length

    positives = (@alpha[i][0] for i in @I['0'] when @alpha[i][0] > 0)
    negatives = (@alpha[i][0] for i in @I['0'] when @alpha[i][0] < 0)

    @U[0] = Math.max(negatives...) if negatives.length
    @U[1] = Math.min(positives...) if positives.length

    @removeRestriction i for i in @I['0'] when @alpha[i][0] not in @U

  removeRestriction: (i) ->
    @removedRestrictions.push i if @isRestrictionExist i

  isRestrictionExist: (i) ->
    not (i in @removedRestrictions)

  activeRestriction: ->
    (i for i in @I['+'].concat(@I['-']) when @isRestrictionExist(i))

  restrictionCount: ->
    @activeRestriction().length

  setDeltaGamma: ->
    @delta = []
    @gamma = []

    for i in @I['+'].concat @I['-']
      @delta[i] = - (@alpha[i][0] / @alpha[i][1])
      @gamma[i] = @b[i] / @alpha[i][1]

  setMedians: ->
    @medians = []

    for _, index in @I['+'] by 2 when @I['+'][index + 1]?
      i = @I['+'][index]
      j = @I['+'][index + 1]
      if @delta[i] is @delta[j]
        @removeRestriction (if @gamma[i] > @gamma[j] then i else j)
      else
        x = (@gamma[j] - @gamma[i]) / (@delta[i] - @delta[j])
        if @U[0]? and x < @U[0]
          @removeRestriction (if @delta[i] > @delta[j] then i else j)
        else if @U[1]? and x > @U[1]
          @removeRestriction (if @delta[i] < @delta[j] then i else j)
        else
          @medians.push i: i, j: j, val: x, sign: '+'

    for _, index in @I['-'] by 2 when @I['-'][index + 1]?
      i = @I['-'][index]
      j = @I['-'][index + 1]
      if @delta[i] is @delta[j]
        @removeRestriction (if @gamma[i] < @gamma[j] then i else j)
      else
        x = (@gamma[j] - @gamma[i]) / (@delta[i] - @delta[j])
        if @U[0]? and x < @U[0]
          @removeRestriction (if @delta[i] < @delta[j] then i else j)
        else if @U[1]? and x > @U[1]
          @removeRestriction (if @delta[i] > @delta[j] then i else j)
        else
          @medians.push i: i, j: j, val: x, sign: '-'

  findMediana: (arr) ->
    @medians.sort (a, b) ->
      if a.val < b.val then -1
      else if a.val > b.val then 1
      else 0

    @medians[Math.floor((arr.length - 1) / 2)]

  FPlus: (x) ->
    Y = (val: @delta[i] * x.val + @gamma[i], i: i for i in @I['+'] when @isRestrictionExist(i))

    val = Math.min((el.val for el in Y)...)
    valIndex = (el.i for el in Y when el.val is val)

    deltas = (@delta[i] for i in valIndex)
    l = Math.max(deltas...)
    r = Math.min(deltas...)

    {val, l, r}

  FMinus: (x) ->
    Y = (val: @delta[i] * x.val + @gamma[i], i: i for i in @I['-'] when @isRestrictionExist(i))

    val = Math.max((el.val for el in Y)...)
    valIndex = (el.i for el in Y when el.val is val)

    deltas = (@delta[i] for i in valIndex)
    l = Math.min(deltas...)
    r = Math.max(deltas...)

    {val, l, r}

  removeMediansLeft: (x) ->
    for median in @medians when median.val <= x.val
      median.removed = true
      switch median.sign
        when '+'
          @removeRestriction (if @delta[median.i] > @delta[median.j] then median.i else median.j)
        when '-'
          @removeRestriction (if @delta[median.i] < @delta[median.j] then median.i else median.j)
    @medians = (median for median in @medians when not median.removed)

  removeMediansRight: (x) ->
    for median in @medians when median.val >= x.val
      median.removed = true
      switch median.sign
        when '+'
          @removeRestriction (if @delta[median.i] < @delta[median.j] then median.i else median.j)
        when '-'
          @removeRestriction (if @delta[median.i] > @delta[median.j] then median.i else median.j)
    @medians = (median for median in @medians when not median.removed)

  findMax: ->
    while @medians.length
      x = @findMediana @medians

      @f = 
        '+': @FPlus x
        '-': @FMinus x 

      if @f['-'].val - @f['+'].val > 0
        if @f['-'].r >= @f['+'].r and @f['-'].l <= @f['+'].l
          # задача неразрешима
          return false
        else
          if @f['-'].r < @f['+'].r
            @removeMediansLeft x
          else
            @removeMediansRight x
      else
        if @f['+'].l > 0
          if @f['+'].r > 0  and @f['+'].r <= @f['+'].l
            @removeMediansLeft x
          else
            # нашли!
            @result = x
            return false
        else
          if @f['+'].r < 0
            @removeMediansRight x

  solveBySimplex: ->
    solver = new c.SimplexSolver() 

    x = new c.Variable name: 'x'
    y = new c.Variable name: 'y'
    z = new c.Variable name: 'z'

    solver.addConstraint new c.Equation z, new c.Expression(x, -1 * @c[0]).plus(new c.Expression(y, -1 * @c[1]))

    for _, i in @a when @isRestrictionExist(i)
      try
        solver.addConstraint(new c.Inequality new c.Expression(x, @a[i][0]).plus(new c.Expression(y, @a[i][1])), c.LEQ, @b[i])  
      catch error
        # задача неразрешима
        return false

    solver.optimize(z)
    solver.resolve()

    @result = (@c[0] * x.value + @c[1] * y.value).toFixed(3)
    @point.x = x.value.toFixed(3)
    @point.y = y.value.toFixed(3)
