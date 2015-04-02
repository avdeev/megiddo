window.App ||= {}
class App.MegiddoSolver
  alpha: []
  I:
    '-': []
    '0': []
    '+': []

  U: []

  constructor: (@a, @b, @c) ->

  solve: ->
    @setAlpha()
    @setI()
    @setU()

  setAlpha: ->
    @alpha = []

    for _, i in @a
      @alpha.push []
      @alpha[i][0] = @a[i][0] - (@c[0] / @c[1]) * @a[i][1]
      @alpha[i][1] = @a[i][1] / @c[1]

  setI: ->
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
