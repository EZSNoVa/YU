<script lang="ts">
	import Countdown from '$components/Countdown.svelte';
	import { ws } from '$lib/websocket.js';
	import { Events, type GameState, type RoomType, type UID } from '$types';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let uid: UID;
	export let room: Writable<RoomType>;


	let room_code = $room.id;
	$: room_code = $room.id;

	let player_count = writable(1);
	const needed_players = 2;

	function update_room_state() {
		// Moe to stage 1 - round 1
		room.update((r) => {
			r.state = {
				round: 1,
				stage: 1
			} as unknown as GameState;

			return r;
		});
	}

	onMount(() => {
		ws.emit(Events.JOIN, room_code, uid);

		function ready() {
			clearInterval(ping_interval);
			player_count.set(2);
		}

		ws.on(Events.PING, () => {
			ws.emit(Events.PONG, room_code);
			// Wait 1 second for the pong (try to sync the players)
			setTimeout(() => {
				ready();
			}, 1000);
		});

		ws.on(Events.PONG, () => {
			ready();
		});

		let ping_interval = setInterval(() => {
			ws.emit(Events.PING, room_code);
		}, 1000);
	});
</script>

<!-- Wait room  -->
<main class="flex flex-col items-center justify-center h-screen">
	{#if $player_count == needed_players}
		<div class="flex flex-col items-center justify-center">
			<h1 class="text-2xl font-bold text-gray-500">Moving to the game...</h1>

			<div class="container p-4 m-4">
				<Countdown seconds={5} state={writable(true)} on_end={update_room_state} />
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center">
			<h1 class="text-2xl font-bold text-gray-500">
				Room: <span class="text-2xl font-bold text-gray-400">{room_code}</span>
			</h1>

			<h2 class="m-4 text-3xl font-bold text-gray-500">
				Players: <span class="text-3xl font-bold text-gray-400"
					>{$player_count}/{needed_players}</span
				>
			</h2>

			<div class="flex flex-col items-center justify-center mt-4">
				<h4 class="text-2xl font-bold text-gray-500">Waiting for players...</h4>
				<p class="text-gray-500">Share the code to invite your friends</p>
			</div>
		</div>
	{/if}
</main>

<footer class="absolute w-full text-center">
	<p class="text-sm text-gray-500">
		Made with <span class="text-red-500">&hearts;</span> by
		<a href="https://github.com/ezsnova/"><strong>NoVa</strong></a>
	</p>
</footer>
