import Player from "../../player"
import PlayerPowerUp from "./playerPowerUp"

export default class InvinciblePowerUp extends PlayerPowerUp {

    constructor() {
        super(10, "invincible")
    }

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    public applyEffectToPlayer(player: Player): void {
        player.setInvincible(player.getInvincible() + 1)
    }

    /**
     * Unapply the effect of the power up
     * @param player The player who takes the power up
     */
    public unapplyEffectToPlayer(player: Player): void {
        player.setInvincible(player.getInvincible() - 1)
    }
}