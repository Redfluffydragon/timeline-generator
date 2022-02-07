<script>
	import Timeline from './Timeline.svelte';
	import Inputs from './Inputs.svelte';

	let timelineNode;
</script>

<main>
	<Timeline bind:timelineNode />
</main>

<div class="spacer"></div>

<footer class="centerFlex">
	<Inputs {timelineNode} />
</footer>

<style>
	.spacer {
    height: 6em;
  }

	footer {
    color: #333;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 2ch;
    background: white;
    box-shadow: 0 0 15px black;
    gap: 2ch;
  }
</style>
