<script lang="ts">
  import Countdown from '$components/Countdown.svelte';
	import { writable } from 'svelte/store';
</script>

<main class="container">
  <h1>Room</h1>


  <div class="flex flex-col justify-center items-center">
    <Countdown seconds={30} start={writable(true)} on_end={() => {}}/>
  </div>

</main>