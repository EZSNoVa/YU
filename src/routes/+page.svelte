<script lang="ts">
	import type { ActionData, PageServerData } from "./$types";
	import Toast from "$lib/components/Toast.svelte";
	import toast from "$lib/stores/toast";

	let room_code: string = "";

	export let data: PageServerData;
	export let form: ActionData;

	/**
	 * If form submission is successful, redirect to the room page.
	 * Otherwise, display an error message.
	*/
	$: if (form) {
		toast.set({
			type: "error",
			message: form.error,
			title: "Something is off...",
			duration: 5000
		})
	}
</script>

<main class="container h-screen flex flex-col justify-center items-center bg-inherit">

	<Toast />

	<!-- Create new room -->
	<form class="container mx-auto flex flex-col m-1">
		<input 
			type="text" 
			placeholder="Room code" 
			class="w-auto border-1 border-gray-400 p-2 m-1"
			name="room code" 
			bind:value={room_code}
			minlength="2"
			maxlength="10"
			pattern="[A-Za-z0-9_]+"
			required
			title="Room code must be between 2 and 10 characters long and contain only letters, numbers, and underscores."
		/>
		<div class="flex w-full justify-center">
			<button
				class="h-12 w-1/3 m-1
				border-1 border-red-400
				hover:bg-red-500 hover:text-white
				">Create</button
			>
			<button
				class="h-12 w-1/3 m-1
				border-1 border-blue-400
				hover:bg-blue-500 hover:text-white
				">Join</button
			>
		</div>
	</form>
</main>
