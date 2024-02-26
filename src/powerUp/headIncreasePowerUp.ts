import Player from "../player"
import PowerUp from "./powerUp"

export default class HeadIncreasePowerUp extends PowerUp {

    constructor() {
        super(10,"head-increase")
    }

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    public applyEffectToPlayer(player: Player): void {
        player.setRadius(player.getRadius() * 2)
    }

    /**
     * Unapply the effect of the power up
     * @param player The player who takes the power up
     */
    public unapplyEffectToPlayer(player: Player): void {
        player.setRadius(player.getRadius() / 2)
    }
}