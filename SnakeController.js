/*
Erik Kaasila 10-17-2015
This represents the snake and contains all operators to be used with it.
*/

// The dimensions of the grid
var width = 20;
var height = 20;

// Keep track of score
var score = 0;

// The board, or grid, is represented with a 2D (see Jagged) array of integers.
var gameBoard = [];
var nodeBoard = [];
var snake = [];

var thePath = [];
var food = 0;

var theClosed =[];

var currentStep = 1;

var shouldGrow = false;
var growDirection = -1;

// Starts the snake game with the given width and height.
function startGame(width, height) {
  // Clear the array
  gameBoard = [];
  snake = [];
  score = 0;
  // Initilize the gameBoard
  for(var x = 0; x < width; ++x) {
    gameBoard[x] = [];
    nodeBoard[x] = [];
    for (var y = 0; y < height; ++y) {
      gameBoard[x][y] = -1;
      nodeBoard[x][y] = -1;
    }
  }
  // Place the first food
  placeFood();
  // Place the first snake
  placeSnake();

  getBestPath();
}

// Places a food on a random position in the game board
function placeFood() {
  var xPos = Math.floor(Math.random() * width);
  var yPos = Math.floor(Math.random() * height);
  if (!containsEntity(xPos, yPos)) {
    gameBoard[xPos][yPos] = 1;
    food = {x:xPos, y:yPos}
    getBestPath();
  } else {
    placeFood();
  }
}

// Places the initial snake on a random position in the game board
function placeSnake() {
  var xPos = Math.floor(Math.random() * width);
  var yPos = Math.floor(Math.random() * height);
  if (!containsEntity(xPos, yPos)) {
    snake[0] = {x: xPos, y:yPos, direction:1};
    gameBoard[xPos][yPos] = 0;
  }
}

// Returns whether a given x,y coordinate contains the snake
function containsEntity(x, y) {
  return gameBoard[x][y] !== -1;
}

// Moves the snake
function moveSnake() {
  AIMove();
  var newSnake = [];
  for(var i = 0; i < snake.length; ++i) {
    var snakePiece;
    if (i === 0) {
      snakePiece = snake[i];
    } else {
      snakePiece = {x: snake[i].x, y: snake[i].y, direction: snake[i-1].direction};
    }
    switch(snake[i].direction) {
      // Moving UP
      case 1:
        if (snakePiece.y + 1 > height - 1 || (i === 0 && isSpaceTaken(snakePiece.x, snakePiece.y + 1))) {
          startGame(width, height);
          return;
        }
        newSnake[i] = {x: snakePiece.x, y: snakePiece.y + 1, direction: snakePiece.direction};
        break;
      // Moving DOWN
      case 2:
        if (snakePiece.y - 1 < 0 || (i === 0 && isSpaceTaken(snakePiece.x, snakePiece.y - 1))) {
          startGame(width, height);
          return;
        }
        newSnake[i] = {x: snakePiece.x, y: snakePiece.y - 1, direction: snakePiece.direction};
        break;
      // Moving LEFT
      case 3:
        if (snakePiece.x - 1 < 0 || (i === 0 && isSpaceTaken(snakePiece.x - 1, snakePiece.y))) {
          startGame(width, height);
          return;
        }
      console.log("X: " + (snakePiece.x - 1));
        newSnake[i] = {x: snakePiece.x - 1, y: snakePiece.y, direction: snakePiece.direction};
        break;
      // Moving RIGHT
      case 4:
        if (snakePiece.x + 1 > width - 1 || (i === 0 && isSpaceTaken(snakePiece.x + 1, snakePiece.y))) {
          startGame(width, height);
          return;
        }
        console.log("X: " + (snakePiece.x + 1));
        newSnake[i] = {x: snakePiece.x + 1, y: snakePiece.y, direction: snakePiece.direction};
        break;
    }
  }
  if (gameBoard == undefined || snake == undefined || snake[snake.length-1] == undefined) {
    return;
  }
  if (gameBoard[snake[snake.length-1].x] == undefined || gameBoard[snake[snake.length-1].x][snake[snake.length-1].y] == undefined ||
    snake[snake.length-1].x == undefined || snake[snake.length-1].y == undefined) {
      console.log("Error");
      location.reload();
      return;
    }
  gameBoard[snake[snake.length-1].x][snake[snake.length-1].y] = -1;
  snake = newSnake;
  updateGameBoard();
  if (shouldGrow) {
    growSnake();
    shouldGrow = false;
  }
}

function AIMove() {
  if (snake.length > 0) {
    if (thePath[currentStep] != undefined) {
      if (thePath[currentStep].x > snake[0].x) {
        moveRight();
      } else if (thePath[currentStep].x < snake[0].x) {
        moveLeft();
      } else if (thePath[currentStep].y < snake[0].y) {
        moveDown();
      } else if (thePath[currentStep].y > snake[0].y) {
        moveUp();
      } else {
        console.log(thePath[currentStep].x);
      }
      currentStep++;
    } else {
      console.log("Error");
    }
  }
}

// Determines if the given (x, y) coordinate can be moved to
function isSpaceTaken(x, y) {
  return gameBoard[x][y] === 0;
}

// Updates the game board model
function updateGameBoard() {
  //getBestPath();
  for (var i = 0; i < snake.length; ++i) {
    eatFood(snake[i].x, snake[i].y);
    gameBoard[snake[i].x][snake[i].y] = 0;
  }
}


// Eats the food, spawns a new one, and grows the snake
function eatFood(x, y) {
  if (gameBoard[x][y] === 1) {
      gameBoard[x][y] = 0;
      placeFood();
      score += 1;
      shouldGrow = true;
      growDirection = snake[snake.length - 1].direction;
  }
}

// Increases snake length by one
function growSnake() {
  switch(growDirection) {
    // Moving UP
    case 1:
      snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y - 1, direction: growDirection});
      break;
    // Moving DOWN
    case 2:
      snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y + 1, direction: growDirection});
      break;
    // Moving LEFT
    case 3:
      snake.push({x: snake[snake.length - 1].x + 1, y: snake[snake.length - 1].y, direction: growDirection});
      break;
    // Moving RIGHT
    case 4:
      snake.push({x: snake[snake.length - 1].x - 1, y: snake[snake.length - 1].y, direction: growDirection});
      break;
  }
}

// Calculate the Euclidean distance between two points, used for A* heuristic
function getEuclideanDistance(x0, y0, x1, y1) {
  return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
}

function Node(x, y, parent) {
  this.x = x;
  this.y = y;

  if (gameBoard[x][y] != 0) {
    this.walkable = true;
  } else {
    this.walkable = false;
  }

  this.p = parent;
  if (parent == null) {
      this.gcost = 0;
  } else {
    this.gcost = parent.gcost + 1;
  }
  this.hcost = getEuclideanDistance(x, y, food.x, food.y);
  this.fcost = this.gcost + this.hcost;

  this.getNeighbors = function() {
    neighbors = []
    if (this.x > 0 && gameBoard[x-1][y] != 0) {
      if (nodeBoard[this.x - 1][this.y] == -1) {
        neighbors.push(new Node(this.x -1, this.y, this));
        nodeBoard[this.x - 1][this.y] = new Node(this.x -1, this.y, this);
      } else {
        var temp = new Node(this.x - 1, this.y, this);
        if (temp.fcost < nodeBoard[this.x - 1][this.y]) {
          neighbors.push(temp);
          nodeBoard[this.x - 1][this.y] = temp;
        } else {
          neighbors.push(nodeBoard[this.x - 1][this.y]);
        }
      }
    }
    if (this.x < width - 1 && gameBoard[x + 1][y] != 0) {
      if (nodeBoard[this.x + 1][this.y] == -1) {
        neighbors.push(new Node(this.x + 1, this.y, this));
        nodeBoard[this.x + 1][this.y] = new Node(this.x + 1, this.y, this);
      } else {
        var temp = new Node(this.x + 1, this.y, this);
        if (temp.fcost < nodeBoard[this.x + 1][this.y]) {
          neighbors.push(temp);
          nodeBoard[this.x + 1][this.y] = temp;
        } else {
          neighbors.push(nodeBoard[this.x + 1][this.y]);
        }
      }
    }
    if (this.y > 0 && gameBoard[x][y-1] != 0) {
      if (nodeBoard[this.x][this.y - 1] == -1) {
        neighbors.push(new Node(this.x, this.y - 1, this));
        nodeBoard[this.x][this.y - 1] = new Node(this.x, this.y - 1, this);
      } else {
        var temp = new Node(this.x, this.y - 1, this);
        if (temp.fcost < nodeBoard[this.x][this.y - 1]) {
          neighbors.push(temp);
          nodeBoard[this.x][this.y - 1] = temp;
        } else {
          neighbors.push(nodeBoard[this.x][this.y - 1]);
        }
      }
    }
    if (this.y < height - 1 && gameBoard[x][y + 1] != 0) {
      if (nodeBoard[this.x][this.y + 1] == -1) {
        neighbors.push(new Node(this.x, this.y + 1, this));
        nodeBoard[this.x][this.y + 1] = new Node(this.x, this.y + 1, this);
      } else {
        var temp = new Node(this.x, this.y + 1, this);
        if (temp.fcost < nodeBoard[this.x][this.y + 1]) {
          neighbors.push(temp);
          nodeBoard[this.x][this.y + 1] = temp;
        } else {
          neighbors.push(nodeBoard[this.x][this.y + 1]);
        }
      }
    }
    return neighbors;
  }
}

// Calculate the best path from snake head to food
function getBestPath(to) {
  currentStep = 1;
  if (snake.length < 1) {
    return;
  }
  thePath = [];
    var closed = [];
    var open = [];

    // Get the start and end nodes
    var start = new Node(snake[0].x, snake[0].y, null);
    nodeBoard[start.x][start.y] = start;
    var end = new Node(food.x, food.y, null);
    nodeBoard[end.x][end.y] = end;

    // Push the start node to the open set
    open.push(start);
    while (open.length > 0) {
      var removeIndex = -1;
      var currentNode = open[0];
      for (var i = 0; i < open.length; ++i) {
        if (open[i].fcost < currentNode.fcost || open[i].fcost == currentNode.fcost && open[i].hcost < currentNode.hcost) {
          currentNode = open[i];
          removeIndex = i;
        }
      }

      // Remove currentNode from open and add to closed
      open.splice(open.indexOf(currentNode), 1);
      closed.push(currentNode);
      theClosed = closed;

      if (currentNode.x == end.x && currentNode.y == end.y) {
        for(var x = 0; x < width; ++x) {
          nodeBoard[x] = [];
          for (var y = 0; y < height; ++y) {
            nodeBoard[x][y] = -1;
          }
        }
        return tracePath(start, currentNode);
      }

      currentNode.getNeighbors().forEach(function(node) {
        if (node.walkable || neverSeen(node, closed)) {
          var newCost = currentNode.gcost + 1;
          if (newCost < node.gcost || (neverSeen(node, open) && neverSeen(node, closed))) {
            node.gcost = newCost;
            node.p = currentNode;
            if (neverSeen(node, open) && neverSeen(node, closed)) {
              open.push(node);
            }
          }
        }
      });
    }
}
function neverSeen(node, set) {
  for (var i = 0; i < set.length; i++) {
    if (set[i].x == node.x && set[i].y == node.y) {
      return false;
    }
  }
  return true;
}

function tracePath(s, e) {
  var path = []
  var cNode = e;
  path.push(e);

  while (cNode.p != null) {
    path.push(cNode.p);
    cNode = cNode.p;
  }
  thePath = path;
  return path.reverse();
}

function moveLeft() {
  if (snake.length > 1) {
    if (snake[1].x !== snake[0].x - 1) {
      snake[0].direction = 3;
    }
  } else {
    snake[0].direction = 3;
  }
}

function moveDown() {
  if (snake.length > 1) {
    if (snake[1].y !== snake[0].y - 1) {
      snake[0].direction = 2;
    }
  } else {
    snake[0].direction = 2;
  }
}

function moveRight() {
  if (snake.length > 1) {
    if (snake[1].x !== snake[0].x + 1) {
      snake[0].direction = 4;
    }
  } else {
    snake[0].direction = 4;
  }
}

function moveUp() {
  if (snake.length > 1) {
    if (snake[1].y !== snake[0].y + 1) {
      snake[0].direction = 1;
    }
  } else {
    snake[0].direction = 1;
  }
}

function zigZag() {
    
}

// Allow the user to control the snake
document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37:
      moveLeft();
      break;
    case 38:
      moveDown();
      break;
    case 39:
      moveRight();
      break;
    case 40:
      moveUp();
      break;
    }
};
