import Circle from "./circle";
import { collisionBetweenCircleAndLine } from "./collision";
import Dot from "./dot";

export default class Line {

    public p1: Dot;

    public p2: Dot;

    public width: number = 3;

    constructor(p1: Dot, p2: Dot, width: number = 3) {
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