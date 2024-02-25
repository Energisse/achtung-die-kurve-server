import { v4 as uuidv4 } from 'uuid';
import GameServer from './gameServer';
import { io } from './server';
import Player from "./player";
import PowerUp from './powerUp/powerUp';
import SpeedPowerUp from './powerUp/speedPowerUp';
import Circle from './shape/circle';
import Line from './shape/line';
import { Socket } from 'socket.io';
import PowerUpManager from './powerUp/powerUpManager';

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
    private static staticTickRate = 64

    /**
     * Width of the room
     */
    private width = 1000

    /**
     * Height of the room
     */
    private height = 1000

    /**
     * Interval of the game
     */
    private interval: NodeJS.Timeout | null = null

    /**
     * power up manager
     */
    private powerUpManager: PowerUpManager = new PowerUpManager()

    /**
     * Current tick
     */
    private currentTick = 0

    /**
     * Constructor of the room
     * @param {Player} moderator The moderator of the room
     */ 

    constructor(socketPlayer: Socket) {
        this.moderator = socketPlayer.player
        this.addPlayer(socketPlayer)

        this.powerUpManager.on('powerUp:Added', ({x,y,radius,id,type,other}: PowerUp) => {
            console.log('powerUp:Added', {x,y,radius,id})
            io.to(this.id).emit('powerUp:Added', {x,y,radius,id,type,other})
        })

        this.powerUpManager.on('powerUp:Removed', (powerUp: PowerUp[]) => {
            console.log('powerUp:Removed', powerUp.map(({id}) => (id)))
            io.to(this.id).emit('powerUp:Removed', powerUp.map(({id}) => (id)))
        })
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
    public addPlayer(socketPlayer: Socket): boolean {
        const player = socketPlayer.player

        //Check if the room is full
        if (this.isFull()) return false
        //Set the color of the player
        player.setColor(this.static.filter((c) => !this.players.find((p) => p.getColor() === c))[0])

        this.players.push(player)
        //Manage player disconnection
        socketPlayer.on('disconnect', () => {
            this.removePlayer(player)
            io.to(this.id).emit('leaderboard', this.getPlayerInfos())
        });

        socketPlayer.join(this.id);

        io.to(this.id).emit('leaderboard', this.getPlayerInfos())
        socketPlayer.on('leaderboard', (callback) => {
            callback(this.getPlayerInfos())
        });

        socketPlayer.on('direction', (msg) => {
            switch (msg) {
                case 'left':
                    player.setDirection(-0.05)
                    break;
                case 'right':
                    player.setDirection(0.05)
                    break;
                case 'forward':
                    player.setDirection(0)
                    break;
                default:
                    break;
            }
        })

        socketPlayer.on('start', () => {
            //Check if the game is already started
            if (this.interval) return

            //Check if there are enough players
            if (this.players.length < 2) return

            //Check if the player is the moderator
            if (this.moderator !== player) return

            this.startGame()
        })
        return true
    }

    /**
     * Start the game
     */
    private startGame() {
        this.currentTick = 0
        io.to(this.id).emit('start')
        this.powerUpManager.reset()

        this.players.forEach((p) => {
            p.removeTail()
            p.revive()
            const x = Math.random() * this.width
            const y = Math.random() * this.height
            p.setPositions(x, y)
        })
        this.interval = setInterval(() => {
            this.tick()
        }, 1000 / GameRoom.staticTickRate)
    }

    /**
     * Send the new positions of the players to the clients
     */
    private tick() {
        this.currentTick++;
        
        this.powerUpManager.tick(this.currentTick,this.players)
      
        const newPositions: Array<{
            position: Circle
            newTail?: Line
            color: string
        } | null> = []

        let killed: number = 0

        this.players.forEach((player) => {
            if (!player.isAlive()) {
                newPositions.push(null);
                return
            }
            player.tick(this.currentTick);

            const newTail = player.getTail().getParts().at(-1);
            const tickPlayer: {
                newTail?: Line
                position: Circle
                color: string
            } = {
                position: player.getPosition(),
                color: player.getColor()
            }

            if (newTail?.p2.x === player.getPosition().x && newTail?.p2.y === player.getPosition().y) {
                tickPlayer.newTail = newTail
            }
            newPositions.push(tickPlayer)


            let collision = false
            if (player.getPosition().x-player.getRadius() < 0 || player.getPosition().x+player.getRadius() > this.width || player.getPosition().y-player.getRadius() < 0 || player.getPosition().y+player.getRadius() > this.height) {
                console.log(player.getName(), "collide with the wall")
                collision = true
            }
            else {
                for (let opponent of this.players) {
                    if (player.collide(opponent)) {
                        console.log(player.getName(), "collide with", opponent.getName())
                        collision = true
                        if (opponent !== player) opponent.addPoints(1)
                        else opponent.addPoints(-1)
                        killed++
                        player.kill()

                        break
                    }
                }
            }

            if (collision) {
                player.kill()
                killed++
            }

        })
        if (killed) {
            this.players.forEach((p) => {
                if (p.isAlive()) p.addPoints(1)
            });
            io.to(this.id).emit('leaderboard', this.getPlayerInfos())
        }
        io.to(this.id).emit("tick", newPositions)

        if (this.players.filter((p) => p.isAlive()).length < 2) {
            clearInterval(this.interval!)
            setTimeout(() => {
                this.startGame()
            }, 3000)
            io.emit("end")
        }
    }

    /**
     * Remove a player from the room
     * @param {Player} player The player to remove 
     */
    public removePlayer(player: Player) {
        this.players = this.players.filter((p) => p === player)
        if (this.players.length === 0) return GameServer.removeRoom(this.id)
        else if (this.moderator === player) this.moderator = this.players[0]
    }

    private getPlayerInfos() {
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

    /**
     * Get the tick rate of the room 
     * @returns {number} The tick rate of the room 
     */
    public static getTickRate() {
        return this.staticTickRate
    }

}