$ ->
  $restrictions = $('#restrictions')

  $('#input-data').on 'submit', (e) ->
    e.preventDefault()

  $('#calculate').on 'click', ->
    console.log 'Вычислить'

  restrictionTemplate = '''
    <div class="row restriction" style="margin-bottom: 15px;">
      <div class="col-xs-12">
        <div class="form-group">
          <div class="input-group number"></div>
          <div class="input-group">
            <input type="text" class="form-control" maxlength="3" placeholder="a[0]" style="width: 50px;">
            <div class="input-group-addon">x</div>
          </div>
          <div class="input-group">
            <div class="input-group-addon">+</div>
            <input type="text" class="form-control" maxlength="3" placeholder="a[1]" style="width: 50px;">
            <div class="input-group-addon">y</div>
          </div>
          <div class="input-group">
            <div class="input-group-addon"><=</div>
            <input type="text" class="form-control" maxlength="3" placeholder="b" style="width: 50px;">
            <div class="input-group-addon">b</div>
          </div>
        </div>
        <button type="button" class="btn btn-danger remove">
          <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  '''

  $('#restrictions-add').on 'click', ->
    $restriction = $(restrictionTemplate)

    $restriction.find('.remove').on 'click', ->
      $restriction.remove()

    $restrictions.append $restriction