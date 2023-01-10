import {SORTING} from '../utils/sorting';

export function generateSorting() {
  return Object.entries(SORTING).map(
    ([sortingName]) => ({
      name: sortingName,
    }),
  );
}
