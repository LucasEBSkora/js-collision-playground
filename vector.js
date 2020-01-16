export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };
  plus = (operator) => new Vector(this.x + operator.x, this.y + operator.y);
  
  add = (operator) => {
    this.x += operator.x;
    this.y += operator.y;
  }

  minus = (operator) => new Vector(this.x - operator.x, this.y - operator.y);
  
  subtract = (operator) => {
    this.x -= operator.x;
    this.y -= operator.y;
  }

  product = (operator) => {
    if (operator instanceof Vector) {

      return (this.x*operator.x + this.y* operator.y);
    } else if (typeof operator == 'number' ) return new Vector(this.x * operator, this.y * operator);
    else return null;
  };

  module = () => Math.sqrt(this.x*this.x + this.y*this.y);
  
  versor = () => this.product(1.0/this.module());

  projection = (operator) => {
    if (!(operator instanceof Vector)) return null; 
    else return operator.product(this.product(operator)/ Math.pow(operator.module(), 2));
  }

  toZero = () => {this.x = 0; this.y = 0};

}