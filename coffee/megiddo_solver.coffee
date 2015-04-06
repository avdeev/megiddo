window.App ||= {}
class App.MegiddoSolver
  constructor: (@a, @b, @c) ->
    @removedRestrictions = []

  solve: ->
    @setAlpha()
    @setI()
    @setU()
    @setDeltaGamma()
    @setMedians()
    @findMax()

  setAlpha: ->
    @alpha = []

    for _, i in @a
      @alpha.push []
      @alpha[i][0] = @a[i][0] - (@c[0] / @c[1]) * @a[i][1]
      @alpha[i][1] = @a[i][1] / @c[1]

  setI: ->
    @I = {}
    @I['0'] = (i for alpha, i in @alpha when alpha[1] is 0)
    @I['+'] = (i for alpha, i in @alpha when alpha[1] > 0)
    @I['-'] = (i for alpha, i in @alpha when alpha[1] < 0)
      
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

    console.log @medians.length

  sortArr: (arr) ->
    newArr = arr[...] # клонируем массив
    newArr.sort (a, b) ->
      if a.val < b.val then -1
      else if a.val > b.val then 1
      else 0

  findMediana: (arr) ->
    if arr.length <= 10000 # специальное число
      @sortArr(arr)[Math.floor((arr.length - 1) / 2)]
    else
      arrCopies = []
      for m in [0..(Math.floor(arr.length / 5) - 1)]
        arrCopies.push @sortArr(arr.slice(m * 5, (m + 1) * 5))[2]
      @findMediana arrCopies

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
    console.log '---- left ----'
    medians = @medians[...]
    for median, i in medians when median.val <= x.val
      @medians.splice(i, 1)
      console.log i
      console.log median
      # if median.val is x.val
      #   switch median.sign
      #     when '+'
      #       @removeRestriction (if @delta[median.i] > @delta[median.j] then median.i else median.j)
      #     when '-'
      #       @removeRestriction (if @delta[median.i] < @delta[median.j] then median.i else median.j)
      # else
      #   console.log 'оба'
      @removeRestriction median.i
      @removeRestriction median.j

  removeMediansRight: (x) ->
    console.log '---- right ----'
    medians = @medians[...]
    for median, i in medians when median.val >= x.val
      @medians.splice(i, 1)
      console.log i
      console.log median
      # if median.val is x.val
      #   switch median.sign
      #     when '+'
      #       @removeRestriction (if @delta[median.i] < @delta[median.j] then median.i else median.j)
      #     when '-'
      #       @removeRestriction (if @delta[median.i] > @delta[median.j] then median.i else median.j)
      # else
      #   console.log 'оба'
      @removeRestriction median.i
      @removeRestriction median.j

  findMax: ->
    repeats = 500
    while @medians.length and repeats-- > 0
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

    lastRestrictionPlus = (i for i in @I['+'] when @isRestrictionExist i)
    lastRestrictionMinus = (i for i in @I['-'] when @isRestrictionExist i)
    console.log(lastRestrictionPlus.length + lastRestrictionMinus.length)

  print: ($output) ->
    $output.empty()
    $output.append $('<pre>').text "a = #{JSON.stringify(@a, null, 2)}"
    $output.append $('<pre>').text "b = #{JSON.stringify(@b, null, 2)}"
    $output.append $('<pre>').text "c = #{JSON.stringify(@c, null, 2)}"
    $output.append $('<pre>').text "alpha = #{JSON.stringify(@alpha, null, 2)}"
    $output.append $('<pre>').text "I = #{JSON.stringify(@I, null, 2)}"
    $output.append $('<pre>').text "U = #{JSON.stringify(@U, null, 2)}"
    $output.append $('<pre>').text "delta = #{JSON.stringify(@delta, null, 2)}"
    $output.append $('<pre>').text "gamma = #{JSON.stringify(@gamma, null, 2)}"
    $output.append $('<pre>').text "medians = #{JSON.stringify(@medians, null, 2)}"
    $output.append $('<pre>').text "removedRestrictions = #{JSON.stringify(@removedRestrictions, null, 2)}"

