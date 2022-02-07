<div class="colors">
  <div class="centerFlex">
    <label for="cardColor">Card color</label>
    <input on:input={e => {
      document.documentElement.style.setProperty('--card-color', e.target.value);
    }} type="color" name="" id="cardColor" value="#ffffff">
  </div>

  <div class="centerFlex">
    <label for="fontColor">Font color</label>
    <input on:input={e => {
      document.documentElement.style.setProperty('--font-color', e.target.value);
    }} type="color" name="" id="fontColor" value="#333">
  </div>

  <div class="centerFlex">
    <label for="fontColor">Line color</label>
    <input on:input={e => {
      document.documentElement.style.setProperty('--line-color', e.target.value);
    }} type="color" name="" id="fontColor" value="#333">
  </div>
</div>

<style>
  .colors {
    width: max-content;
  }

  .colors .centerFlex {
    gap: 0.5ch;
  }

  input[type="color"] {
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    cursor: pointer;
  }

</style>
