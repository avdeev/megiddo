(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
      this.setMedians();
      return this.findMax();
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
      var alpha, i;
      this.I = {};
      this.I['0'] = (function() {
        var _i, _len, _ref, _results;
        _ref = this.alpha;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          alpha = _ref[i];
          if (alpha[1] === 0) {
            _results.push(i);
          }
        }
        return _results;
      }).call(this);
      this.I['+'] = (function() {
        var _i, _len, _ref, _results;
        _ref = this.alpha;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          alpha = _ref[i];
          if (alpha[1] > 0) {
            _results.push(i);
          }
        }
        return _results;
      }).call(this);
      return this.I['-'] = (function() {
        var _i, _len, _ref, _results;
        _ref = this.alpha;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          alpha = _ref[i];
          if (alpha[1] < 0) {
            _results.push(i);
          }
        }
        return _results;
      }).call(this);
    };

    MegiddoSolver.prototype.setU = function() {
      var i, negatives, positives, _i, _len, _ref, _results;
      this.U = [];
      if (!this.I['0'].length) {
        return;
      }
      positives = (function() {
        var _i, _len, _ref, _results;
        _ref = this.I['0'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (this.alpha[i][0] > 0) {
            _results.push(this.alpha[i][0]);
          }
        }
        return _results;
      }).call(this);
      negatives = (function() {
        var _i, _len, _ref, _results;
        _ref = this.I['0'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (this.alpha[i][0] < 0) {
            _results.push(this.alpha[i][0]);
          }
        }
        return _results;
      }).call(this);
      if (negatives.length) {
        this.U[0] = Math.max.apply(Math, negatives);
      }
      if (positives.length) {
        this.U[1] = Math.min.apply(Math, positives);
      }
      _ref = positives.concat(negatives);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(this.removeRestriction(i));
      }
      return _results;
    };

    MegiddoSolver.prototype.removeRestriction = function(i) {
      return this.removedRestrictions.push(i);
    };

    MegiddoSolver.prototype.isRestrictionExist = function(i) {
      return (this.a[i] != null) && !(__indexOf.call(this.removedRestrictions, i) >= 0);
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
        if (!(this.I['+'][i + 1] != null)) {
          continue;
        }
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
      _ref1 = this.I['-'];
      _results = [];
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = _j += 2) {
        _ = _ref1[i];
        if (!(this.I['-'][i + 1] != null)) {
          continue;
        }
        first = this.I['-'][i];
        second = this.I['-'][i + 1];
        if (this.delta[first] === this.delta[second]) {
          if (this.gamma[first] < this.gamma[second]) {
            _results.push(this.removeRestriction(i));
          } else {
            _results.push(this.removeRestriction(second));
          }
        } else {
          x = (this.gamma[second] - this.gamma[first]) / (this.delta[first] - this.delta[second]);
          if ((this.U[0] != null) && x < this.U[0]) {
            if (this.delta[first] < this.delta[second]) {
              _results.push(this.removeRestriction(i));
            } else {
              _results.push(this.removeRestriction(second));
            }
          } else if ((this.U[1] != null) && x > this.U[1]) {
            if (this.delta[first] > this.delta[second]) {
              _results.push(this.removeRestriction(i));
            } else {
              _results.push(this.removeRestriction(second));
            }
          } else {
            _results.push(this.medians.push(x));
          }
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
      var arrCopies, m, _i, _ref;
      if (arr.length < 74) {
        return this.sortArr(arr)[Math.floor((arr.length - 1) / 2)];
      } else {
        arrCopies = [];
        for (m = _i = 0, _ref = Math.floor(arr.length / 5) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; m = 0 <= _ref ? ++_i : --_i) {
          arrCopies.push(this.sortArr(arr.slice(m * 5, (m + 1) * 5))[2]);
        }
        return findMediana(arrCopies);
      }
    };

    MegiddoSolver.prototype.findMax = function() {
      var deltas, i, max, maxI, min, minI, x;
      x = this.findMediana(this.medians);
      if (x != null) {
        this.Y = {};
        this.f = {
          '+': {},
          '-': {}
        };
        this.Y['+'] = (function() {
          var _i, _len, _ref, _results;
          _ref = this.I['+'];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            if (this.isRestrictionExist(i)) {
              _results.push({
                val: this.delta[i] * x + this.gamma[i],
                i: i
              });
            }
          }
          return _results;
        }).call(this);
        if (this.Y['+'].length) {
          min = Math.min.apply(Math, (function() {
            var _i, _len, _ref, _results;
            _ref = this.Y['+'];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              _results.push(i.val);
            }
            return _results;
          }).call(this));
          minI = (function() {
            var _i, _len, _ref, _results;
            _ref = this.Y['+'];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              if (i.val === min) {
                _results.push(i.i);
              }
            }
            return _results;
          }).call(this);
          deltas = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = minI.length; _i < _len; _i++) {
              i = minI[_i];
              _results.push(this.delta[i]);
            }
            return _results;
          }).call(this);
          this.f['+'].l = Math.max.apply(Math, deltas);
          this.f['+'].r = Math.min.apply(Math, deltas);
        }
        this.Y['-'] = (function() {
          var _i, _len, _ref, _results;
          _ref = this.I['-'];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            if (this.isRestrictionExist(i)) {
              _results.push({
                val: this.delta[i] * x + this.gamma[i],
                i: i
              });
            }
          }
          return _results;
        }).call(this);
        if (this.Y['-'].length) {
          max = Math.max.apply(Math, (function() {
            var _i, _len, _ref, _results;
            _ref = this.Y['-'];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              _results.push(i.val);
            }
            return _results;
          }).call(this));
          maxI = (function() {
            var _i, _len, _ref, _results;
            _ref = this.Y['-'];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              if (i.val === max) {
                _results.push(i.i);
              }
            }
            return _results;
          }).call(this);
          deltas = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = maxI.length; _i < _len; _i++) {
              i = maxI[_i];
              _results.push(this.delta[i]);
            }
            return _results;
          }).call(this);
          this.f['-'].l = Math.min.apply(Math, deltas);
          return this.f['-'].r = Math.max.apply(Math, deltas);
        }
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
      $output.append($('<pre>').text("Y = " + (JSON.stringify(this.Y, null, 2))));
      $output.append($('<pre>').text("f = " + (JSON.stringify(this.f, null, 2))));
      return $output.append($('<pre>').text("removedRestrictions = " + (JSON.stringify(this.removedRestrictions, null, 2))));
    };

    return MegiddoSolver;

  })();

}).call(this);
