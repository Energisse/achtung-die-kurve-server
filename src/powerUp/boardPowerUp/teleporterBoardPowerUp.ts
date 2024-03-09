import GameRoom from "../../gameRoom";
import Player from "../../player";
import BoardPowerUp from "./boardPowerUp";

export default class TeleporterBoardPowerUp extends BoardPowerUp {

    constructor() {
        super(10, "TeleporterBoard")
    }

    protected applyEffect(gameRoom: GameRoom, player: Player): void {
        gameRoom.getBoard().teleporter++;
    }

    public unapplyEffect(gameRoom: GameRoom): void {
        gameRoom.getBoard().teleporter--;
    }
}