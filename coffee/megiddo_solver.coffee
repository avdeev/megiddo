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

    # Удалить ограничения из @a, @b
    @removeRestriction i for i in positives.concat negatives

  removeRestriction: (i) ->
    @removedRestrictions.push i

  isRestrictionExist: (i) ->
    @a[i]? and not (i in @removedRestrictions)

  setDeltaGamma: ->
    @delta = []
    @gamma = []

    for i in @I['+'].concat @I['-']
      @delta[i] = - (@alpha[i][0] / @alpha[i][1])
      @gamma[i] = @b[i] / @alpha[i][1]

  setMedians: ->
    @medians = []

    for _, i in @I['+'] by 2 when @I['+'][i + 1]?
      first = @I['+'][i]
      second = @I['+'][i + 1]
      if @delta[first] is @delta[second]
        if @gamma[first] > @gamma[second] then @removeRestriction i
        else @removeRestriction second
      else
        x = (@gamma[second] - @gamma[first]) / (@delta[first] - @delta[second])
        if @U[0]? and x < @U[0]
          if @delta[first] > @delta[second] then @removeRestriction i
          else @removeRestriction second
        else if @U[1]? and x > @U[1]
          if @delta[first] < @delta[second] then @removeRestriction i
          else @removeRestriction second
        else
          @medians.push x

    for _, i in @I['-'] by 2 when @I['-'][i + 1]?
      first = @I['-'][i]
      second = @I['-'][i + 1]
      if @delta[first] is @delta[second]
        if @gamma[first] < @gamma[second] then @removeRestriction i
        else @removeRestriction second
      else
        x = (@gamma[second] - @gamma[first]) / (@delta[first] - @delta[second])
        if @U[0]? and x < @U[0]
          if @delta[first] < @delta[second] then @removeRestriction i
          else @removeRestriction second
        else if @U[1]? and x > @U[1]
          if @delta[first] > @delta[second] then @removeRestriction i
          else @removeRestriction second
        else
          @medians.push x

  sortArr: (arr) ->
    newArr = arr[...] # клонируем массив
    newArr.sort (a, b) ->
      intA = parseInt a
      intB = parseInt b
      if intA < intB then -1
      else if intA > intB then 1
      else 0

  findMediana: (arr) ->
    if arr.length < 74 # специальное число
      @sortArr(arr)[Math.floor((arr.length - 1) / 2)]
    else
      arrCopies = []
      for m in [0..(Math.floor(arr.length / 5) - 1)]
        arrCopies.push @sortArr(arr.slice(m * 5, (m + 1) * 5))[2]
      findMediana arrCopies

  findMax: ->
    x = @findMediana @medians
    if x?
      @Y = {}
      @f = 
        '+': {}
        '-': {}

      @Y['+'] = (val: @delta[i] * x + @gamma[i], i: i for i in @I['+'] when @isRestrictionExist(i))

      if @Y['+'].length
        min = Math.min((i.val for i in @Y['+'])...)
        minI = (i.i for i in @Y['+'] when i.val is min)

        deltas = (@delta[i] for i in minI)
        @f['+'].l = Math.max(deltas...)
        @f['+'].r = Math.min(deltas...)

      @Y['-'] = (val: @delta[i] * x + @gamma[i], i: i for i in @I['-'] when @isRestrictionExist(i))

      if @Y['-'].length
        max = Math.max((i.val for i in @Y['-'])...)
        maxI = (i.i for i in @Y['-'] when i.val is max)

        deltas = (@delta[i] for i in maxI)
        @f['-'].l = Math.min(deltas...)
        @f['-'].r = Math.max(deltas...)

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
    $output.append $('<pre>').text "Y = #{JSON.stringify(@Y, null, 2)}"
    $output.append $('<pre>').text "f = #{JSON.stringify(@f, null, 2)}"
    $output.append $('<pre>').text "removedRestrictions = #{JSON.stringify(@removedRestrictions, null, 2)}"

