import Player from "../player"
import PowerUp from "./powerUp"

export default class HeadDecreasePowerUp extends PowerUp {

    constructor() {
        super(10, "head-decrease")
    }

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    public applyEffectToPlayer(player: Player): void {
        player.setRadius(player.getRadius() / 2)
    }

    /**
     * Unapply the effect of the power up
     * @param player The player who takes the power up
     */
    public unapplyEffectToPlayer(player: Player): void {
        player.setRadius(player.getRadius() * 2)
    }
}