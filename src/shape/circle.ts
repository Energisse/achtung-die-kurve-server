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

    public collide(other: Line | Circle): boolean {
        if (other instanceof Line)
            return collisionBetweenCircleAndLine(this, other);
        if (other instanceof Circle)
            return collisionBetweenCircleAndCircle(this, other);
        return false;
    }
}