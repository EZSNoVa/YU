export enum ResponseType {
    DO_IT = "DO_IT",
    PLUS_FOUR = "PLUS_FOUR",
    REVERSE = "REVERSE",
}

export type UID = string; // User ID -- unique identifier for each user. Generated by the user's client

export type RoomType = {
    id: string,
    creation_time: Date, // 
    jokers_used: number,
    used_responses: Record<ResponseType, number>, // {response: count}
    state: GameState | null, // Game state is created once both players join, if null game hasn't started, meaning both players are in waiting room
    members: UID[] // 2 members only
} 

export type GameState = {
    round: number,
    stage: 0 | 1 | 2,
    jokers: Record<UID, string[]>, // {username: [joker1, joker2, joker3]}. 
    judge_index: 0 | 1, // Index of the member that is the judge

    // Role related
    judge_data: {
        prompt: string,
        selected_joker: string,
        ready: boolean, // If the submitted
    }
    
    respondent_data: {
        response: ResponseType,
        selected_joker: string,
        ready: boolean,
    }
}
    
/**
 * Socket events.
 * @enum {string}
 * @readonly
 * Used to avoid typos and to have a single source of truth
 */
export const enum Events {
    CONNECT = "connect",
}