window.App ||= {}
class App.MegiddoSolver

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

    console.log @restrictionCount()

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

  restrictionCount: ->
    (i for i in @I['0'].concat(@I['+']).concat(@I['-']) when @isRestrictionExist(i)).length

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
          console.log 'задача неразрешима'
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
            console.log x, 'Нашли!'
            return false
        else
          if @f['+'].r < 0
            @removeMediansRight x

  print: ($output) ->
    $output.empty()
    $output.append $('<pre>').text "I = #{JSON.stringify(@I, null, 2)}"
    $output.append $('<pre>').text "U = #{JSON.stringify(@U)}"
