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
      var i, negatives, positives, _i, _len, _ref, _ref1, _results;
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
      _ref = this.I['0'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (_ref1 = this.alpha[i][0], __indexOf.call(this.U, _ref1) < 0) {
          _results.push(this.removeRestriction(i));
        }
      }
      return _results;
    };

    MegiddoSolver.prototype.removeRestriction = function(i) {
      if (this.isRestrictionExist(i)) {
        return this.removedRestrictions.push(i);
      }
    };

    MegiddoSolver.prototype.isRestrictionExist = function(i) {
      return !(__indexOf.call(this.removedRestrictions, i) >= 0);
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
      var i, index, j, x, _, _i, _j, _len, _len1, _ref, _ref1;
      this.medians = [];
      _ref = this.I['+'];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = _i += 2) {
        _ = _ref[index];
        if (!(this.I['+'][index + 1] != null)) {
          continue;
        }
        i = this.I['+'][index];
        j = this.I['+'][index + 1];
        if (this.delta[i] === this.delta[j]) {
          this.removeRestriction((this.gamma[i] > this.gamma[j] ? i : j));
        } else {
          x = (this.gamma[j] - this.gamma[i]) / (this.delta[i] - this.delta[j]);
          if ((this.U[0] != null) && x < this.U[0]) {
            this.removeRestriction((this.delta[i] > this.delta[j] ? i : j));
          } else if ((this.U[1] != null) && x > this.U[1]) {
            this.removeRestriction((this.delta[i] < this.delta[j] ? i : j));
          } else {
            this.medians.push({
              i: i,
              j: j,
              val: x,
              sign: '+'
            });
          }
        }
      }
      _ref1 = this.I['-'];
      for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = _j += 2) {
        _ = _ref1[index];
        if (!(this.I['-'][index + 1] != null)) {
          continue;
        }
        i = this.I['-'][index];
        j = this.I['-'][index + 1];
        if (this.delta[i] === this.delta[j]) {
          this.removeRestriction((this.gamma[i] < this.gamma[j] ? i : j));
        } else {
          x = (this.gamma[j] - this.gamma[i]) / (this.delta[i] - this.delta[j]);
          if ((this.U[0] != null) && x < this.U[0]) {
            this.removeRestriction((this.delta[i] < this.delta[j] ? i : j));
          } else if ((this.U[1] != null) && x > this.U[1]) {
            this.removeRestriction((this.delta[i] > this.delta[j] ? i : j));
          } else {
            this.medians.push({
              i: i,
              j: j,
              val: x,
              sign: '-'
            });
          }
        }
      }
      return console.log(this.medians.length);
    };

    MegiddoSolver.prototype.sortArr = function(arr) {
      var newArr;
      newArr = arr.slice(0);
      return newArr.sort(function(a, b) {
        if (a.val < b.val) {
          return -1;
        } else if (a.val > b.val) {
          return 1;
        } else {
          return 0;
        }
      });
    };

    MegiddoSolver.prototype.findMediana = function(arr) {
      var arrCopies, m, _i, _ref;
      if (arr.length <= 10000) {
        return this.sortArr(arr)[Math.floor((arr.length - 1) / 2)];
      } else {
        arrCopies = [];
        for (m = _i = 0, _ref = Math.floor(arr.length / 5) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; m = 0 <= _ref ? ++_i : --_i) {
          arrCopies.push(this.sortArr(arr.slice(m * 5, (m + 1) * 5))[2]);
        }
        return this.findMediana(arrCopies);
      }
    };

    MegiddoSolver.prototype.FPlus = function(x) {
      var Y, deltas, el, i, l, r, val, valIndex;
      Y = (function() {
        var _i, _len, _ref, _results;
        _ref = this.I['+'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (this.isRestrictionExist(i)) {
            _results.push({
              val: this.delta[i] * x.val + this.gamma[i],
              i: i
            });
          }
        }
        return _results;
      }).call(this);
      val = Math.min.apply(Math, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = Y.length; _i < _len; _i++) {
          el = Y[_i];
          _results.push(el.val);
        }
        return _results;
      })());
      valIndex = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = Y.length; _i < _len; _i++) {
          el = Y[_i];
          if (el.val === val) {
            _results.push(el.i);
          }
        }
        return _results;
      })();
      deltas = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = valIndex.length; _i < _len; _i++) {
          i = valIndex[_i];
          _results.push(this.delta[i]);
        }
        return _results;
      }).call(this);
      l = Math.max.apply(Math, deltas);
      r = Math.min.apply(Math, deltas);
      return {
        val: val,
        l: l,
        r: r
      };
    };

    MegiddoSolver.prototype.FMinus = function(x) {
      var Y, deltas, el, i, l, r, val, valIndex;
      Y = (function() {
        var _i, _len, _ref, _results;
        _ref = this.I['-'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (this.isRestrictionExist(i)) {
            _results.push({
              val: this.delta[i] * x.val + this.gamma[i],
              i: i
            });
          }
        }
        return _results;
      }).call(this);
      val = Math.max.apply(Math, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = Y.length; _i < _len; _i++) {
          el = Y[_i];
          _results.push(el.val);
        }
        return _results;
      })());
      valIndex = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = Y.length; _i < _len; _i++) {
          el = Y[_i];
          if (el.val === val) {
            _results.push(el.i);
          }
        }
        return _results;
      })();
      deltas = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = valIndex.length; _i < _len; _i++) {
          i = valIndex[_i];
          _results.push(this.delta[i]);
        }
        return _results;
      }).call(this);
      l = Math.min.apply(Math, deltas);
      r = Math.max.apply(Math, deltas);
      return {
        val: val,
        l: l,
        r: r
      };
    };

    MegiddoSolver.prototype.removeMediansLeft = function(x) {
      var i, median, medians, _i, _len, _results;
      console.log('---- left ----');
      medians = this.medians.slice(0);
      _results = [];
      for (i = _i = 0, _len = medians.length; _i < _len; i = ++_i) {
        median = medians[i];
        if (!(median.val <= x.val)) {
          continue;
        }
        this.medians.splice(i, 1);
        console.log(i);
        console.log(median);
        this.removeRestriction(median.i);
        _results.push(this.removeRestriction(median.j));
      }
      return _results;
    };

    MegiddoSolver.prototype.removeMediansRight = function(x) {
      var i, median, medians, _i, _len, _results;
      console.log('---- right ----');
      medians = this.medians.slice(0);
      _results = [];
      for (i = _i = 0, _len = medians.length; _i < _len; i = ++_i) {
        median = medians[i];
        if (!(median.val >= x.val)) {
          continue;
        }
        this.medians.splice(i, 1);
        console.log(i);
        console.log(median);
        this.removeRestriction(median.i);
        _results.push(this.removeRestriction(median.j));
      }
      return _results;
    };

    MegiddoSolver.prototype.findMax = function() {
      var i, lastRestrictionMinus, lastRestrictionPlus, repeats, x;
      repeats = 500;
      while (this.medians.length && repeats-- > 0) {
        x = this.findMediana(this.medians);
        this.f = {
          '+': this.FPlus(x),
          '-': this.FMinus(x)
        };
        if (this.f['-'].val - this.f['+'].val > 0) {
          if (this.f['-'].r >= this.f['+'].r && this.f['-'].l <= this.f['+'].l) {
            console.log('задача неразрешима');
            return false;
          } else {
            if (this.f['-'].r < this.f['+'].r) {
              this.removeMediansLeft(x);
            } else {
              this.removeMediansRight(x);
            }
          }
        } else {
          if (this.f['+'].l > 0) {
            if (this.f['+'].r > 0 && this.f['+'].r <= this.f['+'].l) {
              this.removeMediansLeft(x);
            } else {
              console.log(x, 'Нашли!');
              return false;
            }
          } else {
            if (this.f['+'].r < 0) {
              this.removeMediansRight(x);
            }
          }
        }
      }
      lastRestrictionPlus = (function() {
        var _i, _len, _ref, _results;
        _ref = this.I['+'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (this.isRestrictionExist(i)) {
            _results.push(i);
          }
        }
        return _results;
      }).call(this);
      lastRestrictionMinus = (function() {
        var _i, _len, _ref, _results;
        _ref = this.I['-'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (this.isRestrictionExist(i)) {
            _results.push(i);
          }
        }
        return _results;
      }).call(this);
      return console.log(lastRestrictionPlus.length + lastRestrictionMinus.length);
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
