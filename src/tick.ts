import GameRoom from "./gameRoom"
import Player from "./player"
import PowerUp from "./powerUp/powerUp"
import PlayerTail from "./shape/playerTail"
import TypedEventEmitter from "./typedEventEmitter"

export type TickData = {
    player: {
        added: Array<{
            id: string
            position: {
                x: number,
                y: number,
                radius: number
            }
            color: string
        }>,

        removed: number[],
    },
    tails: {
        added: Array<
            {
                id: number,
                tail: PlayerTail,
                player: string
            }
        >,
        removed: Array<{
            id: number,
            player: string
        }>
    }
    powerUp: {
        added: PowerUp[],
        removed: number[]
    },
}

export default class Tick extends TypedEventEmitter<{
    'tick': [number]
}>{

    /**
     * Interval of the tick
     */
    private tickInterval: NodeJS.Timeout | null = null

    /**
     * Tick number
     */
    private tickNumber: number = 0

    /**
     * Static tick rate
     */
    public static staticTickRate = 64

    /**
     * Game room
     */
    private gameroom: GameRoom

    /**
     * Tick data to send to the client at the end of the tick
     */

    constructor(gameroom: GameRoom) {
        super()
        this.gameroom = gameroom
    }


    /**
     * Start the tick
     * @returns {void}
    */
    public start(): void {
        this.stop()
        this.tickNumber = 0
        this.stop()

        this.tickInterval = setInterval(() => {
            if (this.gameroom.getStatus() !== "playing") return

            this.tickNumber++
            const tickData: TickData = {
                player: {
                    added: [],
                    removed: [],
                },
                tails: {
                    added: [],
                    removed: []
                },
                powerUp: {
                    added: [],
                    removed: []
                }
            }

            this.gameroom.getPowerUpManager().tick(this.tickNumber)


            const alivePlayers = this.gameroom.getPlayerManager().getPlayers().filter((p) => p.isAlive())

            alivePlayers.forEach((player) => {
                player.tick(this.tickNumber)
                player.detectCollision(this.gameroom.getBoard())
            })

            const stilAlivePlayers = alivePlayers.filter((p) => p.isAlive())
            const diedCount = alivePlayers.length - stilAlivePlayers.length
            if (diedCount) {
                stilAlivePlayers.forEach((player) => {
                    player.addPoints(diedCount)
                })
                this.gameroom.emit("leaderboard", this.gameroom.getPlayerManager().getPlayerInfos())
            }

            this.gameroom.getBoard().getNewShapes().forEach((shape) => {
                if (shape instanceof Player) {
                    tickData.player.added.push({
                        id: shape.getID(),
                        position: {
                            x: shape.x,
                            y: shape.y,
                            radius: shape.getRadius()
                        },
                        color: shape.getColor()
                    })
                }
                else if (shape instanceof PowerUp) {
                    tickData.powerUp.added.push(shape)
                }
                else if (shape instanceof PlayerTail) {
                    tickData.tails.added.push({
                        id: shape.id,
                        tail: shape,
                        player: shape.player.getID(),
                    })
                }
            })

            this.gameroom.getBoard().getRemovedShapes().forEach((shape) => {
                if (shape instanceof PowerUp) {
                    tickData.powerUp.removed.push(shape.id)
                }
                else if (shape instanceof PlayerTail) {
                    tickData.tails.removed.push({
                        id: shape.id,
                        player: shape.player.getID()
                    })
                }
            });


            this.gameroom.emit('tick', tickData)

            if (this.gameroom.getPlayerManager().getPlayers().filter((p) => p.isAlive()).length < 2) {
                this.stop()
                setTimeout(() => {
                    this.gameroom.startGame()
                }, 3000)
                this.gameroom.emit('end')
            }
        }, 1000 / Tick.staticTickRate)
    }

    /**
     * Stop the tick
     * @returns {void}
     */
    public stop(): void {
        if (this.tickInterval) clearInterval(this.tickInterval)
    }
}