import Circle from "./circle";
import Dot from "./dot";

export default class Rectangle {

    public width:number;
    public height:number;
    public positon : Dot;

    constructor(position:Dot, width:number, height:number){ 
        this.width = width;
        this.height = height;
        this.positon = position;
    }

    /**
     * Check if the circle is colliding with the rectangle
     * @param circle The circle
     * @returns True if the circle is colliding with the rectangle, false otherwise
     */
    outside(circle:Circle):boolean{
        return circle.x - circle.radius < this.positon.x || circle.x + circle.radius > this.positon.x + this.width || circle.y - circle.radius < this.positon.y || circle.y + circle.radius > this.positon.y + this.height
    }
}