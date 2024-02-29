import { io } from "socket.io-client";
import server from "../src/server";
import GameServer from "../src/gameServer";
import waitForExpect from "wait-for-expect";
import { GameRoomStatus } from "../src/gameRoom";

const client = io('http://localhost:' + process.env.PORT, {
    autoConnect: false
})
const client2 = io('http://localhost:' + process.env.PORT, {
    autoConnect: false
})

describe('Server rooms', () => {
    beforeAll((done) => {
        server.listen(process.env.PORT, () => {
            done()
        });
    });

    afterAll(async () =>  server.close());
    

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

    test('Can create room', (done) => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            expect(GameServer.getAllRooms().length).toBe(1)
            expect(GameServer.getAllRooms().at(0)?.getModerator().getID()).toBe(client.id)
            done();
        })
    });

    test('Can join room', (done) => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            expect(GameServer.getAllRooms().length).toBe(1)
            expect(GameServer.getAllRooms().at(0)?.getModerator().getID()).toBe(client.id)
            client2.emit('join', GameServer.getAllRooms().at(0)?.getID(), 'thomas', (res: boolean) => {
                expect(res).toBe(true)
                expect(GameServer.getAllRooms().length).toBe(1)
                expect(GameServer.getAllRooms().at(0)?.getModerator().getID()).toBe(client.id)
                done()
            })
        })
    });

    test('Leave room on disconnect', (done) => {
        client.emit('create', 'alban', async (res: boolean) => {
            expect(res).toBe(true)
            client.disconnect()
            await waitForExpect(() => {
                expect(GameServer.getAllRooms().length).toBe(0)
            })
            done()
        })
    });

    test('Moderator change room on disconnect', (done) => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            client2.emit('join', GameServer.getAllRooms().at(0)?.getID(), 'thomas', async (res: boolean) => {
                expect(res).toBe(true)
                client.disconnect()
                await waitForExpect(() => {
                    expect(GameServer.getAllRooms().length).toBe(1)
                    expect(GameServer.getAllRooms().at(0)?.getModerator().getID()).toBe(client2.id)
                })
                done()
            })
        })
    });

    test('Can start game', (done) => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            client2.emit('join', GameServer.getAllRooms().at(0)?.getID(), 'thomas', (res: boolean) => {
                expect(res).toBe(true)
                client.emit('start', (res: boolean) => {
                    expect(res).toBe(true)
                    expect(GameServer.getAllRooms().at(0)?.isStarted()).toBe(true)
                    done()
                })
            })
        })
    });

    test('Cannot start game if not moderator', (done) => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            client2.emit('join', GameServer.getAllRooms().at(0)?.getID(), 'thomas', (res: boolean) => {
                expect(res).toBe(true)
                client2.emit('start', (res: boolean) => {
                    expect(res).toBe(false)
                    expect(GameServer.getAllRooms().at(0)?.isStarted()).toBe(false)
                    done()
                })
            })
        })
    });

    test('Cannot start game if less than 2 players', (done) => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            client.emit('start', (res: boolean) => {
                expect(res).toBe(false)
                expect(GameServer.getAllRooms().at(0)?.isStarted()).toBe(false)
                done()
            })
        })
    });

    test("Stop a started game on disconnect", (done) => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            client2.emit('join', GameServer.getAllRooms().at(0)?.getID(), 'thomas', (res: boolean) => {
                expect(res).toBe(true)
                client.emit('start', (res: boolean) => {
                    expect(res).toBe(true)
                    client.disconnect()
                    client2.disconnect()
                    setTimeout(() => {
                        expect(GameServer.getAllRooms()).toHaveLength(0)
                        done()
                    }, 100)
                })
            })
        })
    });

    test("Pause a started game", (done) => {
        client.emit('create', 'alban', (res: boolean) => {
            expect(res).toBe(true)
            client2.emit('join', GameServer.getAllRooms().at(0)?.getID(), 'thomas', (res: boolean) => {
                expect(res).toBe(true)
                client.emit('start', (res: boolean) => {
                    expect(res).toBe(true)
                    expect(GameServer.getAllRooms().at(0)?.getStatus()).toBe(GameRoomStatus.PLAYING)
                    client.emit('pause', (res: boolean) => {
                        expect(res).toBe(GameRoomStatus.PAUSED)
                        expect(GameServer.getAllRooms().at(0)?.getStatus()).toBe(GameRoomStatus.PAUSED)
                        client.emit('pause', (res: boolean) => {
                            expect(res).toBe(GameRoomStatus.PLAYING)
                            expect(GameServer.getAllRooms().at(0)?.getStatus()).toBe(GameRoomStatus.PLAYING)
                            done()
                        })
                    })
                })
            })
        })
    })


    test("Alban est méchant", () => {
        expect(true).toBe(true)
    })
})