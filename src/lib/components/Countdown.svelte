<script lang="ts">
	import type { Writable } from "svelte/store";


    export let seconds = 30;
    export let start: Writable<boolean>;
    export let on_end: () => void;

    let interval: string | number | NodeJS.Timeout | undefined;
    let is_running = false;

    function start_countdown() {
        is_running = true;
        interval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(interval);
                is_running = false;
                on_end();
            }
        }, 1000);
    }

    function reset_countdown() {
        clearInterval(interval);
        seconds = 0;
    }

    $: start ? start_countdown() : reset_countdown();

</script>


<div 
    aria-label="Countdown timer"
    aria-roledescription="button"
    aria-pressed={is_running}
    class="flex justify-center items-center 
        {is_running ? 'pulse' : 'squeeze'}

        border-4 border-purple-500
        w-64 h-64 rounded-full

        transition duration-300 ease-in-out
        
        hover:scale-105 hover:border-purple-300 
        "

    title="Click to start/stop the countdown"
>

    <!-- Numbers -->
    <div class="flex flex-row justify-center items-center">
        <div class="text-4xl font-bold">{seconds}</div>
    </div>

</div>


<style>
    .squeeze {
        animation: squeeze 1.5s infinite alternate;
    }

    @keyframes squeeze {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(1.05);
        }
    }

    .pulse {
        animation: pulse 1s infinite ease-in-out;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
</style>