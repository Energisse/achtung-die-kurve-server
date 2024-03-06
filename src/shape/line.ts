import Circle from "./circle";
import { collisionBetweenCircleAndLine } from "./collision";
import Dot from "./dot";
import Shape from "./shape";

export default class Line extends Shape {

    /**
     * First point of the line
     */
    public p1: Dot;

    /**
     * Second point of the line
     */
    public p2: Dot;

    /**
     * Width of the line
     */
    public width: number;

    /**
     * Constructor of the line
     * @param p1 The first point of the line
     * @param p2 The second point of the line
     * @param width The width of the line
     */
    constructor(p1: Dot, p2: Dot, width: number) {
        super();
        this.p1 = p1;
        this.p2 = p2;
        this.width = width;
    }


    collide(other: Circle | Line): boolean {
        if (other instanceof Circle)
            return collisionBetweenCircleAndLine(other, this);
        return false;
    }

}