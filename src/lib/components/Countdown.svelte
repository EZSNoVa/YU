<script lang="ts">
	import { CountdownState } from "$types";
	import { onMount } from "svelte";
	import type { Writable } from "svelte/store";

    export let seconds = 30;
    export let state: Writable<CountdownState>;
    export let on_end: () => void;
    export let styles = "w-64 h-64 m-4";
 
    const initial_seconds = seconds; // store the initial value

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

    function stop_countdown() {
        clearInterval(interval);
        is_running = false;
    }

    function reset_countdown() {
        clearInterval(interval);
        seconds = 0;
    }   

    function handle(state: CountdownState) {
        switch (state) {
            case CountdownState.START:
                start_countdown();
                break;

            case CountdownState.STOP:
                stop_countdown();
                break;

            case CountdownState.RESET:
                reset_countdown();
                break;

            default:
                break;
        }
    }

    $: handle($state);

    state.subscribe((value) => {
        handle(value);
    });

  </script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    on:click

    aria-label="Countdown timer"
    aria-roledescription="button"
    aria-pressed={is_running}
    class="flex justify-center items-center 
        {is_running ? 'pulse' : 'squeeze'}

        border-4 border-purple-500
        rounded-full
        {styles}
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
