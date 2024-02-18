import { v4 as uuidv4 } from 'uuid';
import { io } from './index';
import Player from "./player";
import GameServer from './gameServer';

export default class GameRoom {

    /**
     * Unique identifier
     */
    private id = uuidv4()

    /**
     * Array of players
     */
    private players: Player[] = []

    /**
     * Moderator of the room
     */
    private moderator: Player

    /**
     * Array of colors
     */
    private static = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"]

    /**
     * Max number of players
     */
    private maxPlayers = 5

    /**
     * Date of creation
     */
    private created = new Date()

    /**
     * Static tick rate
     */
    private staticTickRate = 1000 / 32

    constructor(Player: Player) {
        this.moderator = Player
        this.addPlayer(Player)
    }

    /**
     * Check if the room is full
     * @returns {boolean} True if the room is full, false otherwise
     */
    public isFull(): boolean {
        return this.players.length >= this.maxPlayers
    }

    /**
     * Add a player to the room
     * @param {Player} player The player to add
     * @returns {boolean} True if the player has been added, false otherwise
     */
    public addPlayer(player: Player): boolean {
        //Check if the room is full
        if (this.isFull()) return false
        //Set the color of the player
        player.setColor(this.static.filter((c) => !this.players.find((p) => p.getColor() === c))[0])

        this.players.push(player)
        const socket = player.getSocket()
        socket.on('disconnect', () => {
            this.removePlayer(player)
            io.to(this.id).emit('room', { players: this.getPlayerInfos() })
        });

        socket.join(this.id);

        io.to(this.id).emit('room', { players: this.getPlayerInfos() })
        socket.on('room', (callback) => {
            callback({ players: this.getPlayerInfos() })
        });

        socket.on('start', () => {
            if (this.players.length < 2) return
            if (this.moderator.getSocket().id !== player.getSocket().id) return
            io.to(this.id).emit('start')
            setInterval(() => {
                this.tick()
            }, this.staticTickRate)
        })
        return true
    }

    /**
     * Send the new positions of the players to the clients
     */
    private tick() {
        const newPositions: Array<Array<number>> = []
        this.players.forEach((player) => {
            player.tick()
            newPositions.push(player.getPositions().at(-1)!)
        })
        io.emit("tick", newPositions)

    }

    /**
     * Remove a player from the room
     * @param {Player} player The player to remove 
     */
    public removePlayer(player: Player) {
        this.players = this.players.filter((p) => p.getSocket().id !== player.getSocket().id)
        if (this.players.length === 0) return GameServer.removeRoom(this.id)
        else if (this.moderator?.getSocket().id === player.getSocket().id) this.moderator = this.players[0]
    }

    private getPlayerInfos() {
        return this.players.map((p) => ({
            name: p.getName(),
            isModerator: this.moderator?.getSocket().id === p.getSocket().id,
            id: p.getSocket().id,
            color: p.getColor(),
        }))
    }

    /**
     * Get the informations of the room
     * @returns {Object} The informations of the room
     */
    public getInfos() {
        return {
            id: this.id,
            players: this.players.length,
            maxPlayers: this.maxPlayers,
            created: this.created
        }
    }

    /**
     * Get the unique identifier of the room
     * @returns {string} The unique identifier of the room
     */
    public getID() {
        return this.id
    }
}