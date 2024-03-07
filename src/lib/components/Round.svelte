<script lang="ts">
	export let round: number;
</script>

<div class="rounded-lg border border-white text-white bg-transparent m-2 p-2 bottom-left">
  <p class="text-center font-medium">
    Round: {round}
  </p>
</div>

<style>
  .bottom-left {
    position: fixed;
    bottom: 0;
    left: 0;
	margin: 20px;
  }
</style>

