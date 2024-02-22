import { Socket } from "socket.io";
import { Line } from "./type";
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
    private positions: Array<Line> = [];

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
     * line width of the player
     */
    private lineWidth: number = 3

    /**
     * Is the player alive
     */
    private alive: boolean = true

    /**
     * Points of the player
     */
    private points: number = 0

    /**
     * Time remaining before player is starting again to make a line
     */
    private lineHoleTime: number = 0

    /**
     * Speed of the player
     */
    private speed: number = 1

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
        const start = lastPosition.end

        //Add random holes in the line
        let invisible = false
        if (this.lineHoleTime == 0) {
            if (Math.random() < 1 / (5 * 128)) {
                this.lineHoleTime = 24
            }
        }
        else {
            invisible = true
            this.lineHoleTime--
        }

        this.positions.push(
            {
                invisible,
                color: this.color,
                stroke: this.lineWidth,
                start,
                end: {
                    x: start.x + Math.cos(this.angle) * this.speed,
                    y: start.y + Math.sin(this.angle) * this.speed
                }
            }
        )
    }

    /**
     * Check if the player collide with another player
     * @param player The player to check the collision with
     * @returns {boolean} True if the player collide with another player, false otherwise
     */
    public collide(player: Player) {
        let selfMargin = 0

        if (this === player) selfMargin = 3

        const x1 = this.positions.at(-1)!.start.x
        const y1 = this.positions.at(-1)!.start.y
        const x2 = this.positions.at(-1)!.end.x
        const y2 = this.positions.at(-1)!.end.y

        for (let index = 0; index < player.positions.length - selfMargin; index++) {
            if (player.positions.at(index)!.invisible) continue
            const x3 = player.getPositions().at(index)!.start.x
            const y3 = player.getPositions().at(index)!.start.y
            const x4 = player.getPositions().at(index)!.end.x
            const y4 = player.getPositions().at(index)!.end.y

            if (this.intersect(
                x1, y1, x2, y2,
                x3, y3, x4, y4
            )) return true
        }

        return false
    }

    /**
     * Check if the player intersect with a line
     * @param x1 The x position of the first point of the line
     * @param y1 The y position of the first point of the line
     * @param x2 The x position of the second point of the line
     * @param y2 The y position of the second point of the line
     * @param x3 The x position of the first point of the line to check the intersection with
     * @param y3 The y position of the first point of the line to check the intersection with
     * @param x4 The x position of the second point of the line to check the intersection with
     * @param y4 The y position of the second point of the line to check the intersection with
     */
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
     * @returns {Array<Line> } The positions of the player
     */
    public getPositions(): Array<Line> {
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
     * @param {number} x The x position of the player
     * @param {number} y The y position of the player
     */
    setPositions(x: number, y: number) {
        this.positions = [{
            start: {
                x,
                y
            },
            end: {
                x,
                y
            },
            invisible: false,
            color: this.color,
            stroke: this.lineWidth
        }];
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

    /**
     * Get the speed of the player
     * @returns {number} The speed of the player
     */
    public getSpeed(): number {
        return this.speed
    }

    /**
     * Set the speed of the player
     * @param {number} speed The speed of the player
     */
    public setSpeed(speed: number) {
        this.speed = speed
    }
}