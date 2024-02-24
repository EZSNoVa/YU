import { redirect, type Actions, type Cookies } from "@sveltejs/kit";
import { v4 as uuid } from "uuid";
import type { PageServerLoad } from "./$types";
import { ws } from "$lib/websocket";
import { Events } from "$lib/types";

export const load: PageServerLoad = async ({ cookies }) => {
    /**
     * Check if user has already provided a username
     * At cookies there should be:
     * - uid -> User uid 
     * - username -> User username 
     */
    if (!cookies.get("uid")) {
        cookies.set("uid", uuid(), {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production"
        });
    }

    const username = cookies.get("username");
    return { username };
}

export const actions = {
    // Create a room
    create: async ({ request, cookies, }) => {
        const data = await request.formData();

        const username = data.get('username') as string;
        if (!username) {
            return { error: 'Username is required' }
        }

        save_username(cookies, username);

        const room_code = data.get('room code') as string;
        if (!room_code) {
            return { error: 'Room code is required' }
        }

        // This creates a new room (if it doesn't exist) and connects the user to it
        ws.emit(Events.JOIN, room_code, cookies.get("uid") as string);

        throw redirect(302, `/room/${room_code}`);
    },

    // Join a room
    join: async ({ request, cookies, }) => {
        const data = await request.formData();

        const username = data.get('username') as string;
        if (!username) {
            return { error: 'Username is required' }
        }

        save_username(cookies, username);

        const room_code = data.get('room code') as string;
        if (!room_code) {
            return { error: 'Room code is required' }
        }

        // This creates a new room (if it doesn't exist) and connects the user to it
        ws.emit(Events.JOIN, room_code, cookies.get("uid") as string);
    
        throw redirect(302, `/room/${room_code}`);
    }
} satisfies Actions;


function save_username(cookies: Cookies, username: string) {
    cookies.set("username", username, {
        path: "/",
        secure: process.env.NODE_ENV === "production"
    });
}