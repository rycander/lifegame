(function () {

  window.LifeGame = function (opts) {
    this.liveCells = {};
    this.running = false;
    this.tempinit();
    this.createListeners();
    this.ctx = opts.ctx;
    this.height = opts.height;
    this.width = opts.width;
  };

  LifeGame.prototype.tempinit = function () {
    this.liveCells["11 10"] = {
      x: new BigNumber('11'),
      y: new BigNumber('10')
    };
    this.liveCells[["12 10"]] = {
      x: new BigNumber('12'),
      y: new BigNumber('10')
    };
    this.liveCells[["13 10"]] = {
      x: new BigNumber('13'),
      y: new BigNumber('10')
    };
  };
  
  LifeGame.prototype.run = function () {
    this.running = true;
  };

  LifeGame.prototype.pause = function () {
    this.running = false;
  };

  LifeGame.prototype.update = function () {
    this.newCells = {};
    $.each(this.liveCells, function(cell) {
      this.updateCell(cell);
    }.bind(this));
    $.each(this.liveCells, function(cell) {
      this.deleteCell(cell);
    }.bind(this));
    $.extend(this.liveCells, this.newCells);
  };

  LifeGame.prototype.updateCell = function (cell) {
    var x = this.liveCells[cell].x;
    var y = this.liveCells[cell].y;
    var adjacentCells = this.adjacentCells(x, y);
    liveAdjacent = 0;
    for (var i = 0; i < adjacentCells.length; ++i) {
      var adjx = adjacentCells[i].x;
      var adjy = adjacentCells[i].y;
      if (this.liveCells[adjx + " " + adjy] === undefined){
        this.updateDeadCell(adjx, adjy);
      } else {
        ++liveAdjacent;
      }
    }  
    if (liveAdjacent < 2 || liveAdjacent > 3) {
      this.liveCells[cell]['delete'] = true;
    }
  };

  LifeGame.prototype.deleteCell = function (cell) {
    if (this.liveCells[cell]['delete']) {
      delete this.liveCells[cell];
    }
  };

  LifeGame.prototype.adjacentCells = function (x, y){
    results = [];
    results.push({x: x.plus( 1), y: y.plus( 0)});
    results.push({x: x.plus( 1), y: y.plus( 1)});
    results.push({x: x.plus( 0), y: y.plus( 1)});
    results.push({x: x.plus(-1), y: y.plus( 1)});
    results.push({x: x.plus(-1), y: y.plus( 0)});
    results.push({x: x.plus(-1), y: y.plus(-1)});
    results.push({x: x.plus( 0), y: y.plus(-1)});
    results.push({x: x.plus( 1), y: y.plus(-1)});
    return results;
  };

  LifeGame.prototype.updateDeadCell = function (x, y){
    var adjacentCells = this.adjacentCells(x, y);
    var liveAdjacent = 0;
    for (var i = 0; i < adjacentCells.length; ++i) {
      var adjx = adjacentCells[i].x;
      var adjy = adjacentCells[i].y;
      if (this.liveCells[adjx + " " + adjy] !== undefined) {
        ++liveAdjacent;
      }
    }
    if (liveAdjacent === 3) {
      this.makeNewCell(x, y);
    }
  };

  LifeGame.prototype.makeNewCell = function (x, y) {
    this.newCells[x + " " + y] = {
      x: x,
      y: y
    };
  };

  LifeGame.prototype.draw = function () {
    console.log(this.liveCells);
  };

  LifeGame.prototype.createListeners = function () {
    window.setInterval((function () {
      if (this.running) {
        this.update();
        this.draw(this.ctx);
      }
    }).bind(this), 1000);

    //todo: startListener
    //todo: clickListener
  };
  /*var GameView = window.Asteroids.GameView = function(opts) {
    this.game = new window.Asteroids.Game({
      height: opts.height,
      width: opts.width,
      numAsteroids: Math.ceil(opts.height * opts.width / 25000)
    });
    this.ctx = opts.ctx;
  };
  
  GameView.prototype.start = function () {
    window.setInterval((function () {
      this.game.update();
      this.game.draw(this.ctx);
    }).bind(this), 10);
  };*/
  
  
})();