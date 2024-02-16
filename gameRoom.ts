import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import {io} from './index'

export default class GameRoom{

    /**
     * Unique identifier
     */
    private id = uuidv4()

    /**
     * Array of players
     */
    private player: Socket[] = []

    /**
     * Max number of players
     */
    private maxPlayers = 5

    /**
     * Date of creation
     */
    private created = new Date()

    constructor(){
    }

    public isFull():boolean{
        return this.player.length >= this.maxPlayers
    }
    
    public addPlayer(socket:Socket):boolean{
        if(this.isFull())return false
        this.player.push(socket)
        socket.on('disconnect', () => {
            this.removePlayer(socket)
            io.to(this.id).emit('room',this.player.length)
        });
        socket.join(this.id);
        io.to(this.id).emit('room',this.player.length)
        socket.on('room',(callback)=>{
            callback(this.player.length)
        });
        return true
    }

    public removePlayer(socket:Socket){
        this.player = this.player.filter((p)=>p.id !== socket.id)
    }

    public getPlayers(){
        return this.player
    }

    public getInfos(){
        return {
            id: this.id,
            players: this.player.length,
            maxPlayers: this.maxPlayers,
            created: this.created
        }
    }

    public getID(){
        return this.id
    }
}