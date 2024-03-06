import Player from "../player"
import PowerUp from "./powerUp"

export default class InvertedPowerUp extends PowerUp {

    constructor() {
        super(10, "inverted")
    }

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    public applyEffectToPlayer(player: Player): void {
        player.setInverted(!player.getInverted())
    }

    /**
     * Unapply the effect of the power up
     * @param player The player who takes the power up
     */
    public unapplyEffectToPlayer(player: Player): void {
        player.setInverted(!player.getInverted())
    }
}