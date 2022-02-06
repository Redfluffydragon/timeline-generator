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
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 2ch;
    background: white;
    box-shadow: 0 0 15px black;
    display: flex;
    gap: 2ch;
    place-content: center;
  }
</style>
