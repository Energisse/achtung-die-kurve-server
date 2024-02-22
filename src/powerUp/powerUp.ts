import Player from "../player"

export default abstract class PowerUp {

    /**
     * X position of the power up
     */
    private x: number

    /**
     * Y position of the power up
     */
    private y: number

    /**
     * Radius of the power up
     */
    private radius: number

    /**
     * Duration of the power up
     */
    private duration: number

    /**
     * Start time of the power up
     */
    private start: number = Date.now()

    /**
     * Players who take the power up
     */
    private players: Player[] = []

    /**
     * Constructor of the power up
     * @param duration The duration of the power up
     */
    constructor(duration: number) {
        this.x = Math.random() * 1000
        this.y = Math.random() * 1000
        this.radius = 10
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
    public applyEffect(player: Player | Player[]): void {
        if (!Array.isArray(player)) {
            this.applyEffectToPlayer(player)
            this.players.push(player)
            return
        }
        player.forEach(p => this.applyEffectToPlayer(p))
        this.players.push(...player)
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
     * Check if the power up collides with a player
     * @param player The player to check
     * @returns {boolean} True if the power up collides with the player, false otherwise
     */
    public collision(player: Player): boolean {
        const collide = Math.sqrt((this.x - player.getPositions().at(-1)?.end.x!) ** 2 + (this.y - player.getPositions().at(-1)?.end.y!) ** 2) < this.radius
        if (collide) this.start = Date.now()
        return collide
    }

    /**
     * Check if the power up is expired
     * @returns {boolean} True if the power up is expired, false otherwise
     */
    public isExpired(): boolean {
        console.log(Date.now() - this.start, this.duration * 1000)
        return Date.now() - this.start > this.duration * 1000
    }
}