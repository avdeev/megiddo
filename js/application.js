(function() {
  $(function() {
    var $formInputData, $function, $restrictions, addRestriction, i, randomNum, restrictionTemplate, setFunction, _i;
    $restrictions = $('#restrictions');
    $function = $('#function');
    $formInputData = $('#form-input-data');
    restrictionTemplate = $('#restriction-template').html();
    addRestriction = function(a1, a2, b) {
      var $restriction;
      $restriction = $(restrictionTemplate);
      if (a1 != null) {
        $restriction.find('input[name="a1"]').val(parseInt(a1));
      }
      if (a2 != null) {
        $restriction.find('input[name="a2"]').val(parseInt(a2));
      }
      if (b != null) {
        $restriction.find('input[name="b"]').val(parseInt(b));
      }
      $restriction.find('.remove').on('click', function() {
        return $restriction.remove();
      });
      return $restrictions.append($restriction);
    };
    setFunction = function(c1, c2) {
      if (c1 != null) {
        $function.find('input[name="c1"]').val(parseInt(c1));
      }
      if (c2 != null) {
        return $function.find('input[name="c2"]').val(parseInt(c2));
      }
    };
    $('#restrictions-add').on('click', function() {
      return addRestriction();
    });
    $('#input-data').on('submit', function(e) {
      return e.preventDefault();
    });
    $('#calculate').on('click', function() {
      var a, arrayData, b, c, input, value, _i, _len;
      arrayData = $formInputData.serializeArray();
      c = [];
      a = [];
      b = [];
      for (_i = 0, _len = arrayData.length; _i < _len; _i++) {
        input = arrayData[_i];
        value = (input.value ? parseInt(input.value) : 0);
        switch (input.name) {
          case 'c1':
            c[0] = value;
            break;
          case 'c2':
            c[1] = value;
            break;
          case 'a1':
            a.push([]);
            a[a.length - 1][0] = value;
            break;
          case 'a2':
            a[a.length - 1][1] = value;
            break;
          case 'b':
            b.push(value);
        }
      }
      App.megiddoSolver = new App.MegiddoSolver(a, b, c);
      App.megiddoSolver.solve();
      return App.megiddoSolver.print($('#output'));
    });
    $('#load-file').on('click', function() {
      var i, _, _i, _len, _ref, _results;
      if (App.a && App.b && App.c) {
        setFunction(App.c[0], App.c[1]);
        $restrictions.empty();
        _ref = App.a;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          _ = _ref[i];
          _results.push(addRestriction(App.a[i][0], App.a[i][1], App.b[i]));
        }
        return _results;
      }
    });
    randomNum = function(max, min) {
      if (min == null) {
        min = 0;
      }
      return Math.floor(Math.random() * (max - min) + min);
    };
    App.a = [];
    App.b = [];
    for (i = _i = 0; _i <= 99; i = ++_i) {
      App.a.push([randomNum(100, -100), randomNum(100, -100)]);
      App.b.push(randomNum(100, -100));
    }
    $('#load-file').click();
    return $('#calculate').click();
  });

}).call(this);
