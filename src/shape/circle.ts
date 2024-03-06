import { collisionBetweenCircleAndCircle, collisionBetweenCircleAndLine } from "./collision";
import Dot from "./dot";
import Line from "./line";
import Shape from "./shape";
export default class Circle extends Shape {

    /**
     * Radius of the circle
     */
    public radius: number

    /**
     * Center of the circle
     */
    public center: Dot

    /**
     * Constructor of the circle
     * @param center The center of the circle
     * @param radius The radius of the circle
     * @returns A new instance of the circle
     */
    constructor(center: Dot, radius: number) {
        super();
        this.center = center;
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
        return new Dot(this.center.x, this.center.y);
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
            this.center = xOrCenter;
        } else {
            this.center = new Dot(xOrCenter, y);
        }
    }

    get x() {
        return this.center.x;
    }

    get y() {
        return this.center.y;
    }

    set x(value: number) {
        this.center.x = value;
    }

    set y(value: number) {
        this.center.y = value;
    }
}