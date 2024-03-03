import type { LayoutServerLoad } from "./$types";
import { v4 as uuid } from "uuid";

export const load: LayoutServerLoad = async ({ cookies }) => {
    /**
     * Check if user has already provided a username
     * At cookies there should be:
     * - uid -> User uid 
     * - username -> User username 
     */
    if (!cookies.get("uid")) {
        cookies.set("uid", uuid(), {
            path: "/",
            secure: process.env.NODE_ENV === "production"
        });
    }

}