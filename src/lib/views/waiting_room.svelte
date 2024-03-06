<script lang="ts">
	import Countdown from '$components/Countdown.svelte';
	import { ws } from '$lib/websocket.js';
	import { Events, Jokers, type GameState, type RoomType} from '$types';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let data: {
		room_code: string,
		uid: string
	};
	export let room: Writable<RoomType>; 

	let player_count = writable(1);	
	const needed_players = 2;

 
	function get_random_joker() {
		let keys = Object.keys(Jokers);
		return keys[Math.floor(Math.random() * keys.length)] as keyof typeof Jokers;
	}

	function update_room_state() {
		room.update((r) => {
			r.state = {
				jokers: {
					[data.uid]: [get_random_joker(), get_random_joker(), get_random_joker()]
				},
				judge_index: 0,
				round: 1,
				stage: 1
			} as unknown as GameState;

			// Log chance to db
			ws.emit(Events.UPDATE_ROOM, data.room_code, $room);

			return r;
		})

	}

	onMount(() => {
		ws.emit(Events.JOIN, data.room_code, data.uid);

		function ready() {
			clearInterval(ping_interval);
			player_count.set(2);

		}

		ws.on(Events.PING, () => {
			ws.emit(Events.PONG, data.room_code);
			// Wait 1 second for the pong (try to sync the players)
			setTimeout(() => {
				ready();
			}, 1000);
		});

		ws.on(Events.PONG, () => {
			ready();
		});

		let ping_interval = setInterval(() => {
			ws.emit(Events.PING, data.room_code);
		}, 1000);

	});
</script>

<!-- Wait room  -->
<main class="flex flex-col items-center justify-center h-screen">

	{#if $player_count == needed_players}
	
		<div class="flex flex-col items-center justify-center">
			<h1 class="text-2xl font-bold text-gray-500">Moving to the game...</h1> 

			<div class="container p-4 m-4">
			<Countdown 
				seconds={5} 
				start={writable(true)} 
				on_end={update_room_state} 
			/>
			</div>
		</div>

	{:else}

	<div class="flex flex-col items-center justify-center">
		<h1 class="text-2xl font-bold text-gray-500">
			Room: <span class="text-2xl font-bold text-gray-400">{data.room_code}</span>
		</h1>

		<h2 class="m-4 text-3xl font-bold text-gray-500">
			Players: <span class="text-3xl font-bold text-gray-400">{$player_count}/{needed_players}</span
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
