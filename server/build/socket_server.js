import { Server } from 'socket.io';
import { connect, room_exists } from './socket_db.js';
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
        socket.on("join room" /* Events.JOIN */, async (room_id, username) => {
            console.log("User connected to the room", room_id, username);
            await connect(room_id, username);
        });
        // Check if a room exists -> used to check if a room exists before joining
        socket.on("room exists" /* Events.ROOM_EXISTS */, async (room_id, callback) => {
            const exists = await room_exists(room_id);
            callback(exists);
        });
    });
}
