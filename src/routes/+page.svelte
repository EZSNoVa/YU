<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import Toast from '$lib/components/Toast.svelte';
	import toast from '$lib/stores/toast';

	export let data: PageServerData;
	export let form: ActionData;

	let room_code: string = '';
	let username: string = data.username || '';

	/**
	 * If form submission is successful, redirect to the room page.
	 * Otherwise, display an error message.
	 */
	$: if (form) {
		toast.set({
			type: 'error',
			message: form.error,
			title: 'Something is off...',
			duration: 5000
		});
	}
</script>

<main class="container h-screen flex flex-col justify-center items-center bg-inherit">
	<!-- Logo and title -->
	<div class="flex flex-col-reverse justify-center items-center mb-4">
		<img src="/logo.png" alt="Uno logo" class="squeeze w-24 h-24" loading="eager" />
		<h1 class="text-4xl font-bold">Yumnaa's Uno</h1>
	</div>

	<Toast />

	<!-- Create new room -->
	<form class="container mx-auto flex flex-col m-1">
		<input
			type="text"
			placeholder="Username"
			class="w-auto border-1 border-gray-400 p-2 m-1"
			name="username"
			bind:value={username}
			minlength="2"
			maxlength="16"
			pattern="[A-Za-z0-9_ ]+"
			required
			title="Username must be between 2 and 16 characters long and contain only letters, numbers, spaces and underscores."
			on:input={() => {
				// Delete special characters
				username = username.replace(/[^a-z0-9_ ]/g, '');
			}}
		/>

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
			title="Room code must be between 2 and 10 characters long and contain only letters, numbers, spaces and underscores."
			on:input={() => {
				// Delete special characters
				room_code = room_code.replace(/[^a-z0-9_ ]/g, '');
			}}
		/>
		<div class="flex w-full justify-center">
			<button
				class="h-12 w-1/3 m-1
				border-1 border-red-400 hover:bg-red-500 hover:text-white"
				type="submit"
				formaction="/?create"
				>Create</button
			>
			<button
				class="h-12 w-1/3 m-1
				border-1 border-blue-400 hover:bg-blue-500 hover:text-white"
				type="submit"
				formaction="/?join"
				>Join</button
			>
		</div>
	</form>
</main>

<style>
	@keyframes squeeze {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}
	.squeeze {
		animation: squeeze 3s ease-in-out infinite;
	}
</style>
