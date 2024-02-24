
import { RoomType, UID } from "./types.js";
import { MongoClient, ServerApiVersion } from 'mongodb';
import "dotenv/config";

// Database URI and name
const DB_URI = process.env.DB_URI;
const DB_NAME = "rooms"
const COLLECTION = "room";

if (!DB_URI) {
    throw new Error("Database URI is not set");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 100,
});

client.connect();

const db = client.db(DB_NAME);
const collection = db.collection<RoomType>(COLLECTION);

/**
 * Connect a user to the room
 * - If the room does not exist, create a new room
 * - If the room exists, add the user to the room
 */
export async function connect(room_id: string, uid: UID) {
    let room = await collection.findOne({ id : room_id }) as RoomType;
    if (!room) {
        // Create a new room
        room = {
            id: room_id,
            creation_time: new Date(),
            jokers_used: 0,
            used_responses: {
                "DO_IT": 0,
                "PLUS_FOUR": 0,
                "REVERSE": 0,
            },
            state: null, 
            members: [uid],
        }

        await collection.insertOne(room);
        return room;        
    }
    else {
        // Add the user to the room
        room.members.push(uid);
        await collection.updateOne({ id: room_id }, { $set: { members: room.members } });
        return room;
    }
}

export async function disconnect(room_id: string, uid: UID) {
    let room = await collection.findOne({ id : room_id }) as RoomType;
    if (!room) {
        return;
    }
    else {
        // Remove the user from the room
        room.members = room.members.filter(member => member !== uid);
        await collection.updateOne({ id: room_id }, { $set: { members: room.members } });
        return room;
    }
}
/**
 * Check if a room exists. If the room has been existing for more than 24 hours, delete it and return false
 * If the room is in round 10, delete it and return false
 * @param {string} room_id - Room ID
 * @returns {Promise<boolean>} - True if the room exists, false otherwise
 */
export async function room_exists(room_id: string): Promise<boolean> {
    let room = await collection.findOne({ id : room_id }, { projection: {
        creation_time: 1,
        state: {
            round: 1
        }
    } }) as RoomType;
    
    if (!room) {
        return false;
    }

    // Check if the room has been existing for more than 24 hours
    const creation_time = room.creation_time;
    const now = new Date();
    const diff = now.getTime() - creation_time.getTime();
    const diff_hours = diff / (1000 * 60 * 60);
    if (diff_hours > 24) {
        await collection.deleteOne({ id: room_id });
        return false;
    }

    // Check if the room is in round 10
    if (room.state?.round === 10) {
        await collection.deleteOne({ id: room_id });
        return false;
    }
    
    return true;
}