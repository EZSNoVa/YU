import { ws } from "$lib/websocket";
import { Events } from "$types";
import type { RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ params }) => {
    let code = params.code;

    ws.emit(Events.RESET_ROOM, code);

    return new Response("Reseted", { status: 200 });

}