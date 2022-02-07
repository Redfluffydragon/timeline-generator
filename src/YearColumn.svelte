<script>
  export let year = null;
</script>

<div class="column">
  {#if year}
    <h2>{year}</h2>
  {/if}
  <slot />
</div>

<style>
  .column {
    display: flex;
    flex-direction: column;
    gap: 2ch;
    width: 25ch;
    border-top: 2ch solid var(--line-color);
    padding: 2em 1ch 1ch;
  }

  h2 {
    position: relative;
    margin-bottom: 0;
    text-align: center;
    color: var(--line-color);
  }

  h2::before {
    position: absolute;
    top: -2.5em;
    /* left: 1.5ch; */
    left: 50%;
    transform: translateX(-50%);
    content: '';
    background: var(--line-color);
    width: 1ch;
    height: 2em;
  }
</style>