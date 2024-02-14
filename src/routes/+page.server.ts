import type { Actions } from "@sveltejs/kit";
import { ws } from "$lib/websocket";
import { v4 as uuid } from "uuid";
import type { PageServerLoad } from "./$types";

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

        const room_code = data.get('room code') as string;
        if (!room_code) {
            return { error: 'Room code is required' }
        }
    },

    // Join a room
    join: async ({ request, cookies, }) => {
        const data = await request.formData();

        const room_code = data.get('room code') as string;
        if (!room_code) {
            return { error: 'Room code is required' }
        }
    }
} satisfies Actions;