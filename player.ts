import { Socket } from "socket.io";

export default class Player {

    /**
     * Socket of the player
     */
    private socket: Socket;

    /**
     * Name of the player
     */
    private name: string;

    /**
     * Constructor of the player
     * @param {Socket} socket The socket of the player
     * @param {string} name The name of the player
     */
    constructor(socket: Socket, name: string) {
        this.socket = socket
        this.name = name
    }

    /**
     * Get the socket of the player
     * @returns {Socket} The socket of the player
     */
    public getSocket(): Socket {
        return this.socket
    }

    /**
     * Get the name of the player
     * @returns {string} The name of the player
     */
    public getName(): string {
        return this.name;
    }
}