import Player from "../player";
import Dot from "./dot";
import Line from "./line";

export default class PlayerTail extends Line {

    /**
     * The player that the tail belong to
     */
    public player: Player;

    /**
     * Constructor of the line
     * @param p1 The first point of the line
     * @param p2 The second point of the line
     * @param width The width of the line
     * @param player The player that the tail belong to
     */
    constructor(p1: Dot, p2: Dot, width: number, player: Player) {
        super(p1, p2, width);
        this.player = player;
    }

    /**
     * Convert the tail to a JSON object
     * @returns The JSON object
     */
    public toJSON() {
        return {
            p1: this.p1,
            p2: this.p2,
            width: this.width,
        }
    }
}