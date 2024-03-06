<script lang="ts">
	import RoleTitle from '$components/RoleTitle.svelte';
	import Round from '$components/Round.svelte';
	import { Role, type RoomType, type UID } from '$types';
	import type { Writable } from 'svelte/store';

	export let room: Writable<RoomType>;
	export let uid: UID;

	const role: Role =
		$room.members[$room.state?.judge_index ?? 0] === uid ? Role.JUDGE : Role.RESPONDENT;
</script>

<main class="flex flex-col items-center justify-center h-full">
	<RoleTitle {role} />


    <Round round={$room.state?.round ?? 1} />
</main>
