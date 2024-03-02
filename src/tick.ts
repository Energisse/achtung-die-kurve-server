import GameRoom from "./gameRoom"
import Player from "./player"
import PowerUp from "./powerUp/powerUp"
import Circle from "./shape/circle"
import Line from "./shape/line"
import TypedEventEmitter from "./typedEventEmitter"

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
    private tickData: {
        player: {
            added?: Array<{
                id: string
                position: Circle
                newTail?: Line
                color: string
            }>,
            removed?: Array<{
                id: string
                parts: number[]
            }>,
        },
        powerUp: {
            added?: {
                x: number
                y: number
                radius: number
                id: string
                type: string
                other: boolean
            }[],
            removed?: string[]
        },
    } = {
            player: {},
            powerUp: {}
        }

    
    constructor(gameroom: GameRoom) {
        super()
        this.gameroom = gameroom

        this.gameroom.getPowerUpManager().on('powerUp:Added', ({ x, y, radius, id, type, other }: PowerUp) => {
            if (!this.tickData.powerUp.added) this.tickData.powerUp.added = []
            this.tickData.powerUp.added.push({ x, y, radius, id, type, other })
        })

        this.gameroom.getPowerUpManager().on('powerUp:Removed', (powerUp: PowerUp[]) => {
            if (!this.tickData.powerUp.removed) this.tickData.powerUp.removed = []
            this.tickData.powerUp.removed.push(...powerUp.map(p => p.id))
        })

        this.gameroom.getPlayerManager().on('player:Added', (player) => {
            player.on('moved', this.onPlayerMove.bind(this, player))
            player.on('tail:Added', this.onPlayerTailAdded.bind(this, player))
            player.on('tail:Removed', this.onPlayerTailRemoved.bind(this, player))
        })

        this.gameroom.getPlayerManager().on('player:Removed', (player) => {
            player.off('moved', this.onPlayerMove.bind(this, player))
            player.off('tail:Added', this.onPlayerTailAdded.bind(this, player))
            player.off('tail:Removed', this.onPlayerTailRemoved.bind(this, player))
        })
    }

    /**
     * Start the tick
     * @returns {void}
    */
    public start(): void {
        this.stop()
        this.tickNumber = 0
        this.tickInterval = setInterval(() => {
            if (this.gameroom.getStatus() !== "playing") return
            this.tickNumber++

            let killed = 0
            this.gameroom.getPlayerManager().getPlayers().forEach((player, index, players) => {
                if (!player.isAlive()) return
                player.tick(this.tickNumber)
                this.gameroom.getPowerUpManager().tick(this.tickNumber, players)

                if (this.gameroom.getBoard().outside(player.getPosition())) {
                    console.log(player.getName(), "collide with the wall")
                    player.kill()
                    killed++
                }
                else {
                    for (let opponent of players) {
                        if (player.collide(opponent)) {
                            player.kill()
                            if (player !== opponent) opponent.addPoints(1)
                            else opponent.addPoints(-1)
                            killed++
                            break
                        }
                    }
                }
            })

            this.gameroom.getPlayerManager().getPlayers().forEach((player) => {
                if (player.isAlive()) {
                    player.addPoints(killed)
                }
                this.gameroom.emit("leaderboard", this.gameroom.getPlayerManager().getPlayerInfos())
            })

            this.gameroom.emit('tick', this.tickData)
            this.tickData = {
                player: {},
                powerUp: {}
            }

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
     * On player move
     * @param {Player} player The player
     * @param {Circle} circle The new position of the player
     * @returns {void}
     */
    private onPlayerMove(player: Player, circle: Circle): void {
        if (!this.tickData.player.added) this.tickData.player.added = []
        this.tickData.player.added.push({
            id: player.getID(),
            position: circle,
            color: player.getColor()
        })
    }

    /**
     * On player tail added
     * @param {Player} player The player
     * @param {Line} line The new tail
     * @returns {void}
     */
    private onPlayerTailAdded(player: Player, line: Line): void {
        if (!this.tickData.player.added) this.tickData.player.added = []
        this.tickData.player.added.push({
            id: player.getID(),
            position: player.getPosition(),
            newTail: line,
            color: player.getColor()
        })
    }

    /**
     * On player tail removed
     * @param {Player} player The player
     * @param {number[]} parts The parts of the tail removed
     * @returns {void}
     */
    private onPlayerTailRemoved(player: Player, parts: number[]): void {
        if (!this.tickData.player.removed) this.tickData.player.removed = []
        console.log("tail removed", parts)
        this.tickData.player.removed.push({
            id: player.getID(),
            parts
        })
    }

    /**
     * Stop the tick
     * @returns {void}
     */
    public stop(): void {
        if (this.tickInterval) clearInterval(this.tickInterval)
    }
}