function AlgorithmVisualiser(app_root_id) {
  this.appRoot = null;
  this.canvas = null;
  this.menuBar = null;
  this.mappedPoints = null;

  this.algorithmPicker = null;
  this.isAlgorithmPickerActive = false;
  this.currentAlgorithm = "Bubble Sort";

  this.startBtn = null;
  this.resetBtn = null;
  this.clearBtn = null;

  this.gridRows = 20;
  this.gridColumns = 50;
  // this.dijkstraStart = 0;
  // this.dijkstraEnd = 460;
  // this.dijkstraStart = 458;
  // this.dijkstraEnd = 445;
  this.dijkstraStart = 950;
  this.dijkstraEnd = 391;
  this.isCellMsDown = false;
  this.grid = null;
  this.adjacencyList = null;


  this.randomInt = function(min, max) {
    return min + Math.floor((max - min) * Math.random());
  };


  this.dijkstraShortestPath = function() {
    const totalCells = this.gridRows * this.gridColumns;
    let q = []; // queue
    let visited = new Array(totalCells);
    /*
      distances = [
        [previous cell id, distance]
        ...
      ]
      where distances[0] -> distance from cell of id 0 to initial cell
    */
    let distances = new Array(totalCells);
    for (let i = 0; i < totalCells; i++) {
      let distTmp = new Array(2);
      distTmp[0] = this.dijkstraStart; // previous cell
      distTmp[1] = Number.POSITIVE_INFINITY; // distance
      distances[i] = distTmp;
      visited[i] = false;
    }
    distances[this.dijkstraStart] = new Array(this.dijkstraStart, 0);
    
    let current = this.dijkstraStart;
    q.push(current);
    let count = 0;
    do {
      // console.log("current: " + current);
      // console.log(q);
      this.adjacencyList[current].forEach(neighbor => {
        // console.log(neighbor[0]);
        if ( (visited[neighbor[0]] === false) && !q.includes(neighbor[0]) ) {
          // console.log("enqueueing: " + neighbor[0]);
          q.push(neighbor[0]); // enqueue each neighbor's id
          if (distances[neighbor[0]][1] > distances[current][1] + neighbor[1]) {
            distances[neighbor[0]][1] = distances[current][1] + neighbor[1];
            distances[neighbor[0]][0] = current;
          }
        } else {
          // console.log("already visited: " + neighbor[0]);
        }
      });
      // console.log("count = " + count);


      visited[current] = true;
      this.grid[current].style.backgroundColor = "#ffd61f";
      
      q.shift();
      if (q.length > 0) {
        current = q[0];
      } else {
        // console.log("queue is empty");
        break;
      }
      count++;
      if (count === 1000000) {
        // console.log("reached count limit");
        break;
      }
    } while ( (current != this.dijkstraEnd) && (q.length != 0) );

    console.log(distances);
    let previous = distances[this.dijkstraEnd][0];
    let i = 0;
    while (previous != this.dijkstraStart) {
      console.log("prev: " + previous);
      // setTimeout(function() {
        this.grid[previous].style.backgroundColor = "#2222ff";
      // }.bind(this), 100 + i);
      previous = distances[previous][0];
      i += 10;
    }
    this.grid[previous].style.backgroundColor = "#2222ff";
  };

  this.cellGetNeighbors = function(cellId) {
    let neighbors = [];
    const currentRow = Math.floor(cellId / this.gridColumns);
    const rightRow = Math.floor((cellId + 1) / this.gridColumns);
    const leftRow = Math.floor((cellId - 1) / this.gridColumns);
    const gridLen = this.gridRows * this.gridColumns;
    // neighbor above
    if ( (cellId - this.gridColumns) > 0 ) {
      neighbors.push(cellId - this.gridColumns);
    }
    // to the right
    if ( (cellId + 1 < gridLen) && currentRow === rightRow ) {
      neighbors.push(cellId + 1);
    }
    // below
    if ( (cellId + this.gridColumns) < gridLen ) {
      neighbors.push(cellId + this.gridColumns);
    }
    // to the left
    if ( (cellId - 1 >= 0) && currentRow === leftRow ) {
      neighbors.push(cellId - 1);
    }

    return neighbors;
  };

  // display all neighbors for a given cell in the grid
  this.gridShowNeighbors = function(cellId, color_hex = "2222ff") {
    let neighbors = [];
    const currentRow = Math.floor(cellId / this.gridColumns);
    // row of the right cell
    const rightRow = Math.floor((cellId + 1) / this.gridColumns);
    // row of the left cell
    const leftRow = Math.floor((cellId - 1) / this.gridColumns);
    const gridLen = this.gridRows * this.gridColumns;
    // neighbor above
    if ( (cellId - this.gridColumns) > 0 ) {
      neighbors.push(cellId - this.gridColumns);
    } else {
      neighbors.push(false);
    }
    // to the right
    if ( (cellId + 1 < gridLen) && currentRow === rightRow ) {
      neighbors.push(cellId + 1);
    } else {
      neighbors.push(false);
    }
    // below
    if ( (cellId + this.gridColumns) < gridLen ) {
      neighbors.push(cellId + this.gridColumns);
    } else {
      neighbors.push(false);
    }
    // to the left
    if ( (cellId - 1 >= 0) && currentRow === leftRow ) {
      neighbors.push(cellId - 1);
    } else {
      neighbors.push(false);
    }

    neighbors.forEach(neighbor => {
      if (neighbor !== false) {
        if (color_hex === "transparent") {
          this.grid[neighbor].style.backgroundColor = color_hex;
          this.grid[cellId].style.backgroundColor = color_hex;
        } else {
          this.grid[neighbor].style.backgroundColor = "#" + color_hex;
          this.grid[cellId].style.backgroundColor = "#fff";
        } 
      }
    });
  };

  this.cellMsDown = function(ev) {
    if (ev.target.getAttribute("cell-id") == this.dijkstraStart) {
      ev.target.classList.add("grabbing");
      this.isCellMsDown = true;
    }

    this.gridShowNeighbors(Number(ev.target.getAttribute("cell-id")));
  };

  this.cellMsUp = function(ev) {
    if (ev.target.getAttribute("cell-id") == this.dijkstraStart) {
      ev.target.classList.remove("grabbing");
      this.isCellMsDown = false;
    }

    this.gridShowNeighbors(Number(ev.target.getAttribute("cell-id")), "transparent");
  };

  this.generateGrid = function(rows, columns) {
    // 1. create a div container
    // and initialize the adjacency list
    const grid = document.createElement("div");
    grid.classList.add("grid-container");

    const fragment = document.createDocumentFragment();

    this.adjacencyList = new Array(rows*columns);

    // 2. create 'div' cells
    // each cell will be assigned an id in the range: <0 ; rows*columns)
    for (let i = 0; i < rows * columns; i++) {
      let cell = document.createElement("div");
      cell.classList.add("grid-cell");
      if (i === this.dijkstraStart) {
        cell.classList.add("start");
      }
      if (i === this.dijkstraEnd) {
        cell.classList.add("end");
      }
      cell.setAttribute("cell-id", i);
      cell.addEventListener("mousedown", this.cellMsDown.bind(this));
      cell.addEventListener("mouseup", this.cellMsUp.bind(this));
      fragment.appendChild(cell);

      // contains distances from the current cell to all its neighbors
      let distanceArray = [];
      if (this.cellGetNeighbors(i)) {
        this.cellGetNeighbors(i).forEach(neighbor => {
          let tmp = [];
          tmp.push(neighbor); // cell id
          tmp.push(1); // distance = 1
          distanceArray.push(tmp);
        });
      }
      this.adjacencyList[i] = distanceArray;
    }

    grid.appendChild(fragment);
    this.canvas.appendChild(grid);
    this.grid = grid.children; // list of nodes

    // this.gridShowNeighbors(450);
    // console.log(this.adjacencyList);
  };

  this.generateRandom = function(n, r) {
    if (this.canvas.children.length !== 0) {
      // for (childNode of this.canvas.children) {
      //   this.canvas.removeChild(childNode);
      // }
      this.canvas.innerHTML = '';
    }

    this.mappedPoints = new Array(this.canvas.clientWidth - r*2);
    // console.log(this.mappedPoints.length);
  
    if (n > this.mappedPoints.length) {
      for (let i = 0; i < this.mappedPoints.length; i++) {
        let y = this.randomInt(0, this.canvas.clientHeight - r * 2);
        let dataPoint = document.createElement("div");
        dataPoint.classList.add("data-point");
        dataPoint.style.width = (r * 2) + "px";
        dataPoint.style.height = (r * 2) + "px";
        dataPoint.style.top = y + "px";
        dataPoint.style.left = i + "px";
        this.canvas.appendChild(dataPoint);
        this.mappedPoints[i] = dataPoint;
      }
    } else {
      while (n > 0) {
        let x = this.randomInt(0, this.canvas.clientWidth - r * 2);
        if (typeof this.mappedPoints[x] === "undefined") {
          let y = this.randomInt(0, this.canvas.clientHeight - r * 2);
          let dataPoint = document.createElement("div");
          dataPoint.classList.add("data-point");
          dataPoint.style.width = (r * 2) + "px";
          dataPoint.style.height = (r * 2) + "px";
          dataPoint.style.top = y + "px";
          dataPoint.style.left = x + "px";
          this.canvas.appendChild(dataPoint);
          this.mappedPoints[x] = dataPoint;
          n--;
        }
      }
    }
  }; // /generateRandom()

  // each point: (x, y), where the value 'y' is stored at index 'x'
  this.swapPoints = function(a, b) {
    let tmp = a.style.top;
    a.style.top = b.style.top;
    b.style.top = tmp;
  };

  this.bubbleSort = function() {
    for (let i = 0; i < this.mappedPoints.length; i++) {
      for (let j = i + 1; j < this.mappedPoints.length; j++) {
        if ((typeof this.mappedPoints[i] !== "undefined") && (typeof this.mappedPoints[j] !== "undefined")) {
          setTimeout(() => {
            if (this.mappedPoints[i].offsetTop < this.mappedPoints[j].offsetTop) {
              // delay(15);
              this.swapPoints(this.mappedPoints[i], this.mappedPoints[j]);
            } else {
              this.mappedPoints[i].style.backgroundColor = "blue";
            }
          }, 2 + j * 2);
        }
      }
    }
  };

  this.elementPicked = function(ev) {
    // children[0] === <h5>
    this.algorithmPicker.children[0].textContent = ev.target.textContent;
    this.currentAlgorithm = ev.target.textContent;
    switch (this.currentAlgorithm) {
      case "Bubble Sort":
        this.clearCanvas();
        break;
      case "Dijkstra's Shortest Path":
        this.clearCanvas();
        this.generateGrid(this.gridRows, this.gridColumns);
        break;
    }
  };

  this.algoPickerDropdown = function(ev) {
    switch (ev.type) {
      case "click":
        if (this.isAlgorithmPickerActive) {
          this.algorithmPicker.children[1].classList.remove("active");
          this.isAlgorithmPickerActive = false;
        } else {
          this.algorithmPicker.children[1].classList.add("active");
          this.isAlgorithmPickerActive = true;
        }
      case "mouseover":
        // this.algorithmPicker.children[1].classList.add("active");
        break;
      case "mouseout":
        // this.algorithmPicker.children[1].classList.remove("active");
        break;
      
      default:
        console.log("default event");
    }
  };


  this.clearCanvas = function() {
    // for (item of this.canvas.children) {
    //   this.canvas.removeChild(item);
    // }
    this.canvas.innerHTML = '';
  };

  this.randomizeDatapoints = function() {
    switch (this.currentAlgorithm) {
      case "Bubble Sort":
        this.generateRandom(300, 3);
        break;
    }
    
  };

  this.startAlgorithm = function() {
    switch (this.currentAlgorithm) {
      case "Bubble Sort":
        this.bubbleSort();
        break;
      case "Dijkstra's Shortest Path":
        this.dijkstraShortestPath();
        break;
    }

    
  };

  this.init = function() {
    this.appRoot = document.getElementById(app_root_id);
    if (this.appRoot === null) {
      throw "Root element does not exist.";
    }

    // let menuFragment = document.createDocumentFragment();
    // let canvasFragment = document.createDocumentFragment();

    this.canvas = this.appRoot.children[1];
    // console.log(this.canvas);

    this.algorithmPicker = document.getElementById("algorithm-picker");
    this.algorithmPicker.addEventListener("mouseover", this.algoPickerDropdown.bind(this));
    this.algorithmPicker.addEventListener("mouseout", this.algoPickerDropdown.bind(this));
    this.algorithmPicker.addEventListener("click", this.algoPickerDropdown.bind(this));

    const listElements = this.algorithmPicker.children[1].children;
    for (elem of listElements) {
      elem.addEventListener("click", this.elementPicked.bind(this));
    }
    

    this.startBtn = document.getElementById("start-btn");
    this.resetBtn = document.getElementById("reset-btn");
    this.clearBtn = document.getElementById("clear-btn");

    this.startBtn.addEventListener("click", this.startAlgorithm.bind(this));
    this.resetBtn.addEventListener("click", this.randomizeDatapoints.bind(this));
    this.clearBtn.addEventListener("click", this.clearCanvas.bind(this));
    

  };
};


const av = new AlgorithmVisualiser("app-root");
av.init();
// av.generateRandom(300, 3);
// av.bubbleSort();