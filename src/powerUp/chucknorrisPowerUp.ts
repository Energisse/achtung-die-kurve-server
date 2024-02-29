import Player from "../player"
import PowerUp from "./powerUp"

export default class ChucknorrisPowerUp extends PowerUp {

    constructor() {
        super(10,"chucknorris")
    }

    /**
     * Apply the effect of the power up
     * @param player The player who takes the power up
     */
    public applyEffectToPlayer(player: Player): void {
        player.setChuckNorris(player.getChuckNorris()+1)
    }

    /**
     * Unapply the effect of the power up
     * @param player The player who takes the power up
     */
    public unapplyEffectToPlayer(player: Player): void {
        player.setChuckNorris(player.getChuckNorris()-1)
    }
}