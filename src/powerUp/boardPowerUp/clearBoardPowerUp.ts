import GameRoom from "../../gameRoom";
import Player from "../../player";
import BoardPowerUp from "./boardPowerUp";

export default class ClearBoardPowerUp extends BoardPowerUp {

    constructor() {
        super(10, "clearBoard")
    }

    protected applyEffect(gameRoom: GameRoom, player: Player): void {
        gameRoom.getPlayerManager().getPlayers().forEach(player => {
            player.tail.removeAllParts()
        });
    }

    public unapplyEffect(gameRoom: GameRoom): void { }
}