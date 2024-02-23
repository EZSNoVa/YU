import { Server } from 'socket.io';
import { connect } from './socket_db.js';
export default function injectSocketIO(server) {
    server.maxHttpBufferSize = 1e6; // 10MB 
    const io = new Server(server, {
        cors: {
            allowedHeaders: '*',
            credentials: false,
            optionsSuccessStatus: 204,
        }
    });
    io.on('connection', (socket) => {
        // User connects to the room 
        socket.on("connect" /* Events.CONNECT */, async (room_id, username) => {
            await connect(room_id, username);
        });
    });
}
