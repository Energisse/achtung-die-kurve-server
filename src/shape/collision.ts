import Dot from "./dot";
import Circle from "./circle";
import Line from "./line";
import Rectangle from "./rectangle";

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

export const circleIntersectsOrOutsideRectangle = (circle: Circle, { positon: { x: rectX, y: rectY }, width: rectWidth, height: rectHeight }: { positon: Dot, width: number, height: number }) => {
    return circle.x + circle.radius < rectX || circle.x - circle.radius > rectX + rectWidth || circle.y + circle.radius < rectY || circle.y - circle.radius > rectY + rectHeight;
}

export const collisionBetweenCircleAndRectangle = (circle: Circle, { positon: { x: rectX, y: rectY }, width: rectWidth, height: rectHeight }: { positon: Dot, width: number, height: number }) => {
    let testX = circle.x;
    let testY = circle.y;

    if (circle.x < rectX) testX = rectX;
    else if (circle.x > rectX + rectWidth) testX = rectX + rectWidth;

    if (circle.y < rectY) testY = rectY;
    else if (circle.y > rectY + rectHeight) testY = rectY + rectHeight;

    const distX = circle.x - testX;
    const distY = circle.y - testY;
    const distance = Math.sqrt((distX * distX) + (distY * distY));

    return distance <= circle.radius;
}

//TODO: memoize line to rectangle collision
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

export function collisionBetweenRectangleAndLine(rect1: Rectangle, { p1, p2, width: lineWidth }: Line) {

    //line is the center of the rectangle
    const rotation = getLineAngle(p1, p2) + Math.PI / 2; // 90 degrees to get parallel line

    const corners = [
        new Dot(p1.x + Math.cos(rotation) * lineWidth / 2, p1.y + Math.sin(rotation) * lineWidth / 2),
        new Dot(p1.x - Math.cos(rotation) * lineWidth / 2, p1.y - Math.sin(rotation) * lineWidth / 2),
        new Dot(p2.x + Math.cos(rotation) * lineWidth / 2, p2.y + Math.sin(rotation) * lineWidth / 2),
        new Dot(p2.x - Math.cos(rotation) * lineWidth / 2, p2.y - Math.sin(rotation) * lineWidth / 2),
    ]

    if (corners.some(corner => collisionBetweenRectangleAndDot(rect1, corner))) return true

    const unrotatedRect = new Rectangle(corners[0], getDistance(p1, p2), lineWidth)

    const rectCenterX = rect1.positon.x + rect1.width / 2;
    const rectCenterY = rect1.positon.y + rect1.height / 2;
    //rotate rect1 with rotation and get corners 
    const rotatedCorners = [
        new Dot(rect1.positon.x, rect1.positon.y),
        new Dot(rect1.positon.x + rect1.width, rect1.positon.y),
        new Dot(rect1.positon.x, rect1.positon.y + rect1.height),
        new Dot(rect1.positon.x + rect1.width, rect1.positon.y + rect1.height),
    ].map(corner => {
        const rotatedX = Math.cos(rotation) * (corner.x - rectCenterX) - Math.sin(rotation) * (corner.y - rectCenterY) + rectCenterX;
        const rotatedY = Math.sin(rotation) * (corner.x - rectCenterX) + Math.cos(rotation) * (corner.y - rectCenterY) + rectCenterY;
        return new Dot(rotatedX, rotatedY);
    })


    if (rotatedCorners.some(corner => collisionBetweenRectangleAndDot(unrotatedRect, corner))) return true

    const bordersLine = [
        new Line(corners[0], corners[1], 0),
        new Line(corners[2], corners[3], 0),
        new Line(corners[0], corners[2], 0),
        new Line(corners[1], corners[3], 0),
    ]

    const bordersRectangle = [
        new Line(rect1.positon, new Dot(rect1.positon.x + rect1.width, rect1.positon.y), 0),
        new Line(rect1.positon, new Dot(rect1.positon.x, rect1.positon.y + rect1.height), 0),
        new Line(new Dot(rect1.positon.x + rect1.width, rect1.positon.y), new Dot(rect1.positon.x + rect1.width, rect1.positon.y + rect1.height), 0),
        new Line(new Dot(rect1.positon.x, rect1.positon.y + rect1.height), new Dot(rect1.positon.x + rect1.width, rect1.positon.y + rect1.height), 0),
    ]

    return bordersLine.some(border => bordersRectangle.some(rectBorder => collisionBetweenLineAndLine(border, rectBorder)))
}

export function collisionBetweenRectangleAndDot(rectangle: Rectangle, dot: Dot) {
    return dot.x >= rectangle.positon.x && dot.x <= rectangle.positon.x + rectangle.width &&
        dot.y >= rectangle.positon.y && dot.y <= rectangle.positon.y + rectangle.height;
}

function collisionBetweenRectangleAndRectangle(rectangle1: { positon: Dot, width: number, height: number }, rectangle2: { positon: Dot, width: number, height: number }) {
    const { positon: { x: rect1X, y: rect1Y }, width: rect1Width, height: rect1Height } = rectangle1;
    const { positon: { x: rect2X, y: rect2Y }, width: rect2Width, height: rect2Height } = rectangle2;

    return rect1X < rect2X + rect2Width &&
        rect1X + rect1Width > rect2X &&
        rect1Y < rect2Y + rect2Height &&
        rect1Y + rect1Height > rect2Y;
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


export function collisionBetweenCircleAndDot(circle: Circle, dot: Dot) {
    return Math.sqrt((circle.x - dot.x) ** 2 + (circle.y - dot.y) ** 2) < circle.radius;
}