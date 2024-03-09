import GameRoom from "../gameRoom";
import Player from "../player";
import Tick from "../tick";
import TypedEventEmitter from "../typedEventEmitter";
import ChucknorrisPowerUp from "./playerPowerUp/chucknorrisPowerUp";
import HeadDecreasePowerUp from "./playerPowerUp/headDecreasePowerUp";
import HeadIncreasePowerUp from "./playerPowerUp/headIncreasePowerUp";
import InvertedPowerUp from "./playerPowerUp/invertedPowerUp";
import InvinciblePowerUp from "./playerPowerUp/invinciblePowerUp";
import LineDecreasePowerUp from "./playerPowerUp/lineDecreasePowerUp";
import LineIncreasePowerUp from "./playerPowerUp/lineIncreasePowerUp";
import PowerUp from "./powerUp";
import SpeedDecreasePowerUp from "./playerPowerUp/speedDecreasePowerUp";
import SpeedIncreasePowerUp from "./playerPowerUp/speedIncreasePowerUp";
import ClearBoardPowerUp from "./boardPowerUp/clearBoardPowerUp";
import TeleporterBoardPowerUp from "./boardPowerUp/teleporterBoardPowerUp";

export default class PowerUpManager extends TypedEventEmitter<{
    'powerUp:Added': [PowerUp],
    'powerUp:Removed': [PowerUp]
}>{
    /**
     * Array of power ups constructor 
     */
    private powerUps: Array<{ new(gameRoom: GameRoom): PowerUp }> = []


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
            HeadIncreasePowerUp,
            ClearBoardPowerUp,
            TeleporterBoardPowerUp
        ]
    }

    public generatePowerUp() {
        if (Math.random() < 0.005) {
            const powerUp = new this.powerUps[Math.floor(Math.random() * this.powerUps.length)](this.gameRoom)
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
                    activePowerUp.powerUp.unapplyEffect(this.gameRoom)
                    return false
                }
                return true
            })
        }

        this.generatePowerUp()
    }

    collide(player: Player, powerUp: PowerUp) {
        powerUp.onCollide(this.gameRoom, player)
        this.activePowerUps.push({ powerUp, remainingTicks: powerUp.getDuration() * Tick.staticTickRate })
        this.currentPowerUps = this.currentPowerUps.filter(p => p !== powerUp)
        this.gameRoom.getBoard().remove(powerUp)
    }

    /**
     * Reset the power up manager
     */
    reset() {
        this.activePowerUps.forEach(({ powerUp }) => powerUp.unapplyEffect(this.gameRoom))
        this.currentPowerUps = []
        this.activePowerUps = []
    }
}