import { Socket } from "socket.io";
import GameRoom from "./gameRoom";
import PowerUp from "./powerUp/powerUp";
import QuadTree from "./quadtree/quadtree";
import Circle from "./shape/circle";
import Dot from "./shape/dot";
import PlayerTail from "./shape/playerTail";
import { Tail } from "./tail";

export default class Player extends Circle {

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
    public tail: Tail = new Tail(this);

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
     * Game room of the player
     * define when the player join a game room
     */
    public gameroom!: GameRoom

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
        const lasPosition = this.getCenter()
        this.angle += this.direction * (this.inverted ? -1 : 1)

        //Add random holes in the line
        let invisible = false
        if (this.lineHoleTime == 0) {
            //TODO: remove magic number
            if (Math.random() < 1 / (5 * 128)) {
                this.lineHoleTime = 24
            }
        }
        else {
            invisible = true
            this.lineHoleTime--
        }

        this.gameroom.getBoard().remove(this)

        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        this.gameroom.getBoard().insert(this)

        if (invisible || this.invincible) return

        this.tail.addPart(new PlayerTail(lasPosition, this.getCenter(), this.lineWidth, this))
    }

    public detectCollision(quadtree: QuadTree) {
        if (this.x - this.radius < 0 || this.x + this.radius > this.gameroom.getBoard().bounds.width || this.y - this.radius < 0 || this.y + this.radius > this.gameroom.getBoard().bounds.height) {
            this.kill()
        }
        if (this.invincible) return false
        let circle = new Circle(this.getCenter(), this.radius)
        if (this.chucknorris) circle.radius += 10
        quadtree.query(circle).forEach((object) => {
            if (!this.isAlive()) return
            if (object instanceof Player) {
                if (object === this) return
                if (!object.isAlive()) return;
                if (!this.chucknorris) {
                    this.kill()
                    object.addPoints(1)
                    if (!object.chucknorris) {
                        object.kill()
                        this.addPoints(1)
                    }
                }
                else {
                    object.kill()
                    this.addPoints(1)
                    if (object.chucknorris) {
                        this.kill()
                        object.addPoints(1)
                    }
                }
            }
            else if (object instanceof PlayerTail) {
                if (object.player === this) {
                    //Chek for lastest part of the tail of the player
                    for (let i = this.tail.getParts().length - 1; i >= 0; i--) {
                        //while they are colliding we skip to the next part
                        if (circle.collide(this.tail.getParts()[i])) {
                            //the tail is just added to the player so the player didn't die 
                            if (this.tail.getParts()[i] === object) return
                        }
                        else {
                            //the object is not a fresh tail so the player die
                            break
                        }
                    }
                }

                if (this.chucknorris) {
                    object.player.tail.removePart(object.id)
                }
                else {
                    if (this === object.player) this.addPoints(-1)
                    else object.player.addPoints(1)
                    this.kill()
                }
            }
            else if (object instanceof PowerUp) {
                this.gameroom.getPowerUpManager().collide(this, object)
                this.gameroom.getBoard().remove(object)
            }
        })
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
    public setPositions(x: number, y: number): void;
    /**
     * Set the positions of the player
     * @param {Dot} center The center of the player
     */
    public setPositions(center: Dot): void;
    public setPositions(xOrCenter: number | Dot, y: number = 0): void {
        if (xOrCenter instanceof Dot) {
            this.setCenter(xOrCenter);
        } else {
            this.setCenter(xOrCenter, y);
        }
    }

    /**
     * Kill the player
     */
    public kill() {
        console.log('killed ' + this.name + ' !')
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
     * Get the position of the player
     * @returns {Circle} The position of the player
     */
    public getPosition(): Circle {
        return new Circle(this.getCenter(), this.radius)
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