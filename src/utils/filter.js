import {FILTER_TYPE} from '../const';
//import {isDateFuture} from './utils';
import dayjs from 'dayjs';

function isDateFuture(date) {
  const currentDate = dayjs(date, 'DD-MM-YYTHH:mm:ss');

  return currentDate >= dayjs();
}

export const FILTER = {
  [FILTER_TYPE.EVERYTHING]: (points) => points.filter((point) => point),
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateFrom)),
};

/*
а еще хотел спросить, там вот последняя часть задания 7.7, я только до нее добрался про безопасность. Где нужно чтобы вводились только цифры в поле цены и "Ограничьте возможность ввода в поле «Пункт назначения» конечным списком городов"*/
