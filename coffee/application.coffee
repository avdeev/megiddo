$ ->
  $restrictions = $('#restrictions')
  $function = $('#function')
  $formInputData = $('#form-input-data')

  restrictionTemplate = $('#restriction-template').html()

  addRestriction = (a1, a2, b) ->
    $restriction = $(restrictionTemplate)

    $restriction.find('input[name="a1"]').val(parseInt(a1)) if a1?
    $restriction.find('input[name="a2"]').val(parseInt(a2)) if a2?
    $restriction.find('input[name="b"]').val(parseInt(b)) if b?

    $restriction.find('.remove').on 'click', -> $restriction.remove()

    $restrictions.append $restriction

  setFunction = (c1, c2) ->
    $function.find('input[name="c1"]').val(parseInt(c1)) if c1?
    $function.find('input[name="c2"]').val(parseInt(c2)) if c2?

  printInputData = ->
    setFunction App.c[0], App.c[1]

    $restrictions.empty()
    addRestriction(App.a[i][0], App.a[i][1], App.b[i]) for _, i in App.a

  randomNum = (max, min=0) ->
    Math.floor(Math.random() * (max - min) + min)

  $('#restrictions-add').on 'click', -> addRestriction()

  $('#input-data').on 'submit', (e) -> e.preventDefault()

  $('#calculate').on 'click', ->
    arrayData = $formInputData.serializeArray()
    c = []
    a = []
    b = []
    for input in arrayData
      value = (if input.value then parseInt(input.value) else 0)
      switch input.name
        when 'c1'
          c[0] = value
        when 'c2'
          c[1] = value
        when 'a1'
          a.push []
          a[a.length - 1][0] = value
        when 'a2'
          a[a.length - 1][1] = value
        when 'b'
          b.push value

    App.megiddoSolver = new App.MegiddoSolver a, b, c

    start = Date.now()
    App.megiddoSolver.solve()
    stop = Date.now()

    $output = $('#output')
    $output.empty()
    $output.append $('<h2>Мегиддо</h2>')
    $output.append $('<pre>').text "result = #{JSON.stringify(App.megiddoSolver.result, null, 2)}"
    $output.append $('<pre>').text "Время выполнения: #{stop - start} ms"

    App.megiddoSolver = new App.MegiddoSolver a, b, c

    start = Date.now()
    App.megiddoSolver.solveBySimplex()
    stop = Date.now()

    $output.append $('<h2>Симплекс</h2>')
    $output.append $('<pre>').text "result = #{JSON.stringify(App.megiddoSolver.result, null, 2)}"
    $output.append $('<pre>').text "Время выполнения: #{stop - start} ms"

  $('#load-file').on 'click', ->
    loadFromFile()
    printInputData()

  $('#random-calc').on 'click', ->
    loadFromFile()

    restrictionCount = 100

    App.a = []
    App.b = []
    for i in [0..(restrictionCount - 1)]
      App.a.push [randomNum(100, -100), randomNum(100, -100)]
      App.b.push randomNum(100, -100)

    printInputData()
    $('#calculate').click()