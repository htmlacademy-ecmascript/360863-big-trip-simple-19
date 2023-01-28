import {FILTER_TYPE} from '../const';
import {isDateFuture} from './utils';
import dayjs from 'dayjs';

/*function isDateFuture(date) {
  const currentDate = dayjs(date, 'DD-MM-YYTHH:mm:ss')

  return currentDate >= dayjs();
}*/

export const FILTER = {
  [FILTER_TYPE.EVERYTHING]: (points) => points.filter((point) => point),
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateFrom)),
};
