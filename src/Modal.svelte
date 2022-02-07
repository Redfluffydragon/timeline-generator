<script>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition'

  export let open;

  export let required = false;

  const dispatch = createEventDispatcher();

  $: !open && dispatch('close');

  function escape(e) {
    if (e.key === 'Escape' && !required) {
      open = false;
    }
  }

  onMount(() => {
    window.addEventListener('keydown', escape, false);
  });

  onDestroy(() => {
    browser && window.removeEventListener('keydown', escape, false);
  });
</script>

{#if open}
  <div class="shadow" transition:fade={{ duration: 300 }}>
    <div class="modal">
      {#if !required}
        <button on:click="{() => { open = false; }}" title="Close modal" class="imgBtn closeBtn">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M56 8L8 56M8 8L56 56" stroke-width="5" stroke="#333" />
          </svg>
        </button>
      {/if}
      <slot></slot>
    </div>
  </div>
{/if}

<style>
  .shadow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(116, 116, 116, 0.5);
    z-index: 5;
    display: flex;
    place-content: center;
    place-items: center;
  }

  .modal {
    position: relative;
    background: white;
    box-shadow: 5px 5px 15px rgb(0, 0, 0, 0.2);
    text-align: center;
    width: max-content;
    padding: 0 2em 2em;
    margin: 2em;
    max-width: 100%;
    max-height: calc(100% - 4em);
    overflow-y: auto;
    min-width: 20ch;
  }

  .closeBtn {
    position: absolute;
    top: 1.5em;
    right: 1.5em;
  }
</style>