import { writable } from "svelte/store";

export const events = writable([]);

export const data = writable({
  range: 0,
  start: 0,
})
