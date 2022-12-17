import {POINT_TYPES, POINTS_COUNT} from '../const';
import {
  generateBlankPoint,
  generateDestinations,
  generateOffers,
  generateOffersByType,
  generatePoints,
} from '../mock/points';

const OFFERS_COUNT = 5;
const DESTINATIONS_COUNT = 5;

export default class DataModel {
  #types = POINT_TYPES;
  #offersByType = generateOffersByType();
  #destinations = generateDestinations(DESTINATIONS_COUNT);
  #offers = generateOffers(OFFERS_COUNT);
  #points = generatePoints(POINTS_COUNT);
  #blankPoint = generateBlankPoint();

  get offersByType() {
    return this.#offersByType;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get types() {
    return this.#types;
  }

  get points() {
    return this.#points;
  }

  get blankPoint() {
    return this.#blankPoint;
  }
}
