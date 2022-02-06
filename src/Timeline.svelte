<script>
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

  $: yearKeys = Object.keys(sortedEvents).sort();

  $: console.log(yearKeys);

  $: $data.start = $events.length ? parseInt($events[0]['Graph years']) : 0;
  $: $data.end = $events.length ? parseInt($events[$events.findIndex(item => isNaN(item['Graph years'])) - 1]['Graph years']) : 0;
  $: $data.range = $data.end - $data.start;

  $: allYears = Array.from(Array($data.range).keys()).map(year => year + $data.start);
  $: console.log(allYears);

  let timelineNode;
</script>

<div class="timelineWrapper" bind:this={timelineNode}>
  <div class="timeline">
    {#if $events.length}
      {#each allYears as year}
        <YearColumn>
          {#if sortedEvents[year]}
            {#each sortedEvents[year] as event}
              <TimelineEvent {event} />
            {/each}
          {/if}
        </YearColumn>
      {/each}
      <YearColumn>
        {#each sortedEvents.unknown as event}
          <TimelineEvent {event} />
        {/each}
      </YearColumn>
    {/if}
  </div>
</div>

<button on:click={() => {
  /* domtoimage.toPng(timelineNode)
  .then(dataUrl => {
        var img = document.createElement('img');
        img.src = dataUrl;
        document.body.appendChild(img);
    })
    .catch(error => {
        console.error('oops, something went wrong!', error);
    }); */
  domtoimage.toBlob(timelineNode)
  .then(blob => {
    console.log(blob);
    const downloadLink = document.createElement('a');

    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'timeline.png';
    downloadLink.click();
    window.URL.revokeObjectURL(url);
  });
}}>Export to png</button>

<style>
  .timelineWrapper {
    padding: 30px;
  }

  .timeline {
    display: flex;
    gap: 2ch;
    position: relative;
  }
</style>
