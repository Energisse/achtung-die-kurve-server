import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import GameServer from './gameServer';
import Player from "./player";
import PlayerManager from './playerManager';
import PowerUpManager from './powerUp/powerUpManager';
import { io } from './server';
import Rectangle from './shape/rectangle';
import Tick from './tick';
import QuadTree from './quadtree/quadtree';

export enum GameRoomStatus {
    WAITING = "waiting",
    PLAYING = "playing",
    PAUSED = "paused"
}

export default class GameRoom {

    /**
     * Unique identifier
     */
    private id = uuidv4()

    /**
     * Player manager
     */
    private playerManager: PlayerManager;

    /**
     * Date of creation
     */
    private created = new Date()

    /**
     * board
     */
    private board: QuadTree = new QuadTree(800, 800)

    /**
     * Interval of the game
     */
    private tick: Tick
    /**
     * power up manager
     */
    private powerUpManager: PowerUpManager = new PowerUpManager(this)

    /**
     * Status of the room
     */
    private status: GameRoomStatus = GameRoomStatus.WAITING;

    /**
     * Constructor of the room
     * @param {Player} moderator The moderator of the room
     */
    constructor(socketPlayer: Socket) {
        this.playerManager = new PlayerManager(this)
        this.tick = new Tick(this)

        this.playerManager.on('player:Removed', (player: Player) => {
            this.emit("leaderboard", this.getPlayerManager().getPlayerInfos())
            if (this.playerManager.getPlayers().length === 0) {
                this.tick.stop()
                GameServer.removeRoom(this.id)
            }
        })

        this.playerManager.on('player:Added', (player: Player) => {
            const socket = player.getSocket()
            socket.join(this.id)
            this.emit("leaderboard", this.getPlayerManager().getPlayerInfos())

            socket.on('disconnect', () => {
                this.playerManager.removePlayer(player.getID())
            });

            socket.on('direction', (msg) => {
                switch (msg) {
                    case 'left':
                        player.setDirection(-0.05)
                        break;
                    case 'right':
                        player.setDirection(0.05)
                        break;
                    case 'forward':
                        player.setDirection(0)
                        break;
                    default:
                        break;
                }
            })

            socket.on('kick', (id: string) => {
                if (!this.getPlayerManager().isModerator(player)) return
                const kicked = this.playerManager.removePlayer(id)
                if (kicked) {
                    kicked.getSocket().emit('kicked');
                }
            })

            socket.on('start', (callback) => {
                if (
                    this.isStarted() || //Game already started
                    this.getPlayerManager().getPlayers().length < 2 || //Not enough players
                    !this.getPlayerManager().isModerator(player) //Not the moderator
                ) return callback(false)

                this.startGame()
                callback(true)
            })

            socket.on("pause", (callback) => {
                if (this.status === GameRoomStatus.PLAYING) {
                    this.status = GameRoomStatus.PAUSED
                    io.to(this.id).emit("paused")
                }
                else if (this.status === GameRoomStatus.PAUSED) {
                    this.status = GameRoomStatus.PLAYING
                    io.to(this.id).emit("resumed")
                }
                callback(this.status)
            });
        })

        this.playerManager.addPlayer(socketPlayer)
    }

    /**
     * Start the game
     */
    public startGame() {
        this.status = GameRoomStatus.PLAYING
        io.to(this.id).emit('start')
        this.powerUpManager.reset()
        this.board.clear()

        this.playerManager.getPlayers().forEach((p) => {
            p.revive()
            p.tail.clear()
            const x = Math.random() * this.board.bounds.width
            const y = Math.random() * this.board.bounds.height
            p.setPositions(x, y)
        })

        this.tick.start()
    }

    /**
     * Get the informations of the room
     * @returns {Object} The informations of the room
     */
    public getInfos(): object {
        return {
            id: this.id,
            players: this.playerManager.getPlayers().length,
            maxPlayers: this.playerManager.getMaxPlayers(),
            created: this.created
        }
    }

    /**
     * Get the unique identifier of the room
     * @returns {string} The unique identifier of the room
     */
    public getID(): string {
        return this.id
    }

    /**
     * Check if the game is started
     * @returns {boolean} True if the game is started, false otherwise
     */
    public isStarted(): boolean {
        return this.status !== GameRoomStatus.WAITING
    }

    /**
     * Get the status of the room
     * @returns {GameRoomStatus} The status of the room
     */
    public getStatus(): GameRoomStatus {
        return this.status
    }

    /**
     * Get the player manager
     * @returns {PlayerManager} The player manager
     */
    public getPlayerManager(): PlayerManager {
        return this.playerManager
    }

    /**
     * Get the power up manager
     * @returns {PowerUpManager} The power up manager
     */
    public getPowerUpManager(): PowerUpManager {
        return this.powerUpManager
    }

    /**
     * Emit an event to the room
     * @param {string} event The event to emit
     * @param {any[]} arg The arguments to send
     */
    public emit(event: string, ...arg: any[]) {
        io.to(this.id).emit(event, ...arg)
    }

    /**
     * Get the board
     * @returns {QuadTree} The board
     */
    public getBoard(): QuadTree {
        return this.board
    }

}