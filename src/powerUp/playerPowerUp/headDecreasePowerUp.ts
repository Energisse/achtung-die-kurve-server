import Player from "../../player"
import PlayerPowerUp from "./playerPowerUp"

export default class HeadDecreasePowerUp extends PlayerPowerUp {

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