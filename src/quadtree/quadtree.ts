import Player from "../player";
import PowerUp from "../powerUp/powerUp";
import Circle from "../shape/circle";
import PlayerTail from "../shape/playerTail";
import Rectangle from "../shape/rectangle";
import Shape from "../shape/shape";
import QuadTreeNode from "./quadtreeNode";

export default class QuadTree extends QuadTreeNode {

    private newShape: Array<Shape> = [];

    private removedShapes: Array<Shape> = [];

    /**
     * If the player can teleport when he is out of the bounds
     */
    public teleporter: number = 0;

    /**
     * Constructor of the QuadTree
     * @param width width of the QuadTree
     * @param height height of the QuadTree
     * @param maxObjects maximum number of objects in a node before it splits
     * @param maxLevels maximum number of levels the QuadTree can have
     */
    constructor(width: number, height: number, maxObjects: number = 25, maxLevels: number = 5) {
        super(new Rectangle(0, 0, width, height), maxObjects, maxLevels, 0);
    }

    /**
     * Insert a rectangle in the QuadTree
     * @param rect The rectangle to insert
     * @returns True if the rectangle has been inserted, false otherwise
     */
    insert(rect: Shape): boolean {
        this.newShape.push(rect);
        return super.insert(rect);
    }

    /**
     * Remove a rectangle from the QuadTree
     * @param rect The rectangle to remove
     * @returns True if the rectangle has been removed, false otherwise
     */
    remove(rect: Shape): boolean {
        const result = super.remove(rect);
        this.removedShapes.push(rect);
        if (result) this.newShape = this.newShape.filter(shape => shape !== rect);
        return result;
    }

    /**
     * Query the QuadTree to get all the rectangles that could collide with the given shape
     * @param shape The shape to check
     * @returns An array of rectangles that could collide with the given shape
     */
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

    /**
     * Get the new shapes that have been inserted in the QuadTree and reset the new shapes
     * @returns An array of new shapes
     */
    getNewShapes(): Array<Shape> {
        const result = this.newShape;
        this.newShape = [];
        return result;
    }

    /**
     * Get the removed shapes that have been removed from the QuadTree and reset the removed shapes
     * @returns An array of removed shapes
     */
    getRemovedShapes(): Array<Shape> {
        const result = this.removedShapes;
        this.removedShapes = [];
        return result;
    }

    isOutOfBound(player: Player) {
        return this.bounds.isIntersectingOrOutOfBound(player)
    }

    get width() {
        return this.bounds.width;
    }

    get height() {
        return this.bounds.height;
    }
}