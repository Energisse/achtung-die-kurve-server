import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import GameServer from './gameServer';
import Player from './player';
import path from 'path';

const app = express();
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname ,'/../build')));

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
        console.log('create')
        socket.player = new Player(name,socket)
        GameServer.createRoom(socket)
        socket.removeAllListeners('create')
        socket.removeAllListeners('join')
        console.log('room created')
        callback(true)
    })

    socket.on('join', (id: string, name: string, callback) => {
        socket.player = new Player(name,socket)
        const server = GameServer.getAllRooms().find((s) => s.getID() === id)
        if (server && name) {
            callback(server.getPlayerManager().addPlayer(socket))
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

app.get('/', (req, res) => {
    console.log(path.join(__dirname ,'/../build/index.html'))
    res.sendFile(path.join(__dirname ,'/../build/index.html'));
})

export default server