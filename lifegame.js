(function () {

  window.LifeGame = function (opts) {
    this.liveCells = {};
    this.running = false;
    this.createListeners();
    this.ctx = opts.ctx;
    this.height = opts.height;
    this.width = opts.width;

    this.draw();
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
    if (liveAdjacent  === 3) {
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
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    $.each(this.liveCells, function(cell) {
      this.drawCell(cell);
    }.bind(this));
  };

  LifeGame.prototype.toggleCell = function (x, y) {
    var accessStr = x + " " + y;
    if (this.liveCells[accessStr]) {
      delete this.liveCells[accessStr];
    } else {
      this.newCells = {};
      this.makeNewCell(x, y);
      $.extend(this.liveCells, this.newCells);
    }
    this.draw();
  };

  LifeGame.prototype.drawCell = function (cell) {
    var x = this.liveCells[cell].x;
    var y = this.liveCells[cell].y;
    ctx.fillStyle = "#000000";
    ctx.fillRect(x*5, y*5, 5, 5);
  };

  LifeGame.prototype.save = function () {
    var data = JSON.stringify(this.liveCells);
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
    window.open(url, 'blank');
    window.focus();
  };

  LifeGame.prototype.load = function () {

  };

  LifeGame.prototype.createListeners = function () {
    window.setInterval((function () {
      if (this.running) {
        this.update();
        this.draw(this.ctx);
      }
    }).bind(this), 100);

    $("body").keydown( function (event) {
      if (event.which === 82){
        this.run();
      }
      if (event.which === 80){
        this.pause();
      }
      if (event.which === 83){
        this.save();
      }
      if (event.which === 76){
        this.load();
      }
    }.bind(this));

    canvas.addEventListener(
      'mousedown',
      function(evt) {
        var mousePos = this.getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        this.toggleCell(mousePos.x, mousePos.y);
      }.bind(this));
  };

  LifeGame.prototype.getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: new BigNumber(Math.floor((evt.clientX - rect.left) / 5)),
      y: new BigNumber(Math.floor((evt.clientY - rect.top) / 5))
    };
  };
    //todo: startListener
    //todo: clickListener
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