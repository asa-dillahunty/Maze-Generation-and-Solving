function setup() {
  document.getElementById("mazeSection").style.display = "flex";
  maze.build("RB");
}

function downloadMaze() {
  var link = document.createElement("a");

  if (maze.isSolved()) link.download = `maze${maze.number}solved.png`;
  else link.download = `maze${maze.number}.png`;
  link.href = document.getElementById("mazeCanvas").toDataURL("image/png");
  link.click();
  // document.write('<img src="'+img+'"/>');
}

function callWithTimeout(obj, func, time = 100) {
  disableButtons();
  setTimeout(function () {
    if (obj == null) func();
    else if (func == "increaseRender") obj.increaseRender();
    else if (func == "reduceRender") obj.reduceRender();
    else if (func == "build") obj.build("RB");
    else if (func == "solve") obj.solve();
    enableButtons();
  }, time);
}

var maze = {
  number: 0,
  CELL: 5, // I'm worried undefined and 0 may be equal in some scenarios
  WALL: 1,
  VISITED: 2,
  DEADEND: 3,
  SOLUTION: 4,
  height: 0,
  width: 0,
  renderScale: 6,
  matrix: [],
  build: function (type) {
    this.number = parseInt(document.getElementById("mazeSize").value);
    this.mazeInit(this.number, 1);
    if (type == "RB") this.RBMaze();
    else if (type == "prim") this.primMaze();
    this.render();
  },
  mazeInit: function (size, speed) {
    this.width = fib(size) * 2 + 1;
    this.height = fib(size + 1) * 2 + 1;

    this.matrix = [];

    for (var i = 0; i < maze.width; i++) {
      var temp = [];
      for (var j = 0; j < maze.height; j++) {
        if (i % 2 == 1 && j % 2 == 1) temp.push(this.CELL);
        else temp.push(this.WALL);
      }
      this.matrix.push(temp);
    }

    this.matrix[1][0] = this.CELL;
    this.matrix[this.width - 2][this.height - 1] = this.CELL;
  },
  RBMaze() {
    stack = [];

    var n = Math.floor(Math.random() * (this.height - 1));
    var m = Math.floor(Math.random() * (this.width - 1));
    if (n % 2 == 0) n++;
    if (m % 2 == 0) m++;

    stack.push(m * this.height + n);

    var curr, next, x, y, nx, ny;
    var pos; // possible positions to travel to
    while (stack.length) {
      curr = stack.pop();

      x = Math.floor(curr / this.height);
      y = curr % this.height;

      this.matrix[x][y] = this.VISITED;

      pos = this.getPos(curr, 2, [this.CELL]);

      if (pos.length == 0) continue;
      if (pos.length > 1) stack.push(curr);

      next = getRandom(pos);
      stack.push(next);

      nx = Math.floor(next / this.height);
      ny = next % this.height;

      this.matrix[nx][ny] = this.VISITED;

      this.matrix[(x + nx) / 2][(y + ny) / 2] = this.CELL; // this is the wall between the two visited points
    }
  },
  primMaze() {
    list = [];

    var n = Math.floor(Math.random() * (this.height - 1));
    var m = Math.floor(Math.random() * (this.width - 1));
    if (n % 2 == 0) n++;
    if (m % 2 == 0) m++;

    this.matrix[m][n] = this.VISITED;
    list.push(m * this.height + n);

    var curr;
    var next;
    var index;
    while (list.length > 0) {
      index = Math.floor(Math.random() * list.length);
      curr = list[index];

      x = Math.floor(curr / this.height);
      y = curr % this.height;

      pos = this.getPos(curr, 2, [this.CELL]);

      if (pos.length <= 1) {
        // remove index
        list.splice(index, 1);
        if (pos.length < 1) continue;
      }

      next = getRandom(pos);
      list.push(next);

      nx = Math.floor(next / this.height);
      ny = next % this.height;
      this.matrix[nx][ny] = this.VISITED;

      this.matrix[(x + nx) / 2][(y + ny) / 2] = this.CELL; // this is the wall between the two visited points
    }
  },
  getPos: function (cord, scale, allowed) {
    var options = [];

    var x = Math.floor(cord / this.height);
    var y = cord % this.height;
    var deltas = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ];

    var classification;

    for (var i = 0; i < deltas.length; i++) {
      try {
        dx = deltas[i].x * scale;
        dy = deltas[i].y * scale;

        // this is the scenario in which I was worried 0 == undefined, so I changed it
        classification = this.matrix[x + dx][y + dy];
        if (!classification) continue;

        // make sure it contains all in contained
        for (var j = 0; j < allowed.length; j++) {
          if (classification === allowed[j]) {
            options.push(cord + dx * this.height + dy);
            break;
          }
        }
      } catch (err) {
        continue;
      }
    }
    return options;
  },
  solve: function () {
    var end = this.height * (this.width - 2) + this.height - 1;

    if (this.isSolved()) {
      for (var i = 0; i < this.matrix.length; i++)
        for (var j = 0; j < this.matrix[i].length; j++)
          if (
            this.matrix[i][j] == this.DEADEND ||
            this.matrix[i][j] == this.SOLUTION
          )
            this.matrix[i][j] = this.CELL;
    }

    var stack = [];
    stack.push(this.height);

    var curr, x, y, next;
    while (stack.length) {
      curr = stack.pop();
      x = Math.floor(curr / this.height);
      y = Math.floor(curr % this.height);

      this.matrix[x][y] = this.SOLUTION;

      if (curr == end) break;

      pos = this.getPos(curr, 1, [this.CELL, this.VISITED]);

      if (pos.length == 0) {
        // dead end
        this.matrix[x][y] = this.DEADEND;
        continue;
      }
      stack.push(curr); // reinsert for backtracking purposes

      // perhaps insert some sort of heuristic instead of choosing randomly?
      next = getRandom(pos);
      stack.push(next);
    }
    this.render();
  },
  isSolved: function () {
    // we can ensure there will always be one solution
    return this.matrix[1][0] == this.SOLUTION;
  },
  render: function () {
    // set canvas size to fill
    // width = height,
    // height = width

    var c = document.getElementById("mazeCanvas");
    c.width = this.renderScale * this.height;
    c.height = this.renderScale * this.width;

    var cc = document.getElementById("canvasContainer");
    cc.style.height = c.height + "px";
    cc.style.width = c.width + "px";

    var ctx = c.getContext("2d");
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        ctx.fillStyle = "#FFFFFF"; // default to white
        if (this.matrix[i][j] == this.DEADEND) {
          ctx.fillStyle = "#555555"; // grey?
        } else if (this.matrix[i][j] == this.SOLUTION) {
          ctx.fillStyle = "#FF108F";
        } else if (this.matrix[i][j] == this.WALL) {
          ctx.fillStyle = "#000000";
        }
        // flip i and j because I set up my matrix wrong and don't want to fix it
        ctx.fillRect(
          j * this.renderScale,
          i * this.renderScale,
          this.renderScale,
          this.renderScale
        );
      }
    }

    // Check if magnifying glasses fit in the canvas,
    // otherwise swap with outside glasses
    var arr;
    if (c.width < 110) {
      // set outside to active
      arr = document.getElementsByClassName("glassButtons");
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].classList.contains("outside"))
          arr[i].style.display = "inherit";
        else arr[i].style.display = "none";
      }
    } else {
      // set inside to active
      arr = document.getElementsByClassName("glassButtons");
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].classList.contains("inside"))
          arr[i].style.display = "inherit";
        else arr[i].style.display = "none";
      }
    }
  },
  reduceRender: function () {
    if (this.renderScale == 1) return;

    this.renderScale -= 1;
    this.render();
  },
  increaseRender: function () {
    if (this.renderScale == 10) return;

    this.renderScale += 1;
    this.render();
  },
};

function disableButtons() {
  var buttons = document.getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.cursor = "wait";
    buttons[i].disabled = true;
  }
}

function enableButtons() {
  var buttons = document.getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
    buttons[i].style.cursor = "pointer";
  }
}

// non recursive fibonacci
// time complexity n :)
function fib(n) {
  if (n < 2) return 1;
  var fib1 = 1,
    fib2 = 1,
    fib3;
  for (var i = 1; i < n; i++) {
    fib3 = fib1 + fib2;
    fib1 = fib2;
    fib2 = fib3;
  }
  return fib3;
}

// recursive fibonacci
// time complexity is like roughly 2^n :(
function recursiveFib(n) {
  if (n < 2) return 1;
  return recursiveFib(n - 1) + recursiveFib(n - 2);
}

// for updating slider value
function updateVal(valId, id) {
  document.getElementById(id).value = document.getElementById(valId).value;
}

function getRandom(array) {
  // assume array has something in it
  return array[Math.floor(Math.random() * array.length)];
}
