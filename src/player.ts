import { Socket } from "socket.io";
import Circle from "./shape/circle";
import { Tail } from "./tail";
import Line from "./shape/line";
import Dot from "./shape/dot";

export default class Player extends Circle{

    /**
     * Socket of the player
     */
    private socket: Socket

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
     * If the player's controls are inverted
     */
    private inverted: boolean = false

    /**
     * If the player is invincible (can't die from collision with other player's lines but no tail is added to the player's tail)
     */
    private invincible: number = 0

    /**
     * If the player is chuck norris (can't die from collision with other player (except if they are chuck norris too) and if they collide with a line, the line is destroyed) 
     */
    private chucknorris: number = 0

    /**
     * Constructor of the player
     * @param {Socket} socket The socket of the player
     * @param {string} name The name of the player
     */
    constructor(name: string, socket: Socket) {
        super(new Dot(0, 0), 3)
        this.socket = socket
        this.name = name
    }

    /**
     * Update the position of the player
     */
    public tick(tick: number) {
        const lastX = this.x
        const lastY = this.y

        this.angle += this.direction * (this.inverted  ? -1 : 1)

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

        if (invisible || this.invincible) return

        this.tail.addPart(new Line(new Dot(lastX, lastY), new Dot(this.x, this.y), this.lineWidth))
    }

    /**
     * Check if the player collide with another player
     * @param player The player to check the collision with
     * @returns {boolean} True if the player collide with another player, false otherwise
     */
    public collide(player: Player): boolean {
        if(this.invincible) return false

        let selfMargin = 0

        if (this !== player && super.collide(player)){
            //If the other player is chuck norris
            if(player.chucknorris) return true
            //If the player is chuck norris and the other player is not
            if(this.chucknorris) return false
            //They are not chuck norris
            return true
        }

        if (this === player) selfMargin = 100

        if(this.chucknorris){
            let collided:number[] = []
            //TODO: enhance this
            const margin = 10
            this.radius += margin
            for (let i = 0; i < player.tail.getParts().length - selfMargin; i++) {
                if (super.collide(player.tail.getParts().at(i)!)) {
                    collided.push(i)
                }
            }
            this.radius -= margin
            if(collided.length == 0) return false
            this.socket.emit('tail:Removed', {
                player: player.getID(),
                parts: collided
            })
            player.tail.removeParts(collided)
            return false
        }

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
    public setPositions(x: number, y: number) {
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
        return new Circle(new Dot(this.x, this.y), this.radius);
    }

    /**
     * Remove the tail of the player 
     */
    public removeTail() {
        this.tail = new Tail()
    }

    /**
     * Set the direction of the player
     * @param {number} direction The direction of the player
     */
    public setDirection(direction: number) {
        this.direction = direction
    }

    /**
     * Get the id of the player
     * @returns {string} The id of the player
     */
    public getID() {
        return this.socket.id
    }

    /**
     * Get the radius of the player
     * @returns 
     */
    public getRadius() {
        return this.radius
    }   

    /**
     * Set the radius of the player
     * @param radius 
     */
    public setRadius(radius: number) {  
        this.radius = radius
    }

    /**
     * Get the socket of the player
     * @returns 
     */
    public getSocket() {
        return this.socket
    }

    /**
     * Get the inverted of the player
     * @returns
     */
    public getInverted() {
        return this.inverted
    }

    /**
     * Set the inverted of the player
     * @param inverted 
     */
    public setInverted(inverted: boolean) {
        this.inverted = inverted
    }

    /**
     * Get the angle of the player
     * @returns 
     */
    public getAngle() {
        return this.angle
    }

    /**
     * Set the angle of the player
     * @param angle 
     */
    public setAngle(angle: number) {
        this.angle = angle
    }

    /**
     * Get the line width of the player
     * @returns 
     */
    public getLineWidth() {
        return this.lineWidth
    }

    /**
     * Set the line width of the player
     * @param lineWidth 
     */
    public setLineWidth(lineWidth: number) {
        this.lineWidth = lineWidth
    }

    /**
     * Get the invincible of the player
     * @returns 
     */
    public getInvincible() {
        return this.invincible
    }

    /**
     * Set the invincible of the player
     * @param invincible 
     */
    public setInvincible(invincible: number) {
        this.invincible = invincible
    }

    /**
     * Get the chuck norris of the player
     * @returns 
     */
    public getChuckNorris() {
        return this.chucknorris
    }

    /**
     * Set the chuck norris of the player
     * @param chucknorris 
     */
    public setChuckNorris(chucknorris: number) {
        this.chucknorris = chucknorris
    }
}