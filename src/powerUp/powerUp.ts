import GameRoom from "../gameRoom"
import Player from "../player"
import Circle from "../shape/circle"
import Dot from "../shape/dot"
import { BoardPowerUpType } from "./boardPowerUp/boardPowerUp"
import { PlayerPowerUpType } from "./playerPowerUp/playerPowerUp"

export type PowerUpType = PlayerPowerUpType | BoardPowerUpType
export default abstract class PowerUp extends Circle {

    /**
     * Duration of the power up
     */
    private duration: number

    /**
     * Type of the power up
     */
    public type: PowerUpType;

    /**
     * Constructor of the power up
     * @param duration The duration of the power up
     * @param type The type of the power up
     */
    constructor(duration: number, type: PowerUpType) {
        super(new Dot(Math.random() * 1000, Math.random() * 1000), 10)
        this.type = type
        this.duration = duration
    }

    /**
     * Apply the effect of the power up
     * @param gameRoom The game room
     * @param player The player who takes the power up
     */
    protected abstract applyEffect(gameRoom: GameRoom, player: Player): void;


    /**
     * Apply the effect of the power up
     * @param gameRoom The game room
     * @param player The player who takes the power up
     */
    public onCollide(gameRoom: GameRoom, player: Player): void {
        this.applyEffect(gameRoom, player)
    }

    /**
     * Unapply the effect of the power up
     * @param gameRoom The game room
     */
    public abstract unapplyEffect(gameRoom: GameRoom): void;

    /**
     * Return duration of the power up
     * @returns  {number} The duration of the power up
     */
    public getDuration(): number {
        return this.duration
    }
}