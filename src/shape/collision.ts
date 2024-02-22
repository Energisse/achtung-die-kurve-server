import Circle from "./circle";
import Dot from "./dot";
import Line from "./line";

export const collisionBetweenCircleAndCircle = (circle1: Circle, circle2: Circle) => {
    return Math.sqrt((circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2) < circle1.radius + circle2.radius
}

/**
 * @deprecated not using width 
 */
export const collisionBetweenLineAndLine = ({ p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } }: Line, { p1: { x: x3, y: y3 }, p2: { x: x4, y: y4 } }: Line) => {
    const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
    if (det === 0) return false;
    const lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det;
    const gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
}

export const collisionBetweenCircleAndLine = (circle: Circle, { p1, p2, width: lineWidth }: Line) => {

    const rectCenterX = (p1.x + p2.x) / 2;
    const rectCenterY = (p1.y + p2.y) / 2;

    const width = getDistance(p1, p2);
    const height = lineWidth;

    const rectX = rectCenterX - width / 2;
    const rectY = rectCenterY - height / 2;

    const rotation = getLineAngle(p1, p2);

    const rectReferenceX = rectX;
    const rectReferenceY = rectY;

    // Rotate circle's center point back
    const unrotatedCircleX = Math.cos(rotation) * (circle.x - rectCenterX) - Math.sin(rotation) * (circle.y - rectCenterY) + rectCenterX;
    const unrotatedCircleY = Math.sin(rotation) * (circle.x - rectCenterX) + Math.cos(rotation) * (circle.y - rectCenterY) + rectCenterY;

    // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
    let closestX, closestY;

    // Find the unrotated closest x point from center of unrotated circle
    if (unrotatedCircleX < rectReferenceX) {
        closestX = rectReferenceX;
    } else if (unrotatedCircleX > rectReferenceX + width) {
        closestX = rectReferenceX + width;
    } else {
        closestX = unrotatedCircleX;
    }

    // Find the unrotated closest y point from center of unrotated circle
    if (unrotatedCircleY < rectReferenceY) {
        closestY = rectReferenceY;
    } else if (unrotatedCircleY > rectReferenceY + height) {
        closestY = rectReferenceY + height;
    } else {
        closestY = unrotatedCircleY;
    }

    // Determine collision
    let collision = false;
    const distance = getDistance(new Dot(unrotatedCircleX, unrotatedCircleY), new Dot(closestX, closestY));

    if (distance < circle.radius) {
        collision = true;
    }
    else {
        collision = false;
    }

    return collision;
}

function getDistance({ x: x1, y: y1 }: Dot, { x: x2, y: y2 }: Dot) {
    const dX = Math.abs(x1 - x2);
    const dY = Math.abs(y1 - y2);

    return Math.sqrt((dX * dX) + (dY * dY));
}


function getLineAngle({ x: x1, y: y1 }: Dot, { x: x2, y: y2 }: Dot) {
    // Calculate the difference in coordinates
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;

    // Use arctangent to get the angle in radians
    let angleRad = Math.atan2(deltaY, deltaX);

    // Ensure the angle is between 0 and 2*pi (full circle)
    if (angleRad < 0) {
        angleRad += 2 * Math.PI;
    }

    return angleRad;
}
