<script>
  import ColorSelect from './ColorSelect.svelte';
	import FileInput from './FileInput.svelte';
  import TimelineEvent from './TimelineEvent.svelte';
  import YearColumn from './YearColumn.svelte';
  import { events, dateData, sheetData } from "./stores";
  import domtoimage from 'dom-to-image';

  $: $events = $events.sort((a, b) => a[$sheetData.dateColumn] - b[$sheetData.dateColumn]);

  let sortedEvents = {
    unknown: [],
  };
  $: if ($events) {
    sortedEvents = {
      unknown: [],
    }
  };

  $: $events.forEach(item => {
    if (isNaN(item[$sheetData.dateColumn])) {
      sortedEvents.unknown.push(item);
      return;
    }
    
    if (!(item[$sheetData.dateColumn] in sortedEvents)) {
      sortedEvents[item[$sheetData.dateColumn]] = [];
    }
    sortedEvents[item[$sheetData.dateColumn]].push(item);
  });

  $: $dateData.start = $events.length ? parseInt($events[$events.findIndex(item => !isNaN(item[$sheetData.dateColumn]))][$sheetData.dateColumn]) : 0;
  $: $dateData.end = $events.length ? parseInt($events[$events.findIndex(item => isNaN(item[$sheetData.dateColumn])) - 1]?.[$sheetData.dateColumn]) : 0;
  $: $dateData.range = $dateData.end - $dateData.start + 1; // Plus one to include the end year

  $: allYears = Array.from(Array($dateData.range).keys()).map(year => year + $dateData.start);

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

<footer class="centerFlex">
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
      downloadLink.remove();
    });
  }}>Export as png</button>

  <ColorSelect />
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
</style>
