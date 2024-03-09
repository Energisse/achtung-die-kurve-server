import Player from "./player";
import PlayerTail from "./shape/playerTail";

export class Tail {

    /**
     * Parts of the tail
     */
    private parts: PlayerTail[] = [];

    /**
     * Parts to add to the tail (to avoid self collision)
     */
    private partsToAdd: PlayerTail[] = [];

    /**
     * Player's tail
     */
    private player: Player

    /**
     * Constructor of the tail
     * @param player The player who has the tail
     */
    constructor(player: Player) {
        this.player = player;
    }

    /**
     * Add a part to the tail and avoid self collision
     * @param part The part to add
     */
    public addPart(part: PlayerTail) {
        this.partsToAdd.push(part);
        //Avoid self collision
        this.partsToAdd = this.partsToAdd.filter(t => {
            if (this.player.collide(t)) {
                return true
            }
            this.parts.push(t);
            this.player.gameroom.getBoard().insert(t);
            return false
        })
    }

    /**
     * Remove a part from the tail
     * @param id The id of the part to remove
     */
    public removePart(id: number) {
        let removed;
        this.parts = this.parts.filter(t => {
            if (t.id === id) {
                removed = t;
                return false;
            }
            return true;
        });
        if (removed) this.player.gameroom.getBoard().remove(removed)
    }


    /**
     * Get the parts of the tail
     * @returns The parts of the tail
     */
    public getParts(): PlayerTail[] {
        return this.parts;
    }

    /**
     * Clear the tail
     */
    public clear() {
        this.parts = [];
        this.partsToAdd = [];
    }

}