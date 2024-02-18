import { createServer } from 'http';
import { Server } from "socket.io";
import GameServer from './gameServer';
import Player from './player';
const server = createServer();
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('servers', (callback) => {
        callback(GameServer.getAllRooms().map((s) => s.getInfos()))
    })

    socket.use((packet, next) => {
        console.log(packet)
        next()
    })
    socket.on('create', (name: string, callback) => {
        GameServer.createRoom(new Player(socket, name))
        callback(true)
    })

    socket.on('join', (id: string, name: string, callback) => {
        const server = GameServer.getAllRooms().find((s) => s.getID() === id)
        if (server && name) {
            callback(server.addPlayer(new Player(socket, name)))
        }
        else {
            callback(false)
        }
    })
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});