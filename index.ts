import { createServer } from 'http';
const server = createServer();
import { Server } from "socket.io";
import GameRoom from './gameRoom';
import Player from './player';
export const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const servers:GameRoom[] = [
    new GameRoom(),
    new GameRoom(),
    new GameRoom(),
]

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('servers',(callback)=>{
        callback(servers.map((s)=>s.getInfos()))
    })
    
    socket.on('join',(id:string,name:string,callback)=>{
        const server = servers.find((s)=>s.getID() === id)
        if(server && name){
            callback(server.addPlayer(new Player(socket,name)))
        }
        else{
            callback(false)
        }
    })
});





server.listen(5000, () => {
  console.log('listening on *:5000');
});