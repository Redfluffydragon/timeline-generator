<script>
  export let event;
</script>

{#if event['Name (common)']}
  <div class="wrapper">
    <h3>{event['Name (common)']}</h3>
    <p>{event['Reasons for extinction']}</p>
  </div>
{/if}

<style>
  .wrapper {
    padding: 2ch;
    background: white;
    box-shadow: 5px 5px 25px black;
    min-width: 20ch;
    background: var(--card-color);
  }
</style>
