import { Socket } from "socket.io"
import Player from "./player"
import TypedEventEmitter from "./typedEventEmitter"
import GameRoom from "./gameRoom"

export default class PlayerManager extends TypedEventEmitter<{
    'player:Added': [Player],
    'player:Removed': [Player]
}>{
    /**
     * Game room
     */
    gameRoom: GameRoom

    /**
     * Moderator of the room
     */
    private moderator: Player | null = null

    /**
     * Array of players
     */
    private players: Player[] = []

    /**
     * Array of colors
     */
    private static colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#FFFFFF", "#FFA500"]

    /**
     * Max number of players
     */
    private maxPlayers = 8

    constructor(gameRoom: GameRoom) {
        super()
        this.gameRoom = gameRoom
    }

    /**
     * Get the players
     * @returns {Player[]} The players
     */
    public getPlayers(): Player[] {
        return this.players
    }

    /**
     * Add a player to the room
     * @param {Socket} socketPlayer The socket of the player
     * @returns {boolean} True if the player has been added, false otherwise
     */
    public addPlayer(socketPlayer: Socket): boolean {
        if (this.isFull()) return false
        const player = socketPlayer.player
        player.setColor(PlayerManager.colors.filter((c) => !this.players.some((p) => p.getColor() === c))[0] || "#000000")
        if (this.moderator === null) this.moderator = player
        player.gameroom = this.gameRoom
        this.players.push(player)
        this.emit('player:Added', player)
        return true
    }

    /**
     * Get the player infos
     * @returns {object[]} The player infos
     */
    public getPlayerInfos(): object[] {
        return this.players.map((p) => ({
            name: p.getName(),
            isModerator: this.moderator === p,
            id: p.getID(),
            color: p.getColor(),
            alive: p.isAlive(),
            points: p.getPoints()
        }))
    }


    /**
     * Remove a player from the room
     * @param {string} id The id of the player to remove
     * @returns {Player | null} The removed player if it exists, null otherwise
     */
    public removePlayer(id: string): Player | null {
        const index = this.players.findIndex((p) => p.getID() === id)
        if (index !== -1) {
            const removed = this.players.splice(index, 1)[0];
            if (this.moderator === removed) this.moderator = this.players[0] || null
            this.emit('player:Removed', removed)
            return removed
        }
        return null
    }

    /**
     * Get a player by its id
     * @param {string} id The id of the player
     * @returns {Player | undefined} The player if it exists, undefined otherwise
     */
    public getPlayer(id: string): Player | undefined {
        return this.players.find((p) => p.getID() === id)
    }

    /**
     * Check if the room is full
     * @returns {boolean} True if the room is full, false otherwise
     */
    public isFull(): boolean {
        return this.players.length >= this.maxPlayers
    }

    /**
     * Get the max number of players
     * @returns {number} The max number of players
     */
    public getMaxPlayers(): number {
        return this.maxPlayers
    }

    /**
     * Get the moderator
     * @returns {Player | null} The moderator if it exists, null otherwise
     */
    public getModerator(): Player | null {
        return this.moderator
    }

    /**
     * Check if a player is the moderator
     * @param {Player} player The player to check
     * @returns {boolean} True if the player is the moderator, false otherwise
     */
    public isModerator(player: Player): boolean {
        return this.moderator === player
    }
}