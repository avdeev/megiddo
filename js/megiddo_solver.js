(function() {
  window.App || (window.App = {});

  App.MegiddoSolver = (function() {
    MegiddoSolver.prototype.alpha = [];

    MegiddoSolver.prototype.I = {
      '-': [],
      '0': [],
      '+': []
    };

    MegiddoSolver.prototype.U = [];

    function MegiddoSolver(a, b, c) {
      this.a = a;
      this.b = b;
      this.c = c;
    }

    MegiddoSolver.prototype.solve = function() {
      this.setAlpha();
      this.setI();
      return this.setU();
    };

    MegiddoSolver.prototype.setAlpha = function() {
      var i, _, _i, _len, _ref, _results;
      this.alpha = [];
      _ref = this.a;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        _ = _ref[i];
        this.alpha.push([]);
        this.alpha[i][0] = this.a[i][0] - (this.c[0] / this.c[1]) * this.a[i][1];
        _results.push(this.alpha[i][1] = this.a[i][1] / this.c[1]);
      }
      return _results;
    };

    MegiddoSolver.prototype.setI = function() {
      var alpha, i, _i, _len, _ref, _results;
      _ref = this.alpha;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        alpha = _ref[i];
        if (alpha[1] === 0) {
          _results.push(this.I['0'].push(i));
        } else if (alpha[1] > 0) {
          _results.push(this.I['+'].push(i));
        } else if (alpha[1] < 0) {
          _results.push(this.I['-'].push(i));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    MegiddoSolver.prototype.setU = function() {
      return this.U = [];
    };

    return MegiddoSolver;

  })();

}).call(this);
