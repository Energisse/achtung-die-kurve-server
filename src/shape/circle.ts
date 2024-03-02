import { collisionBetweenCircleAndCircle, collisionBetweenCircleAndLine } from "./collision";
import Dot from "./dot";
import Line from "./line";

export default class Circle extends Dot {

    /**
     * Radius of the circle
     */
    public radius: number

    /**
     * Constructor of the circle
     * @param center The center of the circle
     * @param radius The radius of the circle
     */
    constructor(center: Dot, radius: number) {
        super(center.x, center.y)
        this.radius = radius
    }

    /**
     * Check if the circle is colliding with another shape
     * @param other The other shape
     * @returns True if the circle is colliding with the other shape, false otherwise
     */
    public collide(other: Line | Circle): boolean {
        if (other instanceof Line)
            return collisionBetweenCircleAndLine(this, other);
        if (other instanceof Circle)
            return collisionBetweenCircleAndCircle(this, other);
        return false;
    }

    /**
     * Get the center of the circle
     * @returns The center of the circle
     */
    public getCenter(): Dot {
        return new Dot(this.x, this.y);
    }

    /**
     * Set the center of the circle
     * @param x 
     * @param y 
     */
    public setCenter(x: number, y: number): void;
    /**
     * Set the center of the circle
     * @param center 
     */
    public setCenter(center: Dot): void;
    public setCenter(xOrCenter: number | Dot, y: number = 0) {
        if (xOrCenter instanceof Dot) {
            this.x = xOrCenter.x;
            this.y = xOrCenter.y;
        } else {
            this.x = xOrCenter;
            this.y = y;
        }
    }
}