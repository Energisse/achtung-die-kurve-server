import * as collisionDetector from "../../src/shape/collision"
import Dot from "../../src/shape/dot"
import Circle from "../../src/shape/circle"
import Line from "../../src/shape/line"
import Rectangle from "../../src/shape/rectangle"

describe("Line/line collisions", () => {
    test("Simple non collision", () => {
        const line1 = new Line(new Dot(0, 0), new Dot(0, 10), 1)
        const line2 = new Line(new Dot(10, 0), new Dot(10, 10), 1)
        const collided = collisionDetector.collisionBetweenLineAndLine(line1, line2);
        expect(collided).toBe(false);
    })

    test("Simple collision", () => {
        const line1 = new Line(new Dot(0, 0), new Dot(10, 10), 1)
        const line2 = new Line(new Dot(10, 0), new Dot(0, 10), 1)
        const collided = collisionDetector.collisionBetweenLineAndLine(line1, line2);
        expect(collided).toBe(true);
    })

    test("Right next to each other", () => {
        const line1 = new Line(new Dot(0, 0), new Dot(0, 10), 1)
        const line2 = new Line(new Dot(1, 0), new Dot(1, 10), 1)
        const collided = collisionDetector.collisionBetweenLineAndLine(line1, line2);
        expect(collided).toBe(false);
    })
})

describe("Circle/circle collisions", () => {
    test("Simple non collision", () => {
        const circle1 = new Circle(new Dot(0, 0), 0.2)
        const circle2 = new Circle(new Dot(10, 10), 0.2)
        const collided = collisionDetector.collisionBetweenCircleAndCircle(circle1, circle2);
        expect(collided).toBe(false);
    })

    test("Simple collision", () => {
        const circle1 = new Circle(new Dot(0, 0), 1)
        const circle2 = new Circle(new Dot(1, 1), 1)
        const collided = collisionDetector.collisionBetweenCircleAndCircle(circle1, circle2);
        expect(collided).toBe(true);
    })

    test("Circle contains other", () => {
        const circle1 = new Circle(new Dot(0, 0), 1)
        const circle2 = new Circle(new Dot(0.1, 0.1), 0.1)
        const collided = collisionDetector.collisionBetweenCircleAndCircle(circle1, circle2);
        expect(collided).toBe(true);
    })
})

describe("Circle/line collision", () => {
    test("Simple non collision", () => {
        const circle = new Circle(new Dot(0, 0), 0.5)
        const line = new Line(new Dot(10, 10), new Dot(10, 0), 3)
        const collided = collisionDetector.collisionBetweenCircleAndLine(circle, line)
        expect(collided).toBe(false);
    })

    test("Simple collision", () => {
        const circle = new Circle(new Dot(0, 0), 1)
        const line = new Line(new Dot(0, 0), new Dot(1, 0), 3)
        const collided = collisionDetector.collisionBetweenCircleAndLine(circle, line)
        expect(collided).toBe(true);
    })

    test("Collision because of width", () => {
        const circle = new Circle(new Dot(0, 0), 1)
        const line = new Line(new Dot(2, 2), new Dot(2, 0), 3)
        const collided = collisionDetector.collisionBetweenCircleAndLine(circle, line)
        expect(collided).toBe(true);
    })

    test("Circle inside line", () => {
        const circle = new Circle(new Dot(0, 0), 0.5)
        const line = new Line(new Dot(0, 0), new Dot(1, 0), 3)
        const collided = collisionDetector.collisionBetweenCircleAndLine(circle, line)
        expect(collided).toBe(true);
    })

    test("Circle inside line horizontal", () => {
        const circle = new Circle(new Dot(0, 0), 0.5)
        const line = new Line(new Dot(0, 2), new Dot(3, 2), 10)
        const collided = collisionDetector.collisionBetweenCircleAndLine(circle, line)
        expect(collided).toBe(true);
    })

    test("Circle inside line vertical", () => {
        const circle = new Circle(new Dot(0, 0), 0.5)
        const line = new Line(new Dot(2, -2), new Dot(2, 2), 10)
        const collided = collisionDetector.collisionBetweenCircleAndLine(circle, line)
        expect(collided).toBe(true);
    })

    test("Circle inside line diagonal", () => {
        const circle = new Circle(new Dot(0, 0), 0.5)
        const line = new Line(new Dot(1, 0), new Dot(2, 2), 10)
        const collided = collisionDetector.collisionBetweenCircleAndLine(circle, line)
        expect(collided).toBe(true);
    })
})


describe("Rectangle/line collisions", () => {
    test("Border collision", () => {
        const rect = new Rectangle(0, 0, 10, 10);
        const line = new Line(new Dot(0, 10.5), new Dot(10, 10.5), 1);
        const collided = collisionDetector.collisionBetweenRectangleAndLine(rect, line);
        expect(collided).toBe(true);
    })

    test("Simple collision", () => {
        const rect = new Rectangle(0, 0, 10, 10);
        const line = new Line(new Dot(5, 5), new Dot(15, 15), 1);
        const collided = collisionDetector.collisionBetweenRectangleAndLine(rect, line);
        expect(collided).toBe(true);
    })

    test("Line inside rectangle", () => {
        const rect = new Rectangle(0, 0, 10, 10);
        const line = new Line(new Dot(2, 2), new Dot(8, 8), 1);
        const collided = collisionDetector.collisionBetweenRectangleAndLine(rect, line);
        expect(collided).toBe(true);
    })

    test("Rectangle inside line", () => {
        const rect = new Rectangle(2, 2, 6, 6);
        const line = new Line(new Dot(0, 0), new Dot(10, 10), 20);
        const collided = collisionDetector.collisionBetweenRectangleAndLine(rect, line);
        expect(collided).toBe(true);
    })

    test("Rectangle inside line 2", () => {
        const rect = new Rectangle(2, 2, 6, 6);
        const line = new Line(new Dot(0, -2), new Dot(8, 6), 20);
        const collided = collisionDetector.collisionBetweenRectangleAndLine(rect, line);
        expect(collided).toBe(true);
    })

    test("Rectangle and line overlap", () => {
        const rect = new Rectangle(0, 0, 10, 10);
        const line = new Line(new Dot(5, 0), new Dot(5, 10), 1);
        const collided = collisionDetector.collisionBetweenRectangleAndLine(rect, line);
        expect(collided).toBe(true);
    })

    test("Rectangle and line do not overlap", () => {
        const rect = new Rectangle(0, 0, 10, 10);
        const line = new Line(new Dot(15, 0), new Dot(15, 10), 1);
        const collided = collisionDetector.collisionBetweenRectangleAndLine(rect, line);
        expect(collided).toBe(false);
    })
})
