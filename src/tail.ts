import Player from "./player";
import PlayerTail from "./shape/playerTail";

export class Tail {

    private parts: PlayerTail[] = [];

    private player: Player

    constructor(player: Player) {
        this.player = player;
    }

    public addPart(part: PlayerTail) {
        this.parts.push(part);
        this.player.gameroom.getBoard().insert(part);
    }

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


    public getParts(): PlayerTail[] {
        return this.parts;
    }

    public clear() {
        this.parts = [];
    }

}