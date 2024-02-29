import Player from "../player"
import PowerUp from "./powerUp"

export default class SpeedDecreasePowerUp extends PowerUp {

    constructor() {
        super(10,"speed-decrease")
    }

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    public applyEffectToPlayer(player: Player): void {
        player.setSpeed(player.getSpeed() * 2)
    }

    /**
     * Unapply the effect of the power up
     * @param player The player who takes the power up
     */
    public unapplyEffectToPlayer(player: Player): void {
        player.setSpeed(player.getSpeed() / 2)
    }
}