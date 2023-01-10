import {SORTING_TYPES} from '../const';

export const SORTING = {
  [SORTING_TYPES.DAY]: (points) => points.filter((point) => point),
  [SORTING_TYPES.EVENT]: (points) => points.filter((point) => point),
  [SORTING_TYPES.TIME]: (points) => points.filter((point) => point),
  [SORTING_TYPES.PRICE]: (points) => points.filter((point) => point),
  [SORTING_TYPES.OFFERS]: (points) => points.filter((point) => point),
};
/*TODO: дописать какие-то функции сортировки*/
