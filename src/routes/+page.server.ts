import { redirect, type Actions} from "@sveltejs/kit";
import { ws } from "$lib/websocket";
import { Events } from "$types";

export const actions = {
    // Create/join a room
    default: async ({ request, cookies, }) => {
        const data = await request.formData();

        const room_code = data.get('room code') as string;
        if (!room_code) {
            return { error: 'Room code is required' }
        }

        // This creates a new room (if it doesn't exist) and connects the user to it
        ws.emit(Events.JOIN, room_code, cookies.get("uid") as string);
        throw redirect(302, `/room/${room_code}`);
    }
} satisfies Actions;