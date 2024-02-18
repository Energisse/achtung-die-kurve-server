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
    private positions: Array<[number, number]> = [[0, 0]];

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
     * Is the player alive
     */
    private alive: boolean = true

    /**
     * Points of the player
     */
    private points: number = 0

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
        this.angle += this.direction
        this.positions.push([
            lastPosition[0] + Math.cos(this.angle),
            lastPosition[1] + Math.sin(this.angle)
        ])
    }

    public collide(player: Player) {
        let selfMargin = 0

        if (this === player) selfMargin = 3

        const x1 = this.positions.at(-1)![0]
        const y1 = this.positions.at(-1)![1]
        const x2 = this.positions.at(-2)![0]
        const y2 = this.positions.at(-2)![1]

        for (let index = 1; index < player.positions.length - selfMargin; index++) {
            const x3 = player.getPositions().at(index)![0]
            const y3 = player.getPositions().at(index)![1]
            const x4 = player.getPositions().at(index - 1)![0]
            const y4 = player.getPositions().at(index - 1)![1]

            if (this.intersect(
                x1, y1, x2, y2,
                x3, y3, x4, y4
            )) return true
        }

        return false
    }

    private intersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
        const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
        if (det === 0) return false;
        const lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det;
        const gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
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
     * @returns {Array<[number, number]> } The positions of the player
     */
    public getPositions(): Array<[number, number]> {
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

    /**
     * Set the positions of the player
     * @param position The positions of the player
     */
    setPositions(position: Array<[number, number]>) {
        this.positions = position;
    }

    /**
     * Kill the player
     */
    public kill() {
        this.alive = false
    }

    /**
     * Revive the player
     */
    public revive() {
        this.alive = true
    }

    /**
     * Is the player alive
     * @returns {boolean} True if the player is alive, false otherwise
     */
    public isAlive(): boolean {
        return this.alive
    }

    /**
     * Get the points of the player
     * @returns {number} The points of the player
     */
    public getPoints(): number {
        return this.points
    }

    /**
     * Add points to the player
     * @param {number} points The points to add
     */
    public addPoints(points: number) {
        this.points += points
    }
}