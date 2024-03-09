import GameRoom from "../../gameRoom"
import Player from "../../player"
import PowerUp, { PowerUpType } from "../powerUp"

export type PlayerPowerUpType = "speed-increase" | "head-increase" | "speed-decrease" | "head-decrease" | "inverted" | "line-increase" | "line-decrease" | "chucknorris" | "invincible"

export default abstract class PlayerPowerUp extends PowerUp {

    /**
     * Players who take the power up
     */
    private players: Player[] = []

    /**
     * Type of the power up to apply to the player or to the other players
     */
    public other: boolean

    /**
     * Constructor of the power up
     * @param duration The duration of the power up
     * @param type The type of the power up
     */
    constructor(duration: number, type: PowerUpType) {
        super(duration, type)
        this.other = Math.random() > 0.5
    }

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    protected abstract applyEffectToPlayer(player: Player): void;


    /**
     * Apply the effect of the power up
     * @param gameRoom The game room
     * @param player The player who takes the power up
     */
    protected applyEffect(gameRoom: GameRoom, player: Player): void {
        if (this.other) {
            this.players = gameRoom.getPlayerManager().getPlayers().filter(p => p !== player)
            this.players.forEach(p => this.applyEffectToPlayer(p))
        } else {
            this.players = [player]
            this.applyEffectToPlayer(player)
        }
    }

    /**
     * Unapply the effect of the power up
     * @param gameRoom The game room
     * @param player The player who takes the power up
     */
    protected abstract unapplyEffectToPlayer(player: Player): void;

    /**
     * Unapply the effect of the power up
     */
    public unapplyEffect(gameRoom: GameRoom): void {
        this.players.forEach(p => this.unapplyEffectToPlayer(p))
    }
}