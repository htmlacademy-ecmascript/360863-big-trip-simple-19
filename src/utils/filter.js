import {FILTER_TYPE} from '../const';
import {isDateFuture} from './utils';

export const FILTER = {
  [FILTER_TYPE.EVERYTHING]: (points) => points.filter((point) => point),
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isDateFuture(point.date_from)),
};

