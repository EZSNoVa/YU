import type { Writable } from "svelte/store";

/**
 * Socket events.
 * Read `/server/sockets.md` for more info.
 * @enum {string}
 * @readonly
 * Used to avoid typos and to have a single source of truth
 */
export const enum Events {
    CONNECT = "connect",
}

export type ToastType = Writable<{
    type: "error" | "info";
    title: string;
    message: string;
    duration?: number;
} | null>;
