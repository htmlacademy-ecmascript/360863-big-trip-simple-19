import {FILTER} from '../utils/filter';

export function generateFilter() {
  return Object.entries(FILTER).map(
    ([filterName]) => ({
      name: filterName,
    }),
  );
}
