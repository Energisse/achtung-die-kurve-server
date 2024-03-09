import Player from "../../player"
import PlayerPowerUp from "./playerPowerUp"

export default class SpeedIncreasePowerUp extends PlayerPowerUp {

    constructor() {
        super(10, "speed-increase")
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