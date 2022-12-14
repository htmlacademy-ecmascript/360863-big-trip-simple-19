import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:MM';

export function getRandomInt(min = 1, max = 100) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomPicture () {
  return `https://loremflickr.com/248/152?random=${getRandomInt()}`;
}

export function getRandomArray(maxLength, maxNumber) {
  const ARR = [];

  while(ARR.length < maxLength){
    const R = Math.floor(Math.random() * maxNumber) + 1;
    if(ARR.indexOf(R) === -1) {ARR.push(R);}
  }
  return ARR;
}

export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function humanizeDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

export function humanizeTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
}
