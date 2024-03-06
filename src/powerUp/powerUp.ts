import Player from "../player"
import Circle from "../shape/circle"
import Dot from "../shape/dot"

export type PowerUpType = "speed-increase" | "head-increase" | "speed-decrease" | "head-decrease" | "inverted" | "line-increase" | "line-decrease" | "chucknorris" | "invincible"
export default abstract class PowerUp extends Circle {

    /**
     * Duration of the power up
     */
    private duration: number

    /**
     * Players who take the power up
     */
    private players: Player[] = []

    /**
     * 
     */
    public type: PowerUpType;

    /**
     * 
     */
    public other: boolean

    /**
     * Constructor of the power up
     * @param duration The duration of the power up
     */
    constructor(duration: number, type: PowerUpType) {
        super(new Dot(Math.random() * 1000, Math.random() * 1000), 10)
        this.type = type
        this.other = Math.random() > 0.5
        this.duration = duration
    }

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    public abstract applyEffectToPlayer(player: Player): void;

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    public applyEffect(player: Player, players: Player[]): void {
        if (this.other) {
            this.players = players.filter(p => p !== player)
            this.players.forEach(p => this.applyEffectToPlayer(p))
        } else {
            this.players = [player]
            this.applyEffectToPlayer(player)
        }
    }

    /**
     * Unapply the effect of the power up
     * @param player The player who takes the power up
     */
    public abstract unapplyEffectToPlayer(player: Player): void;

    /**
     * Unapply the effect of the power up
     * @param player The player who takes the power up
     */
    public unapplyEffect(): void {
        this.players.forEach(p => this.unapplyEffectToPlayer(p))
    }

    /**
     * Return duration of the power up
     * @returns  {number} The duration of the power up
     */
    public getDuration(): number {
        return this.duration
    }
}