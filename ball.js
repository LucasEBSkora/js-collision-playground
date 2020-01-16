import vector from "./vector.js";
import Vector from "./vector.js";

var nextId = 0;

export default class Ball {
  constructor(x, y, r, doc, parent) {
  
    this.pos = new Vector(x, y);
    
    this.parent = parent;

    //this.vel = new Vector((Math.random() - 0.5)* 5, (Math.random() - 0.5)* 5);
    this.vel = new Vector(0,0);

    this.radius = r;
    
    this.selected = true;

    this.setToDestroy = false;

    this.id = nextId++;
  
    this.me = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  
    this.me.setAttribute("id", `ball${this.id}`);
    this.me.setAttribute("cx", this.pos.x);
    this.me.setAttribute("cy", this.pos.y);
    this.me.setAttribute("r", this.radius);
    
    this.me.addEventListener("mousedown", this.mouseDownEventListener);

    console.log(this.me);
    doc.appendChild(this.me);
  };
  
  impulse = (x, y) => {
    let mouse = new Vector(x, y);

    let dv = this.pos.minus(mouse);

    if (dv.module() >= this.radius) 
      this.vel = dv.versor().product(dv.module() - this.radius).product(0.075);
  
  }

  deselect = () => {
    this.selected = false;
  }
  
  mouseDownEventListener = (event) => {
  
    if (event.buttons == 1) {
      if (document.querySelector('input[name="criar/destruir"]:checked').value == "destruir") 
        this.destroy();
      else {
        this.selected = true;
        this.parent.setSelectedBall(this);
        this.vel.toZero();
      }

    }
  }



   destroy = () => {
    this.me.parentNode.removeChild(this.me);
    this.destroy = true;
  
  }

  update = () => {
    if (!this.selected) {
      this.pos.add(this.vel);
      this.me.setAttribute("cx", this.pos.x);
      this.me.setAttribute("cy", this.pos.y);
    } else {
      this.vel.toZero();
    }

  }
};