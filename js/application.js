(function() {
  $(function() {
    var $restrictions, restrictionTemplate;
    $restrictions = $('#restrictions');
    $('#input-data').on('submit', function(e) {
      return e.preventDefault();
    });
    $('#calculate').on('click', function() {
      return console.log('Вычислить');
    });
    restrictionTemplate = '<div class="row restriction" style="margin-bottom: 15px;">\n  <div class="col-xs-12">\n    <div class="form-group">\n      <div class="input-group number"></div>\n      <div class="input-group">\n        <input type="text" class="form-control" maxlength="3" placeholder="a[0]" style="width: 50px;">\n        <div class="input-group-addon">x</div>\n      </div>\n      <div class="input-group">\n        <div class="input-group-addon">+</div>\n        <input type="text" class="form-control" maxlength="3" placeholder="a[1]" style="width: 50px;">\n        <div class="input-group-addon">y</div>\n      </div>\n      <div class="input-group">\n        <div class="input-group-addon"><=</div>\n        <input type="text" class="form-control" maxlength="3" placeholder="b" style="width: 50px;">\n        <div class="input-group-addon">b</div>\n      </div>\n    </div>\n    <button type="button" class="btn btn-danger remove">\n      <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>\n    </button>\n  </div>\n</div>';
    return $('#restrictions-add').on('click', function() {
      var $restriction;
      $restriction = $(restrictionTemplate);
      $restriction.find('.remove').on('click', function() {
        return $restriction.remove();
      });
      return $restrictions.append($restriction);
    });
  });

}).call(this);
