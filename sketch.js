function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  // var d = dist(a.i, a.j, b.i, b.j);
  var d = sqrt(pow(a.i-b.i, 2) + pow(a.j-b.j, 2));
  return d;
}

function allowedNeighbor(current, neighbor) {
  if (neighbor.obstcale) {
    return false;
  }

  i = current.i;
  j = current.j;

  if (i > 0 && j > 0) {
    if (neighbor.i == current.i - 1 && neighbor.j == current.j - 1) {
      if (grid[i - 1][j].obstcale && grid[i][j - 1]) {
        return false;
      }
    }
  }
  if (i < cols - 1 && j < rows - 1) {
    if (neighbor.i == current.i + 1 && neighbor.j == current.j + 1) {
      if (grid[i + 1][j].obstcale && grid[i][j + 1]) {
        return false;
      }
    }
  }
  if (i < cols - 1 && j > 0) {
    if (neighbor.i == current.i + 1 && neighbor.j == current.j - 1) {
      if (grid[i + 1][j].obstcale && grid[i][j - 1]) {
        return false;
      }
    }
  }
  if (i > 0 && j < rows - 1) {
    if (neighbor.i == current.i - 1 && neighbor.j == current.j + 1) {
      if (grid[i - 1][j].obstcale && grid[i][j + 1]) {
        return false;
      }
    }
  }

  return true;
}

var cols = 40;
var rows = 40;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var startNode;
var endNode;
var w, h;
var path = [];

function Node(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.obstcale = false;

  if (random(1) < 0.3) {
    this.obstcale = true;
  }

  this.show = function (color) {
    fill(color);
    if (this.obstcale) {
      fill(0);
    }
    noStroke();
    rect(this.i * w, this.j * h, w - 1, h - 1);
  }

  this.addNeighbors = function (grid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
  }
}

function setup() {
  createCanvas(400, 400);
  console.log('A*');

  w = width / cols;
  h = height / rows;

  // Making a 2D Array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = new Node(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  startNode = grid[0][0];
  endNode = grid[cols - 1][rows - 1];
  startNode.obstcale = false;
  endNode.obstcale = false;

  openSet.push(startNode);


}

function draw() {

  if (openSet.length > 0) {

    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    var current = openSet[winner];

    if (current === endNode) {
      noLoop();
      console.log('DONE!');
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;

    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (closedSet.includes(neighbor) || !allowedNeighbor(current, neighbor)) {
        continue;
      }

      var tempG = current.g + 1;

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tempG >= neighbor.g) {
        continue;
      }
      neighbor.previous = current;
      neighbor.g = tempG;
      neighbor.h = heuristic(neighbor, endNode);
      neighbor.f = neighbor.g + neighbor.h;
    }

  } else {
    console.log('No Solution!');
    noLoop();
    return;
  }

  background(0);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  // Find the path
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  // noFill();
  // stroke(255);
  // beginShape();
  for (var i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
    // vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
  // endShape();
}