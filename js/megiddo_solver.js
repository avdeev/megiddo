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
      while (true) {
        console.log(this.activeRestriction());
        this.setMedians();
        if (this.findMax() === false) {
          break;
        }
        this.setI();
        if (this.restrictionCount() <= 4) {
          break;
        }
      }
      return console.log(this.activeRestriction());
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
          if (alpha[1] === 0 && this.isRestrictionExist(i)) {
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
          if (alpha[1] > 0 && this.isRestrictionExist(i)) {
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
          if (alpha[1] < 0 && this.isRestrictionExist(i)) {
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
        this.removedRestrictions.push(i);
        return console.log("" + i + " removed");
      }
    };

    MegiddoSolver.prototype.isRestrictionExist = function(i) {
      return !(__indexOf.call(this.removedRestrictions, i) >= 0);
    };

    MegiddoSolver.prototype.activeRestriction = function() {
      var i, _i, _len, _ref, _results;
      _ref = this.I['+'].concat(this.I['-']);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (this.isRestrictionExist(i)) {
          _results.push(i);
        }
      }
      return _results;
    };

    MegiddoSolver.prototype.restrictionCount = function() {
      return this.activeRestriction().length;
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
      var i, index, j, x, _, _i, _j, _len, _len1, _ref, _ref1, _results;
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
      _results = [];
      for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = _j += 2) {
        _ = _ref1[index];
        if (!(this.I['-'][index + 1] != null)) {
          continue;
        }
        i = this.I['-'][index];
        j = this.I['-'][index + 1];
        if (this.delta[i] === this.delta[j]) {
          _results.push(this.removeRestriction((this.gamma[i] < this.gamma[j] ? i : j)));
        } else {
          x = (this.gamma[j] - this.gamma[i]) / (this.delta[i] - this.delta[j]);
          if ((this.U[0] != null) && x < this.U[0]) {
            _results.push(this.removeRestriction((this.delta[i] < this.delta[j] ? i : j)));
          } else if ((this.U[1] != null) && x > this.U[1]) {
            _results.push(this.removeRestriction((this.delta[i] > this.delta[j] ? i : j)));
          } else {
            _results.push(this.medians.push({
              i: i,
              j: j,
              val: x,
              sign: '-'
            }));
          }
        }
      }
      return _results;
    };

    MegiddoSolver.prototype.findMediana = function(arr) {
      this.medians.sort(function(a, b) {
        if (a.val < b.val) {
          return -1;
        } else if (a.val > b.val) {
          return 1;
        } else {
          return 0;
        }
      });
      return this.medians[Math.floor((arr.length - 1) / 2)];
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
      var median, _i, _len, _ref;
      _ref = this.medians;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        median = _ref[_i];
        if (!(median.val <= x.val)) {
          continue;
        }
        median.removed = true;
        switch (median.sign) {
          case '+':
            this.removeRestriction((this.delta[median.i] > this.delta[median.j] ? median.i : median.j));
            break;
          case '-':
            this.removeRestriction((this.delta[median.i] < this.delta[median.j] ? median.i : median.j));
        }
      }
      return this.medians = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.medians;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          median = _ref1[_j];
          if (!median.removed) {
            _results.push(median);
          }
        }
        return _results;
      }).call(this);
    };

    MegiddoSolver.prototype.removeMediansRight = function(x) {
      var median, _i, _len, _ref;
      _ref = this.medians;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        median = _ref[_i];
        if (!(median.val >= x.val)) {
          continue;
        }
        median.removed = true;
        switch (median.sign) {
          case '+':
            this.removeRestriction((this.delta[median.i] < this.delta[median.j] ? median.i : median.j));
            break;
          case '-':
            this.removeRestriction((this.delta[median.i] > this.delta[median.j] ? median.i : median.j));
        }
      }
      return this.medians = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.medians;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          median = _ref1[_j];
          if (!median.removed) {
            _results.push(median);
          }
        }
        return _results;
      }).call(this);
    };

    MegiddoSolver.prototype.findMax = function() {
      var x;
      while (this.medians.length) {
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
    };

    MegiddoSolver.prototype.print = function($output) {
      $output.empty();
      $output.append($('<pre>').text("I = " + (JSON.stringify(this.I, null, 2))));
      return $output.append($('<pre>').text("U = " + (JSON.stringify(this.U))));
    };

    return MegiddoSolver;

  })();

}).call(this);
