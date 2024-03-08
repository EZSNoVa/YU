<script lang="ts">
	import { ws } from '$lib/websocket';
	import { Events, type RoomType, type UID } from '$types';
	import WaitingRoom from '$lib/views/waiting_room.svelte';
	import End from '$lib/views/end.svelte';
	import Stage_1 from '$lib/views/stage_1.svelte';
	import Stage_2 from '$lib/views/stage_2.svelte';
	import Stage_3 from '$lib/views/stage_3.svelte';
	import { writable } from 'svelte/store';

	/**
	 * State machine to travel between stages
	 *
	 * TRANSITIONS:
	 * * Ping Confirmation: A sends a PING to B, be sends a PONG to A and proceeds to next state, when A receives PONG proceeds to next state.
	 * * Start Time: Respondent sends START_TIME to Judge.
	 * * Both Ready: When done, A sends READY to B. B keeps track A's readyness. B sends READY to A and proceeds to next stage. A receives B's readyness and proceeds.
	 *
	 * STATES:
	 * * Waiting room -> [Ping Confirmation] -> Stage 1
	 * * Stage 1  -> [Start time] -> Stage 2
	 * * Stage 2 -> [Both ready] -> Stage 3
	 * * Stage -> [Both ready] -> round > 10 ? END else Stage 1 and round++
	 *
	 * Each round must travel through Stage 1-3
	 */
	export let data;
	const uid: UID = data.uid;
	const room_code: string = data.room_code;

	let room = writable({
		id: room_code,
		state: { round: 0 }
	} as RoomType);

	ws.emit(Events.GET_ROOM, room_code, (_room: RoomType) => {
		room.set(_room);
	});

	ws.emit(Events.JOIN, room_code, uid);

	// Get room data
</script>

{#if $room.state.round == 0}
	<WaitingRoom {room} {uid} />
{:else if $room.state.round > 10}
	<End />
{:else if $room.state.stage == 1}
	<Stage_1 uid={data.uid} {room} />
{:else if $room.state.stage == 2}
	<Stage_2 />
{:else if $room.state.stage == 3}
	<Stage_3 />
{/if}
