import { collisionBetweenCircleAndCircle, collisionBetweenCircleAndLine } from "./collision";
import Line from "./line";

export default class Circle {

    /**
     * X position of the circle
     */
    public x: number

    /**
     * Y position of the circle
     */
    public y: number

    /**
     * Radius of the circle
     */
    public radius: number

    /**
     * Constructor of the circle
     * @param x The x position of the circle
     * @param y The y position of the circle
     * @param radius The radius of the circle
     */
    constructor(x: number, y: number, radius: number) {
        this.x = x
        this.y = y
        this.radius = radius
    }

    collide(other: Line | Circle): boolean {
        if (other instanceof Line)
            return collisionBetweenCircleAndLine(this, other);
        if (other instanceof Circle)
            return collisionBetweenCircleAndCircle(this, other);
        return false;
    }

}