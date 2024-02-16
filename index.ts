import { createServer } from 'http';
const server = createServer();
import { Server } from "socket.io";
import GameRoom from './gameRoom';
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
    
    socket.on('join',(id:string,callback)=>{
        const server = servers.find((s)=>s.getID() === id)
        if(server){
            callback(server.addPlayer(socket))
        }
        else{
            callback(false)
        }
    })
});





server.listen(5000, () => {
  console.log('listening on *:5000');
});