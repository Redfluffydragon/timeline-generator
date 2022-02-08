<script>
  import Modal from './Modal.svelte';

  let open = false;
</script>

<Modal bind:open maxWidth="70ch">
  <h2>Info</h2>
  <h3>How to use</h3>
  <ol>
    <li>Upload a file (only Excel and csv files are supported right now)</li>
    <li>Select the sheet and columns to display. It assumes the top row is header. A column for the date is required, and you can change your selections later with the "Sheet options" button.</li>
    <li>You can change the card, text, and line colors using the color pickers.</li>
    <li>When you like how it looks, export it as a PNG. Unfortunately, if your timeline is too long it won't be able to export it. If this is the case for your timeline, consider splitting it up into sections.</li>
  </ol>
  <p>View the source code on <a href="https://github.com/Redfluffydragon/timeline-generator">GitHub</a>.</p>
</Modal>

<button on:click={() => { open = true }}>Info</button>

<style>
  ol {
    text-align: left;
  }

  button {
    padding: 1ch;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 0;
  }
</style>
