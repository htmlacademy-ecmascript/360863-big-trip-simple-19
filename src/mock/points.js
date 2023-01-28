import {getRandomArrayElement, getRandomInt} from '../utils/utils';
import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';
dayjs.extend(dayjsRandom);

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATIONS_DESCRIPTIONS = [
  'Aliquam id orci ut lectus varius viverra',
  'tortor ac porta dapibus',
  'non porta ligula feugiat eget',
  'sdf sdg sg fdg s sd dfs fd',
  'sdsffsfsdf sdf sfsdf sdf sdf sd f',
  'llllllllllllkuuiutuutyu',
];
const CITY_NAMES = [
  'Chamonix',
  'Chicago',
  'London',
  'Moscow',
  'Paris'
];
const PICTURES_DESCRIPTIONS = [
  'ipsum dolor sit amet',
  'purus sit amet tempus',
  'condimentum sed nibh vitae'
];
const OFFERS_TITLES = [
  'Order Uber',
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  '11111111111111',
  '22222222222222',
  '333333333333333',
  '4444444444444',
  '555555555555',
  '666666666666',
  '77777777777',
  '88888888888888',
];

const DAYS_PLUS_MINIMUM = 3;
const DAYS_PLUS_MAXIMUM = 10;
const HOURS_PLUS_MINIMUM = 1;
const HOURS_PLUS_MAXIMUM = 10;
const BASE_PRICE_MINIMUM = 100;
const BASE_PRICE_MAXIMUM = 1000;
const OFFERS_MINIMUM_COUNT = 1;
const OFFERS_MAXIMUM_COUNT = 5;
const DESTINATIONS_COUNT = 5;

export function generateDestinations(count) {
  const DATA = [];

  for (let i = 1; i <= count; i++) {
    DATA.push(
      {
        'id': i,
        'description': getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
        'name': getRandomArrayElement(CITY_NAMES),
        'pictures': [
          {
            'src': `http://picsum.photos/300/200?r=${getRandomInt()}`,
            'description': getRandomArrayElement(PICTURES_DESCRIPTIONS),
          }
        ]
      }
    );
  }
  return DATA;
}
const DESTINATIONS = generateDestinations(DESTINATIONS_COUNT);

export function generateOffers(count) {
  const DATA = [];
  for (let i = 1; i <= count; i++){
    DATA.push({
      'id': i,
      'title': getRandomArrayElement(OFFERS_TITLES),
      'price': getRandomInt(BASE_PRICE_MINIMUM, BASE_PRICE_MAXIMUM)
    });
  }
  return DATA;
}

export function generateOffersByType() {
  return POINT_TYPES.map((type) =>
    ({
      'type': type,
      'offers': generateOffers(getRandomInt(OFFERS_MINIMUM_COUNT, OFFERS_MAXIMUM_COUNT))
    })
  );
}
const OFFERS_BY_TYPE = generateOffersByType();

export function generatePoints(count) {
  const DATA = [];

  for (let i = 1; i < count; i++) {
    const POINT_TYPE = getRandomArrayElement(POINT_TYPES);
    const ID = i;
    const HOUR_VALUE_FROM = getRandomInt(HOURS_PLUS_MINIMUM, HOURS_PLUS_MAXIMUM);
    const DAYS_VALUE_TO = getRandomInt(DAYS_PLUS_MINIMUM, DAYS_PLUS_MAXIMUM);
    const HOUR_VALUE_TO = getRandomInt(HOURS_PLUS_MINIMUM, HOURS_PLUS_MAXIMUM);
    const DATE = dayjs.between('2022-12-22', '2023-02-22');

    DATA.push({
      'base_price': getRandomInt(BASE_PRICE_MINIMUM, BASE_PRICE_MAXIMUM),
      'date_from': dayjs(DATE).add(HOUR_VALUE_FROM, 'hour').format('DD-MM-YYTHH:mm:ss'),
      'date_to': dayjs(DATE).add(DAYS_VALUE_TO, 'day').add(HOUR_VALUE_TO, 'hour').format('DD-MM-YYTHH:mm:ss'),
      'destination': DESTINATIONS[getRandomInt(0, (DESTINATIONS.length - 1))].id,
      'id': ID.toString(),
      'offers': [getRandomArrayElement(OFFERS_BY_TYPE
        .find((el) => el.type === POINT_TYPE).offers
        .map((offer) => (offer.id)))],
      'type': POINT_TYPE
    });
  }

  return DATA.sort((a,b) =>
    new Date(a.date_from) - new Date(b.date_from)
  );
}

export function generateBlankPoint() {
  const POINT_TYPE = getRandomArrayElement(POINT_TYPES);
  const HOUR_VALUE_FROM = getRandomInt(HOURS_PLUS_MINIMUM, HOURS_PLUS_MAXIMUM);
  const DAYS_VALUE_TO = getRandomInt(DAYS_PLUS_MINIMUM, DAYS_PLUS_MAXIMUM);
  const HOURS_VALUE_TO = getRandomInt(HOURS_PLUS_MINIMUM, HOURS_PLUS_MAXIMUM);
  return [{
    'base_price': getRandomInt(BASE_PRICE_MINIMUM, BASE_PRICE_MAXIMUM),
    'date_from': dayjs().add(HOUR_VALUE_FROM, 'hour').locale('ru').format('DD-MM-YYTHH:mm:ss'),
    'date_to': dayjs().add(DAYS_VALUE_TO, 'day').add(HOURS_VALUE_TO, 'hour').format('DD-MM-YYTHH:mm:ss'),
    'destination': DESTINATIONS[getRandomInt(0, (DESTINATIONS.length - 1))].id,
    'id': 0,
    'offers': [getRandomArrayElement(OFFERS_BY_TYPE
      .find((el) => el.type === POINT_TYPE).offers
      .map((offer) => (offer.id)))],
    'type': 'restaurant'
  }];
}
