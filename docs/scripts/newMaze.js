let mazeCanvas;

function kickoff() {
  console.log("here");
  mazeCanvasContainer = document.getElementById("newMazeCanvas-container");
  mazeCanvasContainer.style.display = "flex";

  mazeCanvas = document.getElementById("newMazeCanvas");
  restart();
}

function restart() {
  console.log("restarting");
  mazeCanvas.width = window.innerWidth;
  mazeCanvas.height = window.innerHeight;

  newMaze.mazeInit();
  newMaze.render();

  stepThrough(
    () => newMaze.RBMazeStep(),
    () => stepThrough(() => newMaze.solveRBStep(), restart)
  );
}

function stepThrough(stepFunc, doneFunc) {
  const result = stepFunc();
  newMaze.render();

  if (result === "done") setTimeout(doneFunc, newMaze.speed * 10);
  else setTimeout(() => stepThrough(stepFunc, doneFunc), newMaze.speed);
}

const newMaze = {
  speed: 10,
  CELL: 5, // I'm worried undefined and 0 may be equal in some scenarios
  WALL: 1,
  VISITED: 2,
  DEADEND: 3,
  SOLUTION: 4,
  height: 0,
  width: 0,
  renderScale: 0,
  matrix: [],
  buildList: [],
  solveList: [],

  build: function (type) {
    if (type === "RB") this.RBMazeStep();
    else if (type === "prim") this.primMaze();
    this.render();
  },
  mazeInit: function () {
    // grab my own height/width
    const canvHeight = mazeCanvas.height;
    const canvWidth = mazeCanvas.width;

    // we aim for a specific area, lets say 100
    const goalArea = 1000;
    const realArea = canvHeight * canvWidth;

    const res = Math.sqrt(realArea / goalArea);
    // should this be floor or ceil?
    const w = Math.floor(canvWidth / res);
    const h = Math.floor(canvHeight / res);

    this.width = w * 2 + 1;
    this.height = h * 2 + 1;

    this.renderScale = Math.floor(
      (canvWidth / this.width + canvHeight / this.height) / 2
    );

    // then we adjust, and fill in the extra space
    while (this.width * this.renderScale < canvWidth) {
      this.width++;
    }
    if (this.width % 2 === 0) this.width--;
    while (this.height * this.renderScale < canvHeight) {
      this.height++;
    }
    if (this.height % 2 === 0) this.height--;

    this.matrix = [];
    this.buildList = [];
    this.solveList = [];

    for (var i = 0; i < newMaze.width; i++) {
      var temp = [];
      for (var j = 0; j < newMaze.height; j++) {
        if (i % 2 === 1 && j % 2 === 1) temp.push(this.CELL);
        else temp.push(this.WALL);
      }
      this.matrix.push(temp);
    }

    this.matrix[1][0] = this.CELL;
    this.matrix[this.width - 2][this.height - 1] = this.CELL;
  },
  RBMazeStep: function () {
    if (this.buildList.length < 1) {
      var n = Math.floor(Math.random() * (this.height - 1));
      var m = Math.floor(Math.random() * (this.width - 1));
      if (n % 2 === 0) n++;
      if (m % 2 === 0) m++;

      this.buildList.push(m * this.height + n);
    }

    var curr, x, y, nx, ny, pos;
    var next = null;
    while (this.buildList.length && next === null) {
      curr = this.buildList.pop();

      x = Math.floor(curr / this.height);
      y = curr % this.height;

      this.matrix[x][y] = this.VISITED;

      pos = this.getPos(curr, 2, [this.CELL]);

      if (pos.length === 0) continue;
      if (pos.length > 1) this.buildList.push(curr);

      next = getRandom(pos);
      this.buildList.push(next);

      nx = Math.floor(next / this.height);
      ny = next % this.height;

      this.matrix[nx][ny] = this.VISITED;

      this.matrix[(x + nx) / 2][(y + ny) / 2] = this.CELL; // this is the wall between the two visited points
    }

    if (this.buildList.length === 0) return "done";
    else return "not done";
  },
  primMazeStep() {
    if (this.buildList.length < 1) {
      var n = Math.floor(Math.random() * (this.height - 1));
      var m = Math.floor(Math.random() * (this.width - 1));
      if (n % 2 === 0) n++;
      if (m % 2 === 0) m++;

      this.matrix[m][n] = this.VISITED;
      this.buildList.push(m * this.height + n);
    }

    var curr, index;
    var next = null;
    while (this.buildList.length > 0 && next === null) {
      index = Math.floor(Math.random() * this.buildList.length);
      curr = this.buildList[index];

      x = Math.floor(curr / this.height);
      y = curr % this.height;

      pos = this.getPos(curr, 2, [this.CELL]);

      if (pos.length <= 1) {
        // remove index
        this.buildList.splice(index, 1);
        if (pos.length < 1) continue;
      }

      next = getRandom(pos);
      this.buildList.push(next);

      nx = Math.floor(next / this.height);
      ny = next % this.height;
      this.matrix[nx][ny] = this.VISITED;

      this.matrix[(x + nx) / 2][(y + ny) / 2] = this.CELL; // this is the wall between the two visited points
    }

    if (this.buildList.length < 1) return "done";
    else return "not done";
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
  solveRBStep: function () {
    const end = this.height * (this.width - 2) + this.height - 1;

    if (this.solveList.length < 1) {
      this.solveList.push(this.height);
    }

    var curr, x, y;
    var next = null;
    while (this.solveList.length && next === null) {
      curr = this.solveList.pop();
      x = Math.floor(curr / this.height);
      y = Math.floor(curr % this.height);

      this.matrix[x][y] = this.SOLUTION;

      if (curr === end) {
        // is solved
        return "done";
      }

      pos = this.getPos(curr, 1, [this.CELL, this.VISITED]);

      if (pos.length === 0) {
        // dead end
        this.matrix[x][y] = this.DEADEND;
        return "not done";
      }
      this.solveList.push(curr); // reinsert for backtracking purposes

      // perhaps insert some sort of heuristic instead of choosing randomly?
      next = getRandom(pos);
      this.solveList.push(next);
    }

    if (curr === end) return "done";
    else return "not done";
  },
  render: function () {
    // set canvas size to fill
    // width = height,
    // height = width

    mazeCanvas.width = this.renderScale * this.width;
    mazeCanvas.height = this.renderScale * this.height;

    var ctx = mazeCanvas.getContext("2d");
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        ctx.fillStyle = "#353063";
        if (this.matrix[i][j] === this.DEADEND) {
          ctx.fillStyle = "#353063";
        } else if (this.matrix[i][j] === this.SOLUTION) {
          ctx.fillStyle = "#6f67ff";
        } else if (this.matrix[i][j] === this.WALL) {
          ctx.fillStyle = "#16142a";
        }
        // else if (this.matrix[i][j] === this.VISITED) {
        //   ctx.fillStyle = "#f3bc4e";
        // }
        ctx.fillRect(
          i * this.renderScale,
          j * this.renderScale,
          this.renderScale,
          this.renderScale
        );
      }
    }
  },
};

function getRandom(array) {
  // assume array has something in it
  return array[Math.floor(Math.random() * array.length)];
}
