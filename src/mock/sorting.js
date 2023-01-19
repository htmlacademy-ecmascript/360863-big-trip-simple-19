import {SORTING_TYPES} from '../const';

export function generateSorting() {
  return Object.entries(SORTING_TYPES).map(
    ([, value]) => ({
      name: value,
    }),
  );
}
