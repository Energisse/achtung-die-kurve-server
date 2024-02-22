import { Socket } from "socket.io";
import Circle from "./shape/circle";
import { Tail } from "./tail";
import Line from "./shape/line";
import Dot from "./shape/dot";
export default class Player extends Circle {

    /**
     * Socket of the player
     */
    private socket: Socket;

    /**
     * Name of the player
     */
    private name: string;

    /**
     * tail of the player
     */
    private tail: Tail = new Tail();

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
        super(0, 0, 3)
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
    public tick(tick: number) {
        const lastX = this.x
        const lastY = this.y

        this.angle += this.direction

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

        this.x = this.x + Math.cos(this.angle) * this.speed
        this.y = this.y + Math.sin(this.angle) * this.speed

        if (invisible) return

        this.tail.addPart(new Line(new Dot(lastX, lastY), new Dot(this.x, this.y)))
    }

    /**
     * Check if the player collide with another player
     * @param player The player to check the collision with
     * @returns {boolean} True if the player collide with another player, false otherwise
     */
    public collide(player: Player): boolean {
        let selfMargin = 0
        if (this !== player && super.collide(player)) return true

        if (this === player) selfMargin = 100

        for (let i = 0; i < player.tail.getParts().length - selfMargin; i++) {
            if (super.collide(player.tail.getParts().at(i)!)) {
                console.log(player.tail.getParts().at(i))
                console.log(player.getPosition())
                return true
            }
        }

        return false
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
        this.x = x
        this.y = y
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

    /**
     * Get the tail of the player
     * @returns {Tail} The tail of the player
     */
    public getTail(): Tail {
        return this.tail
    }

    /**
     * Get the position of the player
     * @returns {Circle} The position of the player
     */
    public getPosition(): Circle {
        return new Circle(this.x, this.y, this.radius);
    }

    /**
     * Remove the tail of the player 
     */
    public removeTail() {
        this.tail = new Tail()
    }

}