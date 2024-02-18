import GameRoom from "./gameRoom"
import Player from "./player";

export default class GameServer {

    /**
     * Instance of the game server
     */
    private static instance: GameServer = new GameServer()

    /**
     * List of rooms
     */
    private static rooms: GameRoom[] = []

    private constructor() {
    }

    /**
     * Get the instance of the game server
     * @returns {GameServer} The instance of the game server
     */
    public static getInstance() {
        return this.instance
    }

    /**
     * Get all the rooms
     * @returns {GameRoom[]} The list of rooms
     */
    public static getAllRooms() {
        return GameServer.rooms
    }

    /**
     * Create a room
     * @param Player The player who creates the room 
     * @returns {GameRoom} The created room
     */
    public static createRoom(Player: Player) {
        const room = new GameRoom(Player)
        GameServer.rooms.push(room)
        return room
    }

    /**
     * Get a room by its id
     * @param id The id of the room
     * @returns {GameRoom | undefined} The room if it exists, undefined otherwise
     */
    public static getRoom(id: string) {
        return GameServer.rooms.find((r) => r.getID() === id)
    }

    /**
     * Remove a room from the list
     * @param id The id of the room to remove
     */
    public static removeRoom(id: string) {
        const index = GameServer.rooms.findIndex((r) => r.getID() === id)
        if (index !== -1) {
            GameServer.rooms.splice(index, 1)
        }
    }
}

