import PowerUp from "./powerUp"
import Player from "../player";
import GameRoom from "../gameRoom";
import HeadDecreasePowerUp from "./HeadDecreasePowerUp";
import HeadIncreasePowerUp from "./HeadIncreasePowerUp";
import TypedEventEmitter from "../typedEventEmitter";
import SpeedIncreasePowerUp from "./speedIncreasePowerUp";
import SpeedDecreasePowerUp from "./speedDecreasePowerUp";

export default class PowerUpManager extends TypedEventEmitter<{
    'powerUp:Added': [PowerUp],
    'powerUp:Removed': [PowerUp[]]
}>{
    /**
     * Array of power ups constructor 
     */
    private powerUps: Array<{new():PowerUp}> = []


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
    private currentPowerUps: PowerUp[] = []

    constructor() {
        super()
        this.powerUps = [
            SpeedIncreasePowerUp,
            SpeedDecreasePowerUp,
            HeadDecreasePowerUp,
            HeadIncreasePowerUp
        ]
    }

    /**
     * Tick function
     */
    public tick(tick: number,players :Player[])  {
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

        if (this.currentPowerUps.length > 0) {
            let removed:number = 0
            this.currentPowerUps = this.currentPowerUps.filter((powerUp) => {
                for (let player of players) {
                    if (powerUp.collide(player)) {
                        removed++;
                        powerUp.applyEffect(player,players)
                        this.activePowerUps.push({powerUp, remainingTicks: powerUp.getDuration() * GameRoom.getTickRate()})
                        return false
                    }
                }
                return true
            })
            if (removed) this.emit('powerUp:Removed', this.activePowerUps.slice(this.activePowerUps.length - removed).map(({powerUp}) => powerUp))
        }


        if(Math.random() < 0.005) {
            const powerUp = new this.powerUps[Math.floor(Math.random() * this.powerUps.length)]()
            this.currentPowerUps.push(powerUp)
            this.emit('powerUp:Added', powerUp)
        }   
    }

    /**
     * Reset the power up manager
     */
    reset() {
        this.activePowerUps.forEach(({powerUp}) => powerUp.unapplyEffect())
        this.currentPowerUps = []
        this.activePowerUps = []
    }
}