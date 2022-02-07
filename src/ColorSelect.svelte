<script>
  let lockSameColor = false;

  let sameColor = '#333';
  let notSameColor = '#333';
</script>

<div class="colors">
  <div class="centerFlex">
    <label for="cardColor">Card color</label>
    <input on:input={e => {
      document.documentElement.style.setProperty('--card-color', e.target.value);
    }} type="color" name="" id="cardColor" value="#ffffff">
  </div>

  <div class="centerFlex">
    <label for="fontColor">Font color</label>
    <input bind:value={sameColor} on:input={e => {
      document.documentElement.style.setProperty('--font-color', e.target.value);
      if (lockSameColor) {
        document.documentElement.style.setProperty('--line-color', e.target.value);
        notSameColor = sameColor;
      }
    }} type="color" name="" id="fontColor">
  </div>

  {#if lockSameColor}
    <div class="centerFlex">
      <label for="fontColor">Line color</label>
      <input disabled bind:value={sameColor} on:input={e => {
        document.documentElement.style.setProperty('--line-color', e.target.value);
      }} type="color" name="" id="fontColor">
    </div>
  {:else}
    <div class="centerFlex">
      <label for="fontColor">Line color</label>
      <input bind:value={notSameColor} on:input={e => {
        document.documentElement.style.setProperty('--line-color', e.target.value);
      }} type="color" name="" id="fontColor">
    </div>
  {/if}

  <div class="centerFlex">
    <input type="checkbox" id="sameColor" bind:checked={lockSameColor} on:input={e => {
      document.documentElement.style.setProperty('--line-color', e.target.checked ? sameColor : notSameColor);
    }}>
    <label for="sameColor">Same as font color</label>
  </div>
</div>

<style>
  .colors {
    width: max-content;
  }

  .colors .centerFlex {
    gap: 0.5ch;
  }

  input[type="color"]:not(:disabled) {
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
  }

</style>
