import GameRoom from "../gameRoom";
import Player from "../player";
import Tick from "../tick";
import TypedEventEmitter from "../typedEventEmitter";
import ChucknorrisPowerUp from "./chucknorrisPowerUp";
import HeadDecreasePowerUp from "./headDecreasePowerUp";
import HeadIncreasePowerUp from "./headIncreasePowerUp";
import InvertedPowerUp from "./invertedPowerUp";
import InvinciblePowerUp from "./invinciblePowerUp";
import LineDecreasePowerUp from "./lineDecreasePowerUp";
import LineIncreasePowerUp from "./lineIncreasePowerUp";
import PowerUp from "./powerUp";
import SpeedDecreasePowerUp from "./speedDecreasePowerUp";
import SpeedIncreasePowerUp from "./speedIncreasePowerUp";

export default class PowerUpManager extends TypedEventEmitter<{
    'powerUp:Added': [PowerUp],
    'powerUp:Removed': [PowerUp]
}>{
    /**
     * Array of power ups constructor 
     */
    private powerUps: Array<{ new(): PowerUp }> = []


    /**
     * Array of active power ups active on players
     */
    private activePowerUps: Array<
        {
            powerUp: PowerUp,
            remainingTicks: number
        }> = []

    /**
     * Array of current power ups on the map
     */
    public currentPowerUps: PowerUp[] = []

    /**
     * Constructor of the power up manager
     * @param gameRoom The game room
     */
    private gameRoom: GameRoom

    constructor(gameRoom: GameRoom) {
        super()
        this.gameRoom = gameRoom
        this.powerUps = [
            ChucknorrisPowerUp,
            InvinciblePowerUp,
            InvertedPowerUp,
            LineDecreasePowerUp,
            LineIncreasePowerUp,
            SpeedIncreasePowerUp,
            SpeedDecreasePowerUp,
            HeadDecreasePowerUp,
            HeadIncreasePowerUp
        ]
    }

    public generatePowerUp() {
        if (Math.random() < 0.005) {
            const powerUp = new this.powerUps[Math.floor(Math.random() * this.powerUps.length)]()
            this.currentPowerUps.push(powerUp)
            this.gameRoom.getBoard().insert(powerUp)
        }

    }

    /**
     * Tick function
     */
    public tick(tick: Number) {
        if (this.activePowerUps.length > 0) {
            this.activePowerUps = this.activePowerUps.filter((activePowerUp) => {
                activePowerUp.remainingTicks--;
                if (activePowerUp.remainingTicks <= 0) {
                    activePowerUp.powerUp.unapplyEffect()
                    return false
                }
                return true
            })
        }

        this.generatePowerUp()
    }

    collide(player: Player, powerUp: PowerUp) {
        console.log('collide', player, powerUp)
        powerUp.applyEffect(player, this.gameRoom.getPlayerManager().getPlayers())
        this.activePowerUps.push({ powerUp, remainingTicks: powerUp.getDuration() * Tick.staticTickRate })
        this.currentPowerUps = this.currentPowerUps.filter(p => p !== powerUp)
    }

    /**
     * Reset the power up manager
     */
    reset() {
        this.activePowerUps.forEach(({ powerUp }) => powerUp.unapplyEffect())
        this.currentPowerUps = []
        this.activePowerUps = []
    }
}