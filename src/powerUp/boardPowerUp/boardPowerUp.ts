import GameRoom from "../../gameRoom"
import Player from "../../player"
import PowerUp, { PowerUpType } from "../powerUp"

export type BoardPowerUpType = "clearBoard" | "TeleporterBoard"
export default abstract class BoardPowerUp extends PowerUp {

    /**
     * Constructor of the power up
     * @param duration The duration of the power up
     * @param type The type of the power up
     */
    constructor(duration: number, type: PowerUpType) {
        super(duration, type)
    }

    /**
     * Apply the effect of the power up
     * @param gameRoom The game room
     * @param player The player who takes the power up
     */
    protected abstract applyEffect(gameRoom: GameRoom, player: Player): void;

    /**
     * Unapply the effect of the power up
     */
    public abstract unapplyEffect(gameRoom: GameRoom): void;
}