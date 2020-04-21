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

  this.randomInt = function(min, max) {
    return min + Math.floor((max - min) * Math.random());
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