import Player from "../../player"
import PlayerPowerUp from "./playerPowerUp"

export default class ChucknorrisPowerUp extends PlayerPowerUp {

    constructor() {
        super(10, "chucknorris")
    }

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    protected applyEffectToPlayer(player: Player): void {
        player.setChuckNorris(player.getChuckNorris() + 1)
    }

    /**
     * Unapply the effect of the power up
     * @param player The player who takes the power up
     */
    protected unapplyEffectToPlayer(player: Player): void {
        player.setChuckNorris(player.getChuckNorris() - 1)
    }
}