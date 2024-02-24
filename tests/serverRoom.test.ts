import dotenv from "dotenv";
dotenv.config();
import { io } from "socket.io-client";
import server from "../src/server";
import GameServer from "../src/gameServer";

const client = io('http://localhost:5000', {
    autoConnect: false
})
const client2 = io('http://localhost:5000', {
    autoConnect: false
})

describe('Server rooms', () => {
    beforeAll((done) => {
        server.listen(process.env.PORT, () => {
            done()
        });
    });

    beforeEach(() => {
        client.connect()
        client2.connect()
    })

    afterEach(() => {
        client.disconnect()
        client2.disconnect()
    })

    test('No room at start', () => {
        expect(GameServer.getAllRooms().length).toBe(0)
    })

    test('Can create room', () => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            expect(GameServer.getAllRooms().length).toBe(1)
            expect(GameServer.getAllRooms().length).toBe(0)
        })
    });

    test('Can join room', () => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            expect(GameServer.getAllRooms().length).toBe(1)
        })
        client2.emit('join', GameServer.getAllRooms().at(0)?.getID(), 'thomas', (res: boolean) => {
            expect(res).toBe(true)
            expect(GameServer.getAllRooms().length).toBe(1)
        })
    });

    test("Alban est méchant", () => {
        expect(true).toBe(true)
    })

    afterAll((done) => {
        server.close(done)
    });
})