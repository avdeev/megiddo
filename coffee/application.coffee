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

  $('#restrictions-add').on 'click', addRestriction

  $('#input-data').on 'submit', (e) -> e.preventDefault()

  $('#calculate').on 'click', ->
    arrayData = $formInputData.serializeArray()
    App.c = []
    App.a = []
    App.b = []
    for input in arrayData
      value = (if input.value then parseInt(input.value) else 0)
      switch input.name
        when 'c1'
          App.c[0] = value
        when 'c2'
          App.c[1] = value
        when 'a1'
          App.a.push []
          App.a[App.a.length - 1][0] = value
        when 'a2'
          App.a[App.a.length - 1][1] = value
        when 'b'
          App.b.push value

    console.log App

  $('#load-file').on 'click', ->
    if App.a and App.b and App.c
      setFunction App.c[0], App.c[1]

      $restrictions.empty()
      addRestriction(App.a[i][0], App.a[i][1], App.b[i]) for _, i in App.a
