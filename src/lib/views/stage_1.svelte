<script lang="ts">
	import Countdown from '$components/Countdown.svelte';
	import RoleTitle from '$components/RoleTitle.svelte';
	import Round from '$components/Round.svelte';
	import { Role, type RoomType, type UID, CountdownState } from '$types';
	import { writable, type Writable } from 'svelte/store';

	export let room: Writable<RoomType>;
	export let uid: UID;

	const role: Role =
		$room.members[$room.state.judge_index] === uid ? Role.JUDGE : Role.RESPONDENT;

	let countdown_state = writable(CountdownState.STOP);
</script>

<main class="flex flex-col items-center justify-center h-full">
	<RoleTitle {role} />

	<Countdown
		seconds={30}
		state={countdown_state}
		on:click={() => { countdown_state.set(CountdownState.START); }}
		on_end={() => {}}
	/>

    <Round round={$room.state.round ?? 1} />
</main>

