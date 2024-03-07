import Circle from "./circle";
import { circleIntersectsOrOutsideRectangle, collisionBetweenCircleAndRectangle, collisionBetweenRectangleAndLine } from "./collision";
import Dot from "./dot";
import Line from "./line";
import Shape from "./shape";

export default class Rectangle extends Shape {

    public width: number;
    public height: number;
    public positon: Dot;

    /**
     * Constructor of the rectangle
     * @param x The x position of the rectangle
     * @param y The y position of the rectangle
     * @param width The width of the rectangle
     * @param height The height of the rectangle
     * @returns A new instance of the rectangle
     */
    constructor(x: number, y: number, width: number, height: number);
    /**
     * Constructor of the rectangle
     * @param position The position of the rectangle
     * @param width The width of the rectangle
     * @param height The height of the rectangle
     * @returns A new instance of the rectangle
     */
    constructor(position: Dot, width: number, height: number);
    constructor(xOrPosition: number | Dot, yOrWidth: number, width: number, height: number = 0) {
        super();
        if (xOrPosition instanceof Dot) {
            this.positon = xOrPosition;
            this.width = yOrWidth;
            this.height = width;
        }
        else {
            this.positon = new Dot(xOrPosition, yOrWidth);
            this.width = width;
            this.height = height;
        }
    }

    getCenter(): Dot {
        return new Dot(this.positon.x + this.width / 2, this.positon.y + this.height / 2);
    }

    /**
     * Check if the rectangle is colliding with another shape
     * @param other The shape to check
     * @returns True if the rectangle is colliding with the other shape, false otherwise
     */
    collide(other: Shape): boolean {
        if (other instanceof Circle)
            return collisionBetweenCircleAndRectangle(other, this);
        if (other instanceof Rectangle)
            return this.positon.x < other.positon.x + other.width &&
                this.positon.x + this.width > other.positon.x &&
                this.positon.y < other.positon.y + other.height &&
                this.positon.y + this.height > other.positon.y;
        if (other instanceof Dot)
            return other.x >= this.positon.x && other.x <= this.positon.x + this.width &&
                other.y >= this.positon.y && other.y <= this.positon.y + this.height;
        if (other instanceof Line) {
            return collisionBetweenRectangleAndLine(this, other);
        }
        return false;
    }

    /**
     * Check if the rectangle is intersecting or out of bound with another shape
     * @param shape The shape to check
     * @returns True if the rectangle is intersecting or out of bound with the other shape, false otherwise
     */
    isIntersectingOrOutOfBound(shape: Circle): boolean {
        return circleIntersectsOrOutsideRectangle(shape, this);
    }

    get x() {
        return this.positon.x;
    }

    get y() {
        return this.positon.y;
    }
}