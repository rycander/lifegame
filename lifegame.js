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
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(0, 0, this.width, this.height);
    $.each(this.liveCells, function(cell) {
      this.drawCell(cell);
    }.bind(this));
    this.drawLines();
  };

  LifeGame.prototype.drawLines = function () {
    ctx.fillStyle = "#FFFFFF";
    for (var i = 0; i < 101; ++i) {
      ctx.fillRect(i * 8 - 1, 0, 2, 800);
      ctx.fillRect(0, i * 8 - 1, 800, 2);
    }
  };

  LifeGame.prototype.randomColor = function () {
    return Math.floor(Math.random() * 155);
  };

  LifeGame.prototype.drawCell = function (cell) {
    var x = this.liveCells[cell].x;
    var y = this.liveCells[cell].y;
    if (
      x.lessThan(100) &&
      x.greaterThanOrEqualTo(0) &&
      y.lessThan(100) &&
      y.greaterThanOrEqualTo(0)
    ){
      ctx.fillStyle = "rgb(" + this.randomColor() + 
        "," + this.randomColor() +
        "," + 255 + ")";
      ctx.fillRect(x*8, y*8, 8, 8);
    }
  };

  LifeGame.prototype.createListeners = function () {
    window.setInterval((function () {
      if (this.running) {
        this.update();
        this.draw(this.ctx);
      }
    }).bind(this), 0);

    $("body").keydown( function (event) {
      if (event.which === 80){
        this.toggleRun();
      }
      if (event.which === 83){
        this.save();
      }
      // if (event.which === 76){
      //   this.load();
      // }
    }.bind(this));

    canvas.addEventListener(
      'mousedown',
      function(evt) {
        var mousePos = this.getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        this.toggleCell(mousePos.x, mousePos.y);
      }.bind(this)
    );

    document.getElementById('save').addEventListener(
      'click',
      function (evt) {
        this.save();
      }.bind(this),
      false
    );

    document.getElementById('play').addEventListener(
      'click',
      function (evt) {
        this.toggleRun();
      }.bind(this),
      false
    );

    document.getElementById('file').addEventListener(
      'change', function (evt) {
        this.handleFileSelect(evt);
      }.bind(this), false
    );
  };

  LifeGame.prototype.getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: new BigNumber(Math.floor((evt.clientX - rect.left) / 8)),
      y: new BigNumber(Math.floor((evt.clientY - rect.top) / 8))
    };
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

  LifeGame.prototype.toggleRun = function () {
    this.running = !this.running;
  };

  LifeGame.prototype.handleFileSelect = function (evt) {
    var file = evt.target.files[0];
    
    if (file) {
      var reader = new FileReader();
      reader.onload = (function() {
        this.load(reader.result);
      }.bind(this));
      reader.readAsText(file);
    }
  };

  LifeGame.prototype.save = function () {
    var data = JSON.stringify(this.liveCells);
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
    window.open(url, 'blank');
    window.focus();
  };

  LifeGame.prototype.load = function (text) {
    console.log('loading!');
    try{
      var tempCells = JSON.parse(text);
      this.liveCells = this.convertCellsFromJSON(tempCells);
      this.draw();
    }
    catch(err){
      console.log(err);
      alert('Could not parse file.');
    }
  };

  LifeGame.prototype.convertToBigNumber = function (num) {
    var result = new BigNumber (0);
    result.s = num.s;
    result.e = num.e;
    result.c = num.c;
    return result;
  };

  LifeGame.prototype.convertCellsFromJSON = function (cells) {
    $.each(cells, function(cell) {
      cells[cell].x = this.convertToBigNumber(cells[cell].x);
      cells[cell].y = this.convertToBigNumber(cells[cell].y);
    }.bind(this));
    return cells;
  };
  
})();