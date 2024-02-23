import { Server, type ServerOptions } from 'socket.io';
import { connect } from './socket_db.js';
import { Events } from './types.js';

export default function injectSocketIO(server: ServerOptions) {
    server.maxHttpBufferSize = 1e6 // 10MB 

    const io = new Server(server, {
        cors: {
            allowedHeaders: '*',
            credentials: false,
            optionsSuccessStatus: 204,
        }
    });

    io.on('connection', (socket) => {
        // User connects to the room 
        socket.on(Events.CONNECT, async (room_id: string, username: string) => {
            await connect(room_id, username);
        });

    });
}
