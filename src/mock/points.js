import {getRandomArrayElement, getRandomInt} from '../utils';
import dayjs from 'dayjs';

const POINT_TYPES = ["taxi", "bus", "train", "ship", "drive", "flight", "check-in", "sightseeing", "restaurant"];
const DESTINATIONS_DESCRIPTIONS = [
  'Aliquam id orci ut lectus varius viverra',
  'tortor ac porta dapibus',
  'non porta ligula feugiat eget'
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
  'Book tickets'
];

export function generateDestinations(count) {
  let data = [];
  for (let i = 0; i < count; i++) {
    data.push(
      {
        "id": i+1,
        "description": getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
        "name": getRandomArrayElement(CITY_NAMES),
        "pictures": [
          {
            "src": 'http://picsum.photos/300/200?r=' + getRandomInt(),
            "description": getRandomArrayElement(PICTURES_DESCRIPTIONS),
          }
        ]
      }
    )
  }
  return data;
}
const DESTINATIONS = generateDestinations(5);


export function generateOffers(count) {
  let data = [];
  for (let i = 0; i < count; i++){
    data.push({
      "id": i+1,
      "title": getRandomArrayElement(OFFERS_TITLES),
      "price": getRandomInt(10, 1000)
    })
  }
  return data;
}

export function generateOffersByType() {
  return POINT_TYPES.map((type) => {
    return {
      "type": type,
      "offers": generateOffers(getRandomInt(1, 5))
    }
  });
}
const OFFERS_BY_TYPE = generateOffersByType();

export function generatePoints(count) {
  let data = [];

  for (let i = 0; i < count; i++) {
    let pointType = getRandomArrayElement(POINT_TYPES);
    let id = i;
    let hourValueFrom = getRandomInt(1, 10);
    let daysValueTo = getRandomInt(3, 10);
    let hourValueTo = getRandomInt(1, 10);

    data.push({
      "base_price": getRandomInt(100, 10000),
      "date_from": dayjs().add(hourValueFrom, 'hour').format('YYYY-MM-DD'+ 'T' + 'HH:mm:ss'),
      "date_to": dayjs().add(daysValueTo, 'day').add(hourValueTo, 'hour').format('YYYY-MM-DD'+ 'T' + 'HH:mm:ss'),
      "destination": DESTINATIONS[getRandomInt(0, (DESTINATIONS.length - 1))].id,
      "id": id.toString(),
      "offers": [getRandomArrayElement(OFFERS_BY_TYPE
        .find((el) => el.type === pointType).offers
        .map((offer) => {return offer.id}))],
      "type": pointType
    });
  }

  return data;
}

export function generateBlankPoint() {
  let pointType = getRandomArrayElement(POINT_TYPES);
  let hourValueFrom = getRandomInt(1, 10);
  let daysValueTo = getRandomInt(3, 10);
  let hourValueTo = getRandomInt(1, 10);
  return [{
    "base_price": getRandomInt(100, 10000),
    "date_from": dayjs().add(hourValueFrom, 'hour').format('YYYY-MM-DD'+ 'T' + 'HH:mm:ss'),
    "date_to": dayjs().add(daysValueTo, 'day').add(hourValueTo, 'hour').format('YYYY-MM-DD'+ 'T' + 'HH:mm:ss'),
    "destination": DESTINATIONS[getRandomInt(0, (DESTINATIONS.length - 1))].id,
    "id": null,
    "offers": [getRandomArrayElement(OFFERS_BY_TYPE
      .find((el) => el.type === pointType).offers
      .map((offer) => {return offer.id}))],
    "type": pointType
  }]
}
