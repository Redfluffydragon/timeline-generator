<script>
  import TimelineEvent from './TimelineEvent.svelte';
  import YearColumn from './YearColumn.svelte';
  import { events, dateData, sheetData } from "./stores";
  import { DateTime } from 'luxon';

  export let timelineNode = null;

  $: $events = $events.sort((a, b) => a[$sheetData.dateColumn] - b[$sheetData.dateColumn]);

  let sortedEvents = {
    unknown: [],
  };
  $: if ($events) { // Reset sorted events when $events changes to prevent duplication
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

  $: $dateData.start = $events.length ? new Date(DateTime.fromISO($events[$events.findIndex(item => !DateTime.fromISO(item[$sheetData.dateColumn]).invalid)][$sheetData.dateColumn])).getFullYear() : 0;
  $: $dateData.end = $events.length ? new Date(DateTime.fromISO($events[$events.findIndex(item => DateTime.fromISO(item[$sheetData.dateColumn]).invalid) - 1]?.[$sheetData.dateColumn])).getFullYear() : 0;
  $: $dateData.range = $dateData.end - $dateData.start + 1; // Plus one to include the end year

  $: allYears = Array.from(Array($dateData.range).keys()).map(year => year + $dateData.start);
</script>

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

<style>
  .timelineWrapper {
    padding: 30px;
  }

  .timeline {
    display: flex;
  }
</style>
