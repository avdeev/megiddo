(function() {
  var restrictionTemplate;

  restrictionTemplate = '<div class="row restriction" style="margin-bottom: 15px;">\n  <div class="col-xs-12">\n    <div class="form-group">\n      <div class="input-group number"></div>\n      <div class="input-group">\n        <input type="text" class="form-control" maxlength="3" name="a1" placeholder="a[0]" style="width: 50px;">\n        <div class="input-group-addon">x</div>\n      </div>\n      <div class="input-group">\n        <div class="input-group-addon">+</div>\n        <input type="text" class="form-control" maxlength="3" name="a2" placeholder="a[1]" style="width: 50px;">\n        <div class="input-group-addon">y</div>\n      </div>\n      <div class="input-group">\n        <div class="input-group-addon"><=</div>\n        <input type="text" class="form-control" maxlength="3" name="b" placeholder="b" style="width: 50px;">\n        <div class="input-group-addon">b</div>\n      </div>\n    </div>\n    <button type="button" class="btn btn-danger remove">\n      <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>\n    </button>\n  </div>\n</div>';

  $(function() {
    var $formInputData, $restrictions, addRestriction, i, _i;
    $restrictions = $('#restrictions');
    $formInputData = $('#form-input-data');
    addRestriction = function() {
      var $restriction;
      $restriction = $(restrictionTemplate);
      $restriction.find('.remove').on('click', function() {
        return $restriction.remove();
      });
      return $restrictions.append($restriction);
    };
    for (i = _i = 0; _i <= 1; i = ++_i) {
      addRestriction();
    }
    $('#restrictions-add').on('click', addRestriction);
    $('#input-data').on('submit', function(e) {
      return e.preventDefault();
    });
    return $('#calculate').on('click', function() {
      var a, arrayData, b, c, input, value, _j, _len;
      arrayData = $formInputData.serializeArray();
      c = [];
      a = [[], []];
      b = [];
      for (_j = 0, _len = arrayData.length; _j < _len; _j++) {
        input = arrayData[_j];
        value = (input.value ? parseInt(input.value) : 0);
        switch (input.name) {
          case 'c':
            c.push(value);
            break;
          case 'a1':
            a[0].push(value);
            break;
          case 'a2':
            a[1].push(value);
            break;
          case 'b':
            b.push(value);
        }
      }
      return console.log(a, b, c);
    });
  });

}).call(this);
