<script>
  import { sheetData } from './stores';

  export let event;
</script>

{#if event['Name (common)']}
  <div class="wrapper">
    <h3>{event[$sheetData.titleColumn] || ''}</h3>
    <p>{event[$sheetData.descriptionColumn] || ''}</p>
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
