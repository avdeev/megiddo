(function() {
  window.App || (window.App = {});

  App.MegiddoSolver = (function() {
    function MegiddoSolver(a, b, c) {
      this.a = a;
      this.b = b;
      this.c = c;
      this.removedRestrictions = [];
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
      if (negatives.length) {
        this.U[0] = Math.max(negatives);
      }
      if (positives.length) {
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
      return this.removedRestrictions.push(i);
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
      var first, i, second, x, _, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.medians = [];
      _ref = this.I['+'];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = _i += 2) {
        _ = _ref[i];
        if (this.I['+'][i + 1] != null) {
          first = this.I['+'][i];
          second = this.I['+'][i + 1];
          if (this.delta[first] === this.delta[second]) {
            if (this.gamma[first] > this.gamma[second]) {
              this.removeRestriction(i);
            } else {
              this.removeRestriction(second);
            }
          } else {
            x = (this.gamma[second] - this.gamma[first]) / (this.delta[first] - this.delta[second]);
            if ((this.U[0] != null) && x < this.U[0]) {
              if (this.delta[first] > this.delta[second]) {
                this.removeRestriction(i);
              } else {
                this.removeRestriction(second);
              }
            } else if ((this.U[1] != null) && x > this.U[1]) {
              if (this.delta[first] < this.delta[second]) {
                this.removeRestriction(i);
              } else {
                this.removeRestriction(second);
              }
            } else {
              this.medians.push(x);
            }
          }
        }
      }
      _ref1 = this.I['-'];
      _results = [];
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = _j += 2) {
        _ = _ref1[i];
        if (this.I['-'][i + 1] != null) {
          first = this.I['-'][i];
          second = this.I['-'][i + 1];
          if (this.delta[first] === this.delta[i + 1]) {
            if (this.gamma[first] < this.gamma[i + 1]) {
              _results.push(this.removeRestriction(i));
            } else {
              _results.push(this.removeRestriction(i + 1));
            }
          } else {
            x = (this.gamma[i + 1] - this.gamma[first]) / (this.delta[first] - this.delta[i + 1]);
            if ((this.U[0] != null) && x < this.U[0]) {
              if (this.delta[first] < this.delta[i + 1]) {
                _results.push(this.removeRestriction(i));
              } else {
                _results.push(this.removeRestriction(i + 1));
              }
            } else if ((this.U[1] != null) && x > this.U[1]) {
              if (this.delta[first] > this.delta[i + 1]) {
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

    MegiddoSolver.prototype.sortArr = function(arr) {
      var newArr;
      newArr = arr.slice(0);
      return newArr.sort(function(a, b) {
        var intA, intB;
        intA = parseInt(a);
        intB = parseInt(b);
        if (intA < intB) {
          return -1;
        } else if (intA > intB) {
          return 1;
        } else {
          return 0;
        }
      });
    };

    MegiddoSolver.prototype.findMediana = function(arr) {
      var arrCopies, m;
      if (arr.length < 74) {
        return this.sortArr(arr)[Math.floor((arr.length - 1) / 2)];
      } else {
        arrCopies = [];
        m = 0;
        while (m < Math.floor(arr.length / 5)) {
          arrCopies.push(this.sortArr(arr.slice(m * 5, (m + 1) * 5))[2]);
          m++;
        }
        return findMediana(arrCopies);
      }
    };

    MegiddoSolver.prototype.print = function($output) {
      $output.empty();
      $output.append($('<pre>').text("a = " + (JSON.stringify(this.a, null, 2))));
      $output.append($('<pre>').text("b = " + (JSON.stringify(this.b, null, 2))));
      $output.append($('<pre>').text("c = " + (JSON.stringify(this.c, null, 2))));
      $output.append($('<pre>').text("alpha = " + (JSON.stringify(this.alpha, null, 2))));
      $output.append($('<pre>').text("I = " + (JSON.stringify(this.I, null, 2))));
      $output.append($('<pre>').text("U = " + (JSON.stringify(this.U, null, 2))));
      $output.append($('<pre>').text("delta = " + (JSON.stringify(this.delta, null, 2))));
      $output.append($('<pre>').text("gamma = " + (JSON.stringify(this.gamma, null, 2))));
      $output.append($('<pre>').text("medians = " + (JSON.stringify(this.medians, null, 2))));
      return $output.append($('<pre>').text("removedRestrictions = " + (JSON.stringify(this.removedRestrictions, null, 2))));
    };

    return MegiddoSolver;

  })();

}).call(this);
