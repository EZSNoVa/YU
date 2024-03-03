import { ws } from "$lib/websocket";
import { Events }  from "$types";
import type { LayoutServerLoad } from "../$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ params, cookies }) => {

    // Check that code exist and is a existing room
    if (!params.code) {
        throw redirect(302, "/");
    }
    ws.emit(Events.ROOM_EXISTS, params.code, (exists: boolean) => {
        if (!exists) {
            throw redirect(302, "/");
        }
    });

    // Make sure user is connected to the room
    ws.emit(Events.JOIN, params.code, cookies.get("uid") as string);
};