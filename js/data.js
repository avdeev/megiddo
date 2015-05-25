(function() {
  window.loadFromFile = function() {
    window.App || (window.App = {});
    App.c = [4, 5];
    App.a = [[4, 6], [2, 1], [1, -1], [1, 0], [-1, 0], [0, -1]];
    return App.b = [24, 6, 1, 2, 0, 0];
  };

}).call(this);
