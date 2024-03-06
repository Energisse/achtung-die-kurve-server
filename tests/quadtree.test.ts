import QuadTree from "../src/quadtree/quadtree";
import Dot from "../src/shape/dot";
import Rectangle from "../src/shape/rectangle";

describe("QuadTree", () => {
    let quadTree: QuadTree;

    beforeEach(() => {
        const bounds = new Rectangle(0, 0, 100, 100);
        quadTree = new QuadTree(bounds);
    });

    afterEach(() => {
        quadTree.clear();
    });

    test("Inserting and querying a shape", () => {
        const shape = new Dot(10, 10);

        quadTree.insert(shape);

        const result = quadTree.query(shape);

        expect(quadTree.objects).toContain(shape);
        expect(quadTree.nodes).toHaveLength(0);
        expect(quadTree.objects).toHaveLength(1);
        expect(result).toContain(shape);
    });

    test("Inserting a shape outside of the bounds", () => {
        const shape = new Dot(10, 10);

        const bounds = new Rectangle(200, 200, 100, 100);
        const quadTree = new QuadTree(bounds);

        const result = quadTree.insert(shape);

        expect(result).toBe(false);
        expect(quadTree.nodes).toHaveLength(0);
        expect(quadTree.objects).toHaveLength(0);
    });

    test("Inserting more shapes than the maxObjects limit", () => {
        const maxObjects = 2;
        const bounds = new Rectangle(0, 0, 100, 100);
        const quadTree = new QuadTree(bounds, maxObjects);

        const shape1 = new Dot(10, 10);
        const shape2 = new Dot(20, 20);
        const shape3 = new Dot(30, 30);

        quadTree.insert(shape1);
        quadTree.insert(shape2);
        const result = quadTree.insert(shape3);

        expect(result).toBe(true);
        expect(quadTree.nodes).toHaveLength(4);
        expect(quadTree.objects).toHaveLength(0);
    });

    test("Inserting shapes until reaching the maxLevels limit", () => {
        const maxLevels = 2;
        const bounds = new Rectangle(0, 0, 100, 100);
        const quadTree = new QuadTree(bounds, 10, maxLevels);

        const shape = new Dot(10, 10);

        for (let i = 0; i < maxLevels + 1; i++) {
            quadTree.insert(shape);
        }

        const result = quadTree.query(shape);

        expect(result).toContain(shape);
        expect(quadTree.nodes).toHaveLength(0);
    });

    test("Clearing the quadtree", () => {
        const shape = new Dot(10, 10);

        quadTree.insert(shape);
        quadTree.clear();

        const result = quadTree.query(shape);

        expect(result).toHaveLength(0);
    });

});