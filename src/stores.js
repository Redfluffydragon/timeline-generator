import { writable } from "svelte/store";

export const events = writable([]);

export const dateData = writable({
  range: 0,
  start: 0,
});

export const sheetData = writable({
  sheet: '',
  dateColumn: '',
  titleColumn: 'illegal/sheetname',
  descriptionColumn: 'illegal/sheetname',
});
