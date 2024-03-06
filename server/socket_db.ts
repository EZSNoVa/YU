import { GameState, RoomType, UID } from './types.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

// Database URI and name
const DB_URI = process.env.DB_URI;
const DB_NAME = 'rooms';
const COLLECTION = 'room';

if (!DB_URI) {
	throw new Error('Database URI is not set');
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	},
	maxPoolSize: 100
});

client.connect();

const db = client.db(DB_NAME);
const collection = db.collection<RoomType>(COLLECTION);
const map_collection = db.collection('socket_map'); // Collection to map uid -> socket_id

/**
 * Save the mapping between the user id and the socket id to later be able to retrieve uid from socket id
 */
async function save_map(uid: UID, socket_id: string | null) {
	// If more than 20 records on the map, 10 oldest records are deleted
	const count = await map_collection.countDocuments();

	if (count > 20) {
		const cursor = map_collection.find().sort({ _id: 1 }).limit(10);
		const to_delete = await cursor.toArray();
		const ids = to_delete.map((doc) => doc._id);
		await map_collection.deleteMany({ _id: { $in: ids } });
	}

	if (await map_collection.findOne({ uid })) {
		await map_collection.updateOne({ uid }, { $set: { socket_id } });
	} else {
		await map_collection.insertOne({ uid, socket_id });
	}
}

/**
 * Get the user id from the socket id
 */
export async function get_uid(socket_id: string): Promise<UID | null> {
	const map = await map_collection.findOne({ socket_id }, { projection: { uid: 1 } });
	return map?.uid || null;
}

/**
 * Connect a user to the room
 * - If the room does not exist, create a new room
 * - If the room exists, add the user to the room
 */
export async function connect(room_id: string, uid: UID, socket_id: string) {
	await save_map(uid, socket_id);

	let room = (await collection.findOne({ id: room_id })) as RoomType;
	if (!room) {
		// Create a new room
		room = {
			id: room_id,
			creation_time: new Date(),
			jokers_used: 0,
			used_responses: {
				DO_IT: 0,
				PLUS_FOUR: 0,
				REVERSE: 0
			},
			state: null,
			members: [uid]
		};

		await collection.insertOne(room);
		return room;
	} else {
		// Add the user to the room if the user is not already in the room
		if (room.members.includes(uid)) {
			return room;
		}
		room.members.push(uid);
		await collection.updateOne({ id: room_id }, { $set: { members: room.members } });
		return room;
	}
}

export async function disconnect(room_id: string, uid: UID) {
	// Remove the user from uid -> socket_id map
	await save_map(uid, null);

	let room = (await collection.findOne({ id: room_id })) as RoomType;
	if (!room) {
		return;
	} else {
		// Remove the user from the room
		room.members = room.members.filter((member) => member !== uid);
		await collection.updateOne({ id: room_id }, { $set: { members: room.members } });
		return room;
	}
}
/**
 *
 * Check if a room exists. If the room has been existing for more than 24 hours, delete it and return false
 * If the room is in round 10, delete it and return false
 * @param {string} room_id - Room ID
 * @returns {Promise<boolean>} - True if the room exists, false otherwise
 */
export async function room_exists(room_id: string): Promise<boolean> {
	let room = (await collection.findOne(
		{ id: room_id },
		{
			projection: {
				creation_time: 1,
				state: {
					round: 1
				}
			}
		}
	)) as RoomType;

	if (!room) {
		return false;
	}

	// Check if the room has been existing for more than 24 hours
	const creation_time = room.creation_time;
	const now = new Date();
	const diff = now.getTime() - (new Date(creation_time)).getTime();
	const diff_hours = diff / (1000 * 60 * 60);
	if (diff_hours > 24 || room.state?.round === 10) {
		await collection.deleteOne({ id: room_id });
		return false;
	}
	return true;
}

export async function get_room(room_id: string): Promise<RoomType | null> {
	return (await collection.findOne({ id: room_id }, { projection: { _id: 0 } })) as RoomType;
}

export async function update_room(room_id: string, new_room: RoomType) {
	if ((await get_room(room_id)) != new_room) {
		await collection.updateOne(
			{ id: room_id },

			// Update the room state.jokers should be "append" not "set". All other fields should be "set"
			{
				$set: {
					creation_time: new_room.creation_time,
					jokers_used: new_room.jokers_used,
					used_responses: new_room.used_responses,
					members: new_room.members,
                    state: new_room.state
				},
			}
		);
	}
}

/**
 * Reset a rooms value (State and metrics) while maintaining members and id (meta data)
 * @param room_id
 */
export async function reset_room(room_id: string) {
	await collection.updateOne(
		{ id: room_id },
		{
			$set: {
				jokers_used: 0,
				used_responses: {
					DO_IT: 0,
					PLUS_FOUR: 0,
					REVERSE: 0
				},
				state: null
			}
		}
	);
}
