import Circle from "./circle";
import Line from "./line";

export const collisionBetweenCircleAndCircle = (circle1: Circle, circle2: Circle) => {
    return Math.sqrt((circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2) < circle1.radius + circle2.radius
}

export const collisionBetweenLineAndLine = ({ p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } }: Line, { p1: { x: x3, y: y3 }, p2: { x: x4, y: y4 } }: Line) => {
    const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
    if (det === 0) return false;
    const lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det;
    const gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
}

export const collisionBetweenCircleAndLine = (circle: Circle, line: Line) => {
    var dist;
    const v1x = line.p2.x - line.p1.x;
    const v1y = line.p2.y - line.p1.y;
    const v2x = circle.x - line.p1.x;
    const v2y = circle.y - line.p1.y;
    // get the unit distance along the line of the closest point to
    // circle center
    const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);


    // if the point is on the line segment get the distance squared
    // from that point to the circle center
    if (u >= 0 && u <= 1) {
        dist = (line.p1.x + v1x * u - circle.x) ** 2 + (line.p1.y + v1y * u - circle.y) ** 2;
    } else {
        // if closest point not on the line segment
        // use the unit distance to determine which end is closest
        // and get dist square to circle
        dist = u < 0 ?
            (line.p1.x - circle.x) ** 2 + (line.p1.y - circle.y) ** 2 :
            (line.p2.x - circle.x) ** 2 + (line.p2.y - circle.y) ** 2;
    }
    return dist < circle.radius * circle.radius;
}
