import { Server, type ServerOptions } from 'socket.io';
import { connect, disconnect, get_room, get_uid, room_exists, update_room } from './socket_db.js';
import { Events, RoomType, type UID } from './types.js';

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
        socket.on('disconnect', async () => {
            await on_disconnect(socket);
        });

        // User connects to the room 
        socket.on(Events.JOIN, async (room_id: string, uid: UID) => {
            socket.join(room_id);
            await connect(room_id, uid, socket.id);
            socket.broadcast.to(room_id).emit(Events.PLAYER_JOINED, uid);
        });


        // Ping the other player
        socket.on(Events.PING, (room_id: string) => {
            socket.broadcast.to(room_id).emit(Events.PING);
        }); 

        socket.on(Events.PONG, (room_id: string) => {
            socket.broadcast.to(room_id).emit(Events.PONG);
        });

        // Get the room data -> used to get the room data when the user joins
        socket.on(Events.GET_ROOM, async (room_id: string, callback: (room: RoomType) => void) => {
            const room = await get_room(room_id);
            callback(room as RoomType); // Can't be null here. 
        });

        // Check if a room exists -> used to check if a room exists before joining
        socket.on(Events.ROOM_EXISTS, async (room_id: string, callback: (exists: boolean) => void) => {
            const exists = await room_exists(room_id);
            callback(exists);
        });

        // Update a room's value
        socket.on(Events.UPDATE_ROOM, async (room_id: string, new_room: RoomType) => {
            await update_room(room_id, new_room);
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
    socket.broadcast.to(room_id).emit(Events.PLAYER_LEFT, uid);

    await disconnect(room_id, uid as string);
}

/**
 * Ensure that the socket is inside the room
 * @param socket 
 * @param room 
 */
function ensure_inside_room(socket, room: string) {
    if (!socket.rooms.has(room)) {
        socket.join(room);
    }
}