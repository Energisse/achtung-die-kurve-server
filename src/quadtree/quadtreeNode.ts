import Rectangle from "../shape/rectangle";
import Shape from "../shape/shape";
import QuadTree from "./quadtree";

export enum Quadrant {
    TOP_RIGHT,
    TOP_LEFT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

export default class QuadTreeNode {

    public bounds: Rectangle;
    public maxObjects: number;
    public maxLevels: number;
    public level: number;
    public objects: Shape[];
    public nodes: QuadTreeNode[];

    constructor(bounds: Rectangle, maxObjects: number, maxLevels: number, level: number) {
        this.bounds = bounds;
        this.maxObjects = maxObjects;
        this.maxLevels = maxLevels;
        this.level = level;
        this.objects = [];
        this.nodes = [];
    }

    /**
     * Clears the QuadTreeNode
     */
    clear() {
        this.objects = [];
        this.nodes.forEach(node => node.clear());
        this.nodes = [];
    }

    /**
     * Splits the node into 4 subnodes
     */
    split() {
        const subWidth = this.bounds.width / 2;
        const subHeight = this.bounds.height / 2;
        const x = this.bounds.x;
        const y = this.bounds.y;
        const nextLevel = this.level + 1;
        this.nodes[0] = new QuadTreeNode(new Rectangle(x + subWidth, y, subWidth, subHeight), this.maxObjects, this.maxLevels, nextLevel);
        this.nodes[1] = new QuadTreeNode(new Rectangle(x, y, subWidth, subHeight), this.maxObjects, this.maxLevels, nextLevel);
        this.nodes[2] = new QuadTreeNode(new Rectangle(x, y + subHeight, subWidth, subHeight), this.maxObjects, this.maxLevels, nextLevel);
        this.nodes[3] = new QuadTreeNode(new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight), this.maxObjects, this.maxLevels, nextLevel);

        //Move the objects to the subnodes
        for (let i = 0; i < this.objects.length; i++) {
            this.nodes.some(node => node.insert(this.objects[i]));
        }

        this.objects = [];
    }

    /**
     * Returns all the objects that could collide with the given shape
     * @param rect 
     */
    query(shape: Shape): Shape[] {
        const result: Shape[] = [];

        //Check in the subnodes 
        if (this.nodes.length > 0) {
            return this.nodes.flatMap(node => node.query(shape));
        }

        //Check if the shape is in the bounds of the quadtree
        if (this.bounds.collide(shape)) {
            for (let i = 0; i < this.objects.length; i++) {
                if (shape.collide(this.objects[i])) {
                    result.push(this.objects[i]);
                }
            }
        }

        return result;
    }


    /**
     * Insert the object into the quadtree
     * @param rect 
     * @returns true if the object has been added to the quadtree, false otherwise
     */
    insert(rect: Shape): boolean {

        //If the object is not in the bounds of the quadtree
        if (!this.bounds.collide(rect)) return false;

        if (!this.isDivided()) {

            //Check if the shape can be added to the current node
            if (this.objects.length < this.maxObjects || this.level === this.maxLevels) {
                this.objects.push(rect);
                return true;
            }

            this.split();
        }

        //Add the object to the subnodes
        return this.nodes.map(node => node.insert(rect)).some(result => result);
    }

    remove(rect: Shape): boolean {
        if (!this.bounds.collide(rect)) return false;
        if (this.objects.includes(rect)) {
            this.objects = this.objects.filter(obj => obj !== rect);
            return true;
        }
        return this.nodes.map(node => node.remove(rect)).some(result => result);
    }

    isDivided(): boolean {
        return this.nodes.length > 0;
    }
}