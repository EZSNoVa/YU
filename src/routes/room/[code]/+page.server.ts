import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const room_code = params.code as string; // Already veried by layout
    
    return {
        room_code,
        uid: cookies.get("uid") as string
    }

}