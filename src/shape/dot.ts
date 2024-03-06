import Circle from "./circle";
import { collisionBetweenCircleAndDot } from "./collision";
import Shape from "./shape";

export default class Dot extends Shape {

    public x: number;
    public y: number;

    /**
     * Constructor of the dot
     * @param x The x position of the dot
     * @param y The y position of the dot
    */
    constructor(x: number, y: number) {
        super();
        this.y = y;
        this.x = x;
    }

    public collide(other: Shape): boolean {
        if (other instanceof Circle)
            return collisionBetweenCircleAndDot(other, this);
        if (other instanceof Dot)
            return this.x === other.x && this.y === other.y;

        return false;
    }
}