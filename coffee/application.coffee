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
    App.megiddoSolver.solve()

    $output = $('#output')
    $output.empty()
    $output.append $('<pre>').text "I = #{JSON.stringify(App.megiddoSolver.I, null, 2)}"
    $output.append $('<pre>').text "U = #{JSON.stringify(App.megiddoSolver.U)}"
    $output.append $('<pre>').text "result = #{App.megiddoSolver.result}"
    $output.append $('<pre>').text "point = [#{App.megiddoSolver.point.x}, #{App.megiddoSolver.point.y}]"

  $('#load-file').on 'click', ->
    if App.a and App.b and App.c
      setFunction App.c[0], App.c[1]

      $restrictions.empty()
      addRestriction(App.a[i][0], App.a[i][1], App.b[i]) for _, i in App.a


  randomNum = (max, min=0) ->
    Math.floor(Math.random() * (max - min) + min)

  # App.a = []
  # App.b = []
  # for i in [0..999]
  #   App.a.push [randomNum(100, -100), randomNum(100, -100)]
  #   App.b.push randomNum(100, -100)

  # $('#load-file').click()
  # $('#calculate').click()