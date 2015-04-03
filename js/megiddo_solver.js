(function() {
  window.App || (window.App = {});

  App.MegiddoSolver = (function() {
    function MegiddoSolver(a, b, c) {
      this.a = a;
      this.b = b;
      this.c = c;
    }

    MegiddoSolver.prototype.solve = function() {
      this.setAlpha();
      this.setI();
      this.setU();
      this.setDeltaGamma();
      return this.setMedians();
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
      this.I = {
        '-': [],
        '0': [],
        '+': []
      };
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
      var alpha, i, negatives, positives, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.U = [];
      positives = [];
      negatives = [];
      _ref = this.I['0'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        alpha = this.alpha[i][0];
        if (alpha > 0) {
          positives.push(alpha);
        }
        if (alpha < 0) {
          negatives.push(alpha);
        }
      }
      if (negatives) {
        this.U[0] = Math.max(negatives);
      }
      if (positives) {
        this.U[1] = Math.min(positives);
      }
      _ref1 = positives.concat(negatives);
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        i = _ref1[_j];
        _results.push(this.removeRestriction(i));
      }
      return _results;
    };

    MegiddoSolver.prototype.removeRestriction = function(i) {
      if (this.a[i] != null) {
        this.a.splice(i, 1);
      }
      if (this.b[i] != null) {
        return this.b.splice(i, 1);
      }
    };

    MegiddoSolver.prototype.isRestrictionExist = function(i) {
      return this.a[i] != null;
    };

    MegiddoSolver.prototype.setDeltaGamma = function() {
      var i, _i, _len, _ref, _results;
      this.delta = [];
      this.gamma = [];
      _ref = this.I['+'].concat(this.I['-']);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        this.delta[i] = -(this.alpha[i][0] / this.alpha[i][1]);
        _results.push(this.gamma[i] = this.b[i] / this.alpha[i][1]);
      }
      return _results;
    };

    MegiddoSolver.prototype.setMedians = function() {
      var i, x, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.medians = [];
      _ref = this.I['+'];
      for (_i = 0, _len = _ref.length; _i < _len; _i += 2) {
        i = _ref[_i];
        if (this.isRestrictionExist(i + 1)) {
          console.log(i, i + 1);
          if (this.delta[i] === this.delta[i + 1]) {
            if (this.gamma[i] > this.gamma[i + 1]) {
              this.removeRestriction(i);
            } else {
              this.removeRestriction(i + 1);
            }
          } else {
            x = (this.gamma[i + 1] - this.gamma[i]) / (this.delta[i] - this.delta[i + 1]);
            if ((this.U[0] != null) && x < this.U[0]) {
              if (this.delta[i] > this.delta[i + 1]) {
                this.removeRestriction(i);
              } else {
                this.removeRestriction(i + 1);
              }
            } else if ((this.U[1] != null) && x > this.U[1]) {
              if (this.delta[i] < this.delta[i + 1]) {
                this.removeRestriction(i);
              } else {
                this.removeRestriction(i + 1);
              }
            } else {
              this.medians.push(x);
            }
          }
        }
      }
      _ref1 = this.I['-'];
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j += 2) {
        i = _ref1[_j];
        if (this.isRestrictionExist(i + 1)) {
          console.log(i, i + 1);
          if (this.delta[i] === this.delta[i + 1]) {
            if (this.gamma[i] < this.gamma[i + 1]) {
              _results.push(this.removeRestriction(i));
            } else {
              _results.push(this.removeRestriction(i + 1));
            }
          } else {
            x = (this.gamma[i + 1] - this.gamma[i]) / (this.delta[i] - this.delta[i + 1]);
            if ((this.U[0] != null) && x < this.U[0]) {
              if (this.delta[i] < this.delta[i + 1]) {
                _results.push(this.removeRestriction(i));
              } else {
                _results.push(this.removeRestriction(i + 1));
              }
            } else if ((this.U[1] != null) && x > this.U[1]) {
              if (this.delta[i] > this.delta[i + 1]) {
                _results.push(this.removeRestriction(i));
              } else {
                _results.push(this.removeRestriction(i + 1));
              }
            } else {
              _results.push(this.medians.push(x));
            }
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return MegiddoSolver;

  })();

}).call(this);
