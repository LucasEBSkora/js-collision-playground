import Ball from "./ball.js";
import Vector from "./vector.js";
export default class Simulator {
  constructor(doc) {

    this.document = doc;
    
    this.radius = 25;
    
    this.balls = new Array();

    this.selectedBall = null;
    
    let rect = doc.getBoundingClientRect();
    this.pos = new Vector(rect.x, rect.y);
    
    this.bounds = new Vector(doc.clientWidth, doc.clientHeight);
    this.document.addEventListener("mousedown", this.mouseDownListener);
    this.document.addEventListener("mouseup", this.mouseUpEventListener);

    document.querySelector("#botaoLimpar").addEventListener("click", () => {
      this.balls.forEach((b) => {b.destroy()});
      this.balls.splice(0, this.balls.length);
    } );

  }

  setSelectedBall = (ball) => {
    this.selectedBall = ball;
  }

  mouseDownListener = (event) => {
    if (event.buttons == 1 && 
        document.querySelector('input[name="criar/destruir"]:checked').value == "criar" &&
        this.checkSpace(event.clientX, event.clientY)
      ) {
      this.selectedBall = new Ball(event.clientX - this.pos.x, event.clientY - this.pos.y, this.radius, this.document, this);
      this.balls.push(this.selectedBall);
    }
  }

  mouseUpEventListener = (event) => {
    if (event.buttons == 0) {
      if (this.selectedBall != null) {
        
        this.selectedBall.impulse(event.clientX, event.clientY);
        this.selectedBall.deselect();
        this.selectedBall = null;        

      }
    }
  }

  checkSpace(x, y) {
    let v = new Vector(x, y);

    for (let i in this.balls) {
      if (v.minus(this.balls[i].pos).module() <= this.radius + this.balls[i].radius) 
        return false;

    }
    return true;

  }

  run() {
    
    setInterval(function() {
      if (this.balls.length > 0) {
        
        this.balls = this.balls.filter((b) => !b.setToDestroy);

        let stack = [...this.balls];

        while (stack.length > 0) {

          let currentBall = stack.pop();
          this.processWalls(currentBall);
          
          stack.forEach(function(ball, i, arr) {
            this.processCollision(currentBall, arr, i);
          }.bind(this));
          
          currentBall.update();
        }
      }
    }.bind(this), 10);

  }

  processCollision(currentBall, arr, i) {
    
    let ball = arr[i];

    let dr = currentBall.pos.minus(ball.pos);
    
    if (dr.module() <= currentBall.radius + ball.radius) {
      
      let projv1 = currentBall.vel.projection(dr);
      let perpv1 = currentBall.vel.minus(projv1);

      let projv2 = ball.vel.projection(dr);
      let perpv2 = ball.vel.minus(projv2);
      
      let overlap = dr.versor().product(dr.module() - currentBall.radius - ball.radius).product(0.5);
      
      if (currentBall.selected) {
        ball.vel = projv2.minus(perpv2);
        ball.pos.add(overlap);

      } else if (ball.selected) {
        currentBall.vel = projv1.minus(perpv1);
        currentBall.pos.minus(overlap);

      } else {

        currentBall.vel = perpv1.plus(projv2);
        ball.vel = perpv2.plus(projv1);

        ball.pos.add(overlap);
        currentBall.pos.subtract(overlap);
      }
      

      arr[i] = ball;
    }

  }

  processWalls(ball) {
    if (ball.pos.x - ball.radius <= 0 ) {
      ball.vel.x *= -1;
      ball.pos.x = ball.radius;
    } else if (ball.pos.x + ball.radius >= this.bounds.x) {
      ball.vel.x *= -1;
      ball.pos.x = this.bounds.x - ball.radius;
    } 
    
    if (ball.pos.y - ball.radius <= 0 ) {
      ball.vel.y *= -1;
      ball.pos.y = ball.radius;
    } else if (ball.pos.y + ball.radius >= this.bounds.y) {
      ball.vel.y *= -1;
      ball.pos.y = this.bounds.y - ball.radius;
    }
  }
}