//Source1: https://easings.net/#easeInOutCubic
//Using this function to make the easing effect.
//Source2: https://editor.p5js.org/leon-eckert/sketches/Ra3Xzl8D6
//Using this function to adjust chasing speed.

let oneCell = [];
let oneFood = [];
let amount;
let redColor;
let line1 = 32;
let line2 = 87;
let line3 = 142;
let line4 = 197;
let row1 = 52;
let newCell = true;
let scissor = false;
let food = false;
let drag = false;
let display = false;
let y = 0
let x = 0
let acc = 0
let hue = 0
let light = 0

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight);
  noCursor()
  background(0)
  textFont("Trebuchet MS");
  amount = prompt(
    "How many Cells do you want to start with? \n\nUser Instructions:\nThese cells will die if you don't feed them frequently.\nThey will divide themselves after they have enough food.\nYou can click the \"New Cell\" & \"Food\" button to generate cells or food at a random position. \nYou can also click the point on the canvas to generate them at the position you want."
  );
  for (i = 0; i < amount; i++) {
    let c = new Cell(random(width), random(height), random(50, 100));
    oneCell.push(c);
  }
}
function draw() {
  hue = map(mouseX, 0, width, 190, 210)
  light = map(mouseY, 0, height, 10, -10)
  colorBackground(hue, light); //HSL hue
  for (i = 0; i < oneCell.length; i++) {
    oneCell[i].shake();

    if (oneCell[i].searchFood() == true && oneCell[i].count < 5400) {
      oneCell[i].findFood();
      oneCell[i].chaseTarget();
      oneCell[i].eatFood();
    } else {
      oneCell[i].backHome();
      oneCell[i].chaseTarget();
    }
    if (oneCell[i].count < 6001 && oneCell[i].count > 6000) {
      oneCell[i].divide();
    }
    oneCell[i].drag();
    oneCell[i].speak();
    oneCell[i].die();
    oneCell[i].display();
    oneCell[i].lifetime();
  }

  for (j = 0; j < oneFood.length; j++) {
    oneFood[j].display();
    oneFood[j].update();
  }

  //UI
  noStroke();
  rectMode(CORNER);
  strokeWeight(1);

  fill(220);
  rect(2, 2, 225, 60, 60);

  if (
    dist(mouseX, mouseY, line1, row1 - 20) < 25 ||
    dist(mouseX, mouseY, line2, row1 - 20) < 25 ||
    dist(mouseX, mouseY, line3, row1 - 20) < 25 ||
    dist(mouseX, mouseY, line4, row1 - 20) < 25
  ) {
    display = false;
  } else {
    display = true;
  }

  //newCell
  if (newCell == true) {
    stroke(0);

    push();
    translate(mouseX - 30, mouseY - 30);
    fill(200);
    noStroke();
    circle(line1, row1 - 20, 40);
    stroke(255);
    fill(255);
    circle(line1, row1 - 20, 15);
    pop();
    if (display == true) {
      fill(255);
      text("New Cell", 88, 80);
    }
  } else {
    noStroke();
  }
  fill(255);
  circle(line1, row1 - 20, 50);
  fill(200);
  noStroke();
  circle(line1, row1 - 20, 40);
  stroke(0);
  fill(0);
  circle(line1, row1 - 20, 15);

  if (dist(mouseX, mouseY, line1, row1 - 20) < 25) {
    display = false;
    fill(0);
    circle(line1, row1 - 20, 50);
    fill(200);
    noStroke();
    circle(line1, row1 - 20, 40);
    stroke(255);
    fill(255);
    circle(line1, row1 - 20, 15);
    stroke(0);
    text("New Cell", 88, 80);
  }

  //scissors
  push();
  if (scissor == true) {
    stroke(0);
    push();
    translate(mouseX - 78, mouseY - 12);
    stroke(255);
    strokeWeight(2);
    fill(0, 0);
    line(line2 - 8, row1 - 40, line2 + 8, row1);
    arc(line2 + 4, row1 - 10, 22, 22, PI * 1.38, PI * 2.38);
    line(line2 + 8, row1 - 40, line2 - 8, row1);
    arc(line2 - 4, row1 - 10, 22, 22, PI * 0.65, PI * 1.65);
    pop();
    if (display == true) {
      fill(255);
      text("Divide", 95, 80);
    }
  } else {
    noStroke();
  }
  fill(255);
  circle(line2, row1 - 20, 50);
  stroke(0);
  strokeWeight(2);
  fill(0, 0);
  line(line2 - 8, row1 - 40, line2 + 8, row1);
  arc(line2 + 4, row1 - 10, 22, 22, PI * 1.38, PI * 2.38);
  line(line2 + 8, row1 - 40, line2 - 8, row1);
  arc(line2 - 4, row1 - 10, 22, 22, PI * 0.65, PI * 1.65);
  pop();

  if (dist(mouseX, mouseY, line2, row1 - 20) < 25) {
    fill(0);
    circle(line2, row1 - 20, 50);
    stroke(255);
    strokeWeight(2);
    fill(0, 0);
    line(line2 - 8, row1 - 40, line2 + 8, row1);
    arc(line2 + 4, row1 - 10, 22, 22, PI * 1.38, PI * 2.38);
    line(line2 + 8, row1 - 40, line2 - 8, row1);
    arc(line2 - 4, row1 - 10, 22, 22, PI * 0.65, PI * 1.65);
    fill(255);
    stroke(0);
    strokeWeight(1);
    text("Divide", 95, 80);
  }

  //food
  if (food == true) {
    stroke(0);
    push();
    translate(mouseX - 30, mouseY - 30);
    translate(line1 - 8, row1 - 35);
    scale(0.6);
    stroke(255);
    fill(0, 0);
    strokeWeight(3.33);
    beginShape();
    curveVertex(0, -10);
    curveVertex(0, -10);
    curveVertex(2, 2);
    curveVertex(10, 20);
    curveVertex(20, 30);
    curveVertex(28, 48);
    curveVertex(30, 60);
    curveVertex(30, 60);
    endShape();
    beginShape();
    curveVertex(30, -10);
    curveVertex(30, -10);
    curveVertex(28, 2);
    curveVertex(20, 20);
    curveVertex(10, 30);
    curveVertex(2, 48);
    curveVertex(0, 60);
    curveVertex(0, 60);
    endShape();
    line(0, -5, 30, -5);
    line(3, 5, 27, 5);
    line(9, 15, 21, 15);
    line(9, 35, 21, 35);
    line(3, 45, 27, 45);
    line(0, 55, 30, 55);
    pop();
    if (display == true) {
      fill(255);
      text("Food", 99, 80);
    }
  } else {
    noStroke();
  }
  fill(255);
  circle(line3, row1 - 20, 50);
  push();
  translate(line3 - 8, row1 - 35);
  scale(0.6);
  stroke(0);
  fill(0, 0);
  strokeWeight(3.33);
  beginShape();
  curveVertex(0, -10);
  curveVertex(0, -10);
  curveVertex(2, 2);
  curveVertex(10, 20);
  curveVertex(20, 30);
  curveVertex(28, 48);
  curveVertex(30, 60);
  curveVertex(30, 60);
  endShape();
  beginShape();
  curveVertex(30, -10);
  curveVertex(30, -10);
  curveVertex(28, 2);
  curveVertex(20, 20);
  curveVertex(10, 30);
  curveVertex(2, 48);
  curveVertex(0, 60);
  curveVertex(0, 60);
  endShape();
  line(0, -5, 30, -5);
  line(3, 5, 27, 5);
  line(9, 15, 21, 15);
  line(9, 35, 21, 35);
  line(3, 45, 27, 45);
  line(0, 55, 30, 55);
  pop();

  if (dist(mouseX, mouseY, line3, row1 - 20) < 25) {
    fill(0);
    circle(line3, row1 - 20, 50);
    push();
    translate(line3 - 8, row1 - 35);
    scale(0.6);
    stroke(255);
    fill(0, 0);
    strokeWeight(3.33);
    beginShape();
    curveVertex(0, -10);
    curveVertex(0, -10);
    curveVertex(2, 2);
    curveVertex(10, 20);
    curveVertex(20, 30);
    curveVertex(28, 48);
    curveVertex(30, 60);
    curveVertex(30, 60);
    endShape();
    beginShape();
    curveVertex(30, -10);
    curveVertex(30, -10);
    curveVertex(28, 2);
    curveVertex(20, 20);
    curveVertex(10, 30);
    curveVertex(2, 48);
    curveVertex(0, 60);
    curveVertex(0, 60);
    endShape();
    line(0, -5, 30, -5);
    line(3, 5, 27, 5);
    line(9, 15, 21, 15);
    line(9, 35, 21, 35);
    line(3, 45, 27, 45);
    line(0, 55, 30, 55);
    pop();
    fill(255);
    stroke(0);
    text("Food", 99, 80);
  }

  //drag
  push();
  if (drag == true) {
    stroke(0);
    push();
    translate(mouseX - 195, mouseY - 30);
    stroke(255);
    strokeWeight(2);
    line(line4, row1, line4, row1 - 40);
    line(line4 - 20, row1 - 20, line4 + 20, row1 - 20);
    line(line4, row1, line4 - 7, row1 - 7);
    line(line4, row1, line4 + 7, row1 - 7);
    line(line4, row1 - 40, line4 + 7, row1 - 33);
    line(line4, row1 - 40, line4 - 7, row1 - 33);
    line(line4 - 20, row1 - 20, line4 - 13, row1 - 13);
    line(line4 - 20, row1 - 20, line4 - 13, row1 - 27);
    line(line4 + 20, row1 - 20, line4 + 13, row1 - 13);
    line(line4 + 20, row1 - 20, line4 + 13, row1 - 27);
    pop();
    if (display == true) {
      fill(255);
      text("Move", 99, 80);
    }
  } else {
    noStroke();
  }
  fill(255);
  circle(line4, row1 - 20, 50);
  push();
  stroke(0);
  strokeWeight(2);
  fill(0, 0);
  line(line4, row1, line4, row1 - 40);
  line(line4 - 20, row1 - 20, line4 + 20, row1 - 20);
  line(line4, row1, line4 - 7, row1 - 7);
  line(line4, row1, line4 + 7, row1 - 7);
  line(line4, row1 - 40, line4 + 7, row1 - 33);
  line(line4, row1 - 40, line4 - 7, row1 - 33);
  line(line4 - 20, row1 - 20, line4 - 13, row1 - 13);
  line(line4 - 20, row1 - 20, line4 - 13, row1 - 27);
  line(line4 + 20, row1 - 20, line4 + 13, row1 - 13);
  line(line4 + 20, row1 - 20, line4 + 13, row1 - 27);
  pop();

  if (dist(mouseX, mouseY, line4, row1 - 20) < 25) {
    fill(0);
    circle(line4, row1 - 20, 50);
    push();
    stroke(255);
    strokeWeight(2);
    line(line4, row1, line4, row1 - 40);
    line(line4 - 20, row1 - 20, line4 + 20, row1 - 20);
    line(line4, row1, line4 - 7, row1 - 7);
    line(line4, row1, line4 + 7, row1 - 7);
    line(line4, row1 - 40, line4 + 7, row1 - 33);
    line(line4, row1 - 40, line4 - 7, row1 - 33);
    line(line4 - 20, row1 - 20, line4 - 13, row1 - 13);
    line(line4 - 20, row1 - 20, line4 - 13, row1 - 27);
    line(line4 + 20, row1 - 20, line4 + 13, row1 - 13);
    line(line4 + 20, row1 - 20, line4 + 13, row1 - 27);
    pop();
    fill(255);
    stroke(0);
    text("Move", 99, 80);
  }

  push();
  textSize(20);
  stroke(0);
  fill(255);
  text("Number of Cells", 240, 22);
  textSize(40);
  text(oneCell.length, 240, 60);
  pop();
}

function mousePressed() {
  if (newCell == true && dist(mouseX, mouseY, line1, row1 - 20) < 25) {
    let c = new Cell(random(width), random(height), random(50, 100));
    oneCell.push(c);
  }
  if (food == true && dist(mouseX, mouseY, line3, row1 - 20) < 25) {
    let f = new Food(random(width) - 20, random(height) - 30, random(0.3, 1));
    oneFood.push(f);
  }
  if (mouseX < 225 && mouseY < 60) {
    if (dist(mouseX, mouseY, line1, row1 - 20) < 25) {
      newCell = true;
      scissor = false;
      food = false;
      drag = false;
    } else if (dist(mouseX, mouseY, line2, row1 - 20) < 25) {
      scissor = true;
      newCell = false;
      food = false;
      drag = false;
    } else if (dist(mouseX, mouseY, line3, row1 - 20) < 25) {
      scissor = false;
      newCell = false;
      food = true;
      drag = false;
    } else if (dist(mouseX, mouseY, line4, row1 - 20) < 25) {
      scissor = false;
      newCell = false;
      food = false;
      drag = true;
    }
  } else {
    if (newCell == true) {
      let c = new Cell(mouseX, mouseY, random(50, 100));
      oneCell.push(c);
    } else if (scissor == true) {
      for (i = 0; i < oneCell.length; i++) {
        oneCell[i].divideCheck(mouseX, mouseY);
      }
    } else if (food == true) {
      let f = new Food(mouseX - 4, mouseY - 10, random(0.3, 1));
      oneFood.push(f);
    }
  }
}

function colorBackground(H, L) {
  push();
  colorMode(HSL);
  for (let i = 0; i < width * 2; i++) {
    let light = map(i, 0, width * 2, 100, 0);
    stroke(H, 50, light + L);
    line(i, 0, 0, i);
  }
  pop();
}

//Source: https://easings.net/#easeInOutCubic
function ease(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}

function accelerate(distance) {
  let y = x
  if (x < 1) {
    x += 1 / distance
  }
  acc = (ease(x) - ease(y)) * 300
  return acc
}

class Cell {
  constructor(xPosition, yPosition, diameter) {
    this.diameter = diameter;
    this.originPosition = createVector(xPosition, yPosition);
    this.position = createVector(xPosition, yPosition);
    this.sinY = random(PI * 2);
    this.sinX = random(PI * 2);
    this.tSpeed = random(1, 5);
    this.count = random(1000, 2000); //lifetime
    this.tX = 0;
    this.tY = 0;
    this.time = this.count / 60;
    this.redColor = 200;
    this.greenColor = random(190, 210);
    this.blueColor = 200;
    this.shouldDivide = false;
    this.live = true;
    this.distance = [];
    this.foodNumber = 0;
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.speed = 0;
    this.maxSpeed = random(3, 8);
    this.eat = 0;
    this.speakDie = false;
    this.speakFull = false;
    this.speakCheck = 0;
    this.transparency = random(100, 200);
    this.coreT = this.transparency
    this.foodDistance = undefined
  }

  speak() {
    if (this.speakCheck > 120) {
      if (this.count > 5400) {
        this.speakFull = true;
        this.speakCheck = 0;
      } else if (this.count <= 300) {
        this.speakDie = true;
        this.speakCheck = 0;
      } else if (this.count <= 900) {
        this.speakHungry = true;
        this.speakCheck = 0;
      }
    }

    this.speakCheck++;
    if (this.speakFull == true) {
      console.log("I'm Full.");
      this.speakFull = false;
    } else if (this.speakDie == true) {
      console.log("I'm gonna Dieeeeee!");
      this.speakDie = false;
    } else if (this.speakHungry == true) {
      console.log("I'm Hungry!");
      this.speakHungry = false;
    }
  }

  shake() {
    this.tX = sin(this.sinX) * this.tSpeed * this.tSpeed;
    this.tY = sin(this.sinY) * this.tSpeed * this.tSpeed;
    this.sinX += random(0.2);
    this.sinY += random(0.2);
  }

  chaseTarget() {
    this.velocity = p5.Vector.sub(this.targetPosition, this.position);
    this.velocity.normalize();
    this.acceleration = this.velocity;
    let distance = this.position.dist(this.targetPosition);
    this.speed = map(distance, 0, width + height, this.maxSpeed, 0);
    this.acceleration.mult(this.speed * 0.5);
    this.velocity.add(this.acceleration);
    this.velocity.limit(distance);
    this.position.add(this.velocity);
  }

  die() {
    if (this.transparency * 2 > this.count) {
      this.transparency -= 2;
    }
    // else{
    //   this.transparency = this.coreT
    // }
  }

  display() {
    push();
    translate(this.tX, this.tY);

    //cell
    noStroke();

    this.redColor = map(this.count, 0, 3600, 255, 0);
    fill(this.redColor, this.greenColor, this.blueColor, this.transparency);
    circle(this.position.x, this.position.y, this.diameter);

    //core
    let coreTransparency = map(this.transparency, this.coreT, 0, 50, 0)
    fill(0, 0, 0, coreTransparency);
    circle(this.position.x, this.position.y, this.diameter / 3);

    pop();

    if (this.count > 5400) {
    }
  }

  lifetime() {
    if (this.time <= 0) {
      oneCell.splice(i, 1);
    }
    this.lastCount = this.count;
    this.count--;
    this.time = this.count / 60;
  }

  divide() {
    console.log("I'm going to Divide!");
    this.divX = random(-this.diameter / 1, this.diameter / 1);
    this.divY = random(-this.diameter / 1, this.diameter / 1);
    let c = new Cell(
      this.position.x - this.divX,
      this.position.y + this.divY,
      this.diameter * 0.8
    );
    oneCell.push(c);
    let d = new Cell(
      this.position.x + this.divX,
      this.position.y - this.divY,
      this.diameter * 0.8
    );
    oneCell.push(d);
    oneCell.splice(i, 1);
  }

  divideCheck(mX, mY) {
    let distanceFromCenter = dist(
      this.tX + this.position.x,
      this.tY + this.position.y,
      mX,
      mY
    );
    if (distanceFromCenter < this.diameter / 2) {
      this.divide();
    }
  }

  searchFood() {
    if (oneFood.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  findFood() {
    for (let j = 0; j < oneFood.length; j++) {
      if (j == 0) {
        this.distance[0] = [
          dist(
            oneFood[j].position.x,
            oneFood[j].position.y,
            this.position.x,
            this.position.y
          ),
          j,
        ];
      } else {
        this.distance[1] = [
          dist(
            oneFood[j].position.x,
            oneFood[j].position.y,
            this.position.x,
            this.position.y
          ),
          j,
        ];
      }
      if (this.distance.length >= 2) {
        if (this.distance[1][0] >= this.distance[0][0]) {
          this.distance.splice(1, 1);
        } else if (this.distance[1][0] < this.distance[0][0]) {
          this.distance.splice(0, 1);
        }
      }
    }
    if (this.distance[0] != undefined) {
      this.foodNumber = this.distance[0][1];
    }

    this.targetPosition = oneFood[this.foodNumber].position;
    this.tX = 0;
    this.tY = 0;
  }

  eatFood() {
    if (
      oneFood.length > 0 &&
      abs(oneFood[this.foodNumber].position.x - this.position.x - this.tX) <
      this.diameter / 3 &&
      abs(oneFood[this.foodNumber].position.y - this.position.y - this.tY) <
      this.diameter / 3
    ) {
      this.eat++;
      this.count += 1800;
      this.diameter += 10;
      oneFood.splice(this.foodNumber, 1);
    }
  }

  drag() {
    if (
      mouseIsPressed == true &&
      drag == true &&
      dist(
        mouseX,
        mouseY,
        this.position.x + this.tX,
        this.position.y + this.tY
      ) <
      this.diameter / 2
    ) {
      this.tX = 0;
      this.tY = 0;
      this.originPosition.x = mouseX;
      this.originPosition.y = mouseY;
      this.position.x = mouseX;
      this.position.y = mouseY;
    }
  }

  backHome() {
    this.targetPosition = this.originPosition;
  }
}

class Food {
  constructor(xPosition, yPosition, scale) {
    this.position = createVector(xPosition, yPosition);
    this.speedY = scale;
    this.scale = scale;
  }
  display() {
    push();
    translate(this.position.x, this.position.y);
    scale(this.scale);
    stroke(255);
    fill(0, 0);
    strokeWeight(3.33);
    beginShape();
    curveVertex(0, -10);
    curveVertex(0, -10);
    curveVertex(2, 2);
    curveVertex(10, 20);
    curveVertex(20, 30);
    curveVertex(28, 48);
    curveVertex(30, 60);
    curveVertex(30, 60);
    endShape();
    beginShape();
    curveVertex(30, -10);
    curveVertex(30, -10);
    curveVertex(28, 2);
    curveVertex(20, 20);
    curveVertex(10, 30);
    curveVertex(2, 48);
    curveVertex(0, 60);
    curveVertex(0, 60);
    endShape();
    line(0, -5, 30, -5);
    line(3, 5, 27, 5);
    line(9, 15, 21, 15);
    line(9, 35, 21, 35);
    line(3, 45, 27, 45);
    line(0, 55, 30, 55);
    pop();
  }

  update() {
    this.position.y += this.speedY;
    this.position.x += cos(this.position.y / 20) / 4;
    if (this.position.y > height) {
      oneFood.splice(j, 1);
    }
  }
  returnPosition() {
    return this.position.x;
  }
}
