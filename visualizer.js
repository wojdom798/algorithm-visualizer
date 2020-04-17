function AlgorithmVisualiser(app_root_id) {
  this.appRoot = null;
  this.canvas = null;
  this.menuBar = null;
  this.mappedPoints = null;

  this.init = function() {
    this.appRoot = document.getElementById(app_root_id);
    if (this.appRoot === null) {
      throw "Root element does not exist.";
    }

    // let menuFragment = document.createDocumentFragment();
    // let canvasFragment = document.createDocumentFragment();

    this.canvas = this.appRoot.children[1];
    // console.log(this.canvas);
    

  };

  this.randomInt = function(min, max) {
    return min + Math.floor((max - min) * Math.random());
  };

  this.generateRandom = function(n, r) {
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
    // console.log("bubble sort done.");
  };
};


const av = new AlgorithmVisualiser("app-root");
av.init();
av.generateRandom(300, 3);
av.bubbleSort();