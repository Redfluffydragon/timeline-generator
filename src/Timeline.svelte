<script>
	import FileInput from './FileInput.svelte';
  import TimelineEvent from './TimelineEvent.svelte';
  import YearColumn from './YearColumn.svelte';
  import { events, data } from "./stores";
  import domtoimage from 'dom-to-image';

  $: $events = $events.sort((a, b) => a['Graph years'] - b['Graph years']);
  let sortedEvents = {
    unknown: [],
  };

  $: $events.forEach(item => {
    if (isNaN(item['Graph years'])) {
      sortedEvents.unknown.push(item);
      return;
    }
    
    if (!(item['Graph years'] in sortedEvents)) {
      sortedEvents[item['Graph years']] = [];
    }
    sortedEvents[item['Graph years']].push(item);
  });

  $: $data.start = $events.length ? parseInt($events[0]['Graph years']) : 1520;
  $: $data.end = $events.length ? parseInt($events[$events.findIndex(item => isNaN(item['Graph years'])) - 1]['Graph years']) : 1530;
  $: $data.range = $data.end - $data.start + 1; // Plus one to include the end year

  $: allYears = Array.from(Array($data.range).keys()).map(year => year + $data.start);

  let timelineNode;
</script>

<main>
  <div class="timelineWrapper" bind:this={timelineNode}>
    <div class="timeline">
      {#if $events.length}
        {#each allYears as year}
          <YearColumn year={sortedEvents[year] ? year : null}>
            {#if sortedEvents[year]}
              {#each sortedEvents[year] as event}
                <TimelineEvent {event} />
              {/each}
            {/if}
          </YearColumn>
        {/each}
        <YearColumn year="Unknown">
          {#each sortedEvents.unknown as event}
            <TimelineEvent {event} />
          {/each}
        </YearColumn>
      {/if}
    </div>
  </div>
</main>

<div class="spacer"></div>

<footer>
  <FileInput />
  
  <button on:click={() => {
    domtoimage.toBlob(timelineNode)
    .then(blob => {
      const downloadLink = document.createElement('a');
  
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = 'timeline.png';
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }}>Export to png</button>

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
</footer>

<style>
  .timelineWrapper {
    padding: 30px;
  }

  .timeline {
    display: flex;
  }

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

  .centerFlex {
    display: flex;
    place-content: center;
    place-items: center;
  }
</style>
