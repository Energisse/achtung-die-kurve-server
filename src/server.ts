import { createServer } from 'http';
import { Server } from "socket.io";
import GameServer from './gameServer';
import Player from './player';

const server = createServer();
export const io = new Server(server, {
    cors: {
        origin: "*",
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
        socket.player = new Player(name)
        GameServer.createRoom(socket)
        socket.removeAllListeners('create')
        socket.removeAllListeners('join')
        console.log('room created')
        callback(true)
    })

    socket.on('join', (id: string, name: string, callback) => {
        socket.player = new Player(name)
        const server = GameServer.getAllRooms().find((s) => s.getID() === id)
        if (server && name) {
            callback(server.addPlayer(socket))
            socket.removeAllListeners('create')
            socket.removeAllListeners('join')
        }
        else {
            callback(false)
        }
    })

    socket.on('ping', (callback) => {
        callback()
    });
});

export default server