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

    @U[0] = Math.max(negatives) if negatives.length
    @U[1] = Math.min(positives) if positives.length

    # Удалить ограничения из @a, @b
    @removeRestriction i for i in positives.concat negatives

  removeRestriction: (i) ->
    @removedRestrictions.push i

  setDeltaGamma: ->
    @delta = []
    @gamma = []

    for i in @I['+'].concat @I['-']
      @delta[i] = - (@alpha[i][0] / @alpha[i][1])
      @gamma[i] = @b[i] / @alpha[i][1]

  setMedians: ->
    @medians = []

    for _, i in @I['+'] by 2
      if @I['+'][i + 1]?
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

    for _, i in @I['-'] by 2
      if @I['-'][i + 1]?
        first = @I['-'][i]
        second = @I['-'][i + 1]
        if @delta[first] is @delta[i + 1]
          if @gamma[first] < @gamma[i + 1] then @removeRestriction i
          else @removeRestriction i + 1
        else
          x = (@gamma[i + 1] - @gamma[first]) / (@delta[first] - @delta[i + 1])
          if @U[0]? and x < @U[0]
            if @delta[first] < @delta[i + 1] then @removeRestriction i
            else @removeRestriction i + 1
          else if @U[1]? and x > @U[1]
            if @delta[first] > @delta[i + 1] then @removeRestriction i
            else @removeRestriction i + 1
          else
            @medians.push x

  sortArr: (arr) ->
    newArr = arr.slice(0) # клонируем массив
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
      m = 0
      while m < Math.floor(arr.length / 5)
        arrCopies.push @sortArr(arr.slice(m * 5, (m + 1) * 5))[2]
        m++
      findMediana arrCopies 

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

