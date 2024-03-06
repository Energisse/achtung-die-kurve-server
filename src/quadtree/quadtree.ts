import PowerUp from "../powerUp/powerUp";
import PlayerTail from "../shape/playerTail";
import Rectangle from "../shape/rectangle";
import Shape from "../shape/shape";
import QuadTreeNode from "./quadtreeNode";

export default class QuadTree extends QuadTreeNode {

    private newShape: Array<Shape> = [];

    private removedShapes: Array<Shape> = [];

    constructor(bounds: Rectangle, maxObjects = 25, maxLevels = 5, level = 0) {
        super(bounds, maxObjects, maxLevels, level);
    }

    insert(rect: Shape): boolean {
        this.newShape.push(rect);
        return super.insert(rect);
    }

    remove(rect: Shape): boolean {
        const result = super.remove(rect);
        this.removedShapes.push(rect);
        if (result) this.newShape = this.newShape.filter(shape => shape !== rect);
        return result;
    }

    query(shape: Shape): Shape[] {
        const result = super.query(shape);
        //order result by type of object 
        //1 - PowerUp
        //2 - Tail
        //3 - Player
        result.sort((a, b) => {
            if (a instanceof PowerUp && b instanceof PowerUp) {
                return 0;
            } else if (a instanceof PowerUp) {
                return -1;
            } else if (b instanceof PowerUp) {
                return 1;
            }

            if (a instanceof PlayerTail && b instanceof PlayerTail) {
                return 0;
            } else if (a instanceof PlayerTail) {
                return -1;
            } else if (b instanceof PlayerTail) {
                return 1;
            }


            return 0;
        })

        return result;
    }

    getNewShapes(): Array<Shape> {
        const result = this.newShape;
        this.newShape = [];
        return result;
    }

    getRemovedShapes(): Array<Shape> {
        const result = this.removedShapes;
        this.removedShapes = [];
        return result;
    }
}