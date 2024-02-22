import Player from "./player";

declare module 'socket.io' {
    interface Socket {
        player: Player
    }
}
