import Player from "./player";

declare module 'socket.io' {
    interface Socket {
        player: Player
    }
}

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: string;
      }
    }
  }
  