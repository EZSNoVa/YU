import { Server } from 'socket.io';
import { connect, disconnect, get_room, get_uid, reset_room, room_exists, update_room } from './socket_db.js';
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
        socket.on('disconnect', async () => {
            await on_disconnect(socket);
        });
        // User connects to the room 
        socket.on("join room" /* Events.JOIN */, async (room_id, uid) => {
            socket.join(room_id);
            await connect(room_id, uid, socket.id);
            socket.broadcast.to(room_id).emit("player joined" /* Events.PLAYER_JOINED */, uid);
        });
        // Ping the other player
        socket.on("ping" /* Events.PING */, (room_id) => {
            socket.broadcast.to(room_id).emit("ping" /* Events.PING */);
        });
        socket.on("pong" /* Events.PONG */, (room_id) => {
            socket.broadcast.to(room_id).emit("pong" /* Events.PONG */);
        });
        // Get the room data -> used to get the room data when the user joins
        socket.on("get room" /* Events.GET_ROOM */, async (room_id, callback) => {
            const room = await get_room(room_id);
            callback(room); // Can't be null here. 
        });
        // Check if a room exists -> used to check if a room exists before joining
        socket.on("room exists" /* Events.ROOM_EXISTS */, async (room_id, callback) => {
            const exists = await room_exists(room_id);
            callback(exists);
        });
        // Update a room's value
        socket.on("update room" /* Events.UPDATE_ROOM */, async (room_id, new_room) => {
            await update_room(room_id, new_room);
        });
        // Reset a room's value
        socket.on("reset room" /* Events.RESET_ROOM */, async (room_id) => {
            await reset_room(room_id);
        });
    });
    io.on('disconnect', (socket) => {
        // User disconnects from the room
        socket.on('disconnect', async () => {
            await on_disconnect(socket);
        });
    });
    return io;
}
async function on_disconnect(socket) {
    // Get room id and the user id
    const room_id = socket.rooms.values().next().value;
    const uid = await get_uid(socket.id);
    // Remove the user from the room
    socket.broadcast.to(room_id).emit("player left" /* Events.PLAYER_LEFT */, uid);
    await disconnect(room_id, uid);
}
/**
 * Ensure that the socket is inside the room
 * @param socket
 * @param room
 */
function ensure_inside_room(socket, room) {
    if (!socket.rooms.has(room)) {
        socket.join(room);
    }
}
