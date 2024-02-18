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
     * Positions of the player
     */
    private positions: number[][] = [[0, 0]];

    /**
     * Direction of the player
     */
    private direction: number = 0;

    /**
     * Angle of the player
     */
    private angle: number = 0;

    /**
     * Color of the player
     */
    private color: string = '#ffffff'

    /**
     * Constructor of the player
     * @param {Socket} socket The socket of the player
     * @param {string} name The name of the player
     */
    constructor(socket: Socket, name: string) {
        this.socket = socket
        this.name = name

        socket.on('direction', (msg) => {
            console.log('message: ' + msg);
            switch (msg) {
                case 'left':
                    this.direction = -0.05
                    break;
                case 'right':
                    this.direction = 0.05
                    break;
                case 'forward':
                    this.direction = 0
                    break;
                default:
                    break;
            }
        })
    }

    /**
     * Update the position of the player
     */
    public tick() {
        let lastPosition = this.positions.at(-1)!
        let newPosition: Array<number> = []
        this.angle += this.direction
        newPosition.push(lastPosition[0] + Math.cos(this.angle))
        newPosition.push(lastPosition[1] + Math.sin(this.angle))
        this.positions.push(newPosition)
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

    /**
     * Get the positions of the player
     * @returns {number[][]} The positions of the player
     */
    public getPositions(): number[][] {
        return this.positions;
    }

    /**
     * Get the color of the player
     * @returns {string} The color of the player
     */
    public getColor(): string {
        return this.color;
    }

    /**
     * Set the color of the player
     * @param {string} color The color of the player
     */
    public setColor(color: string) {
        this.color = color
    }
}