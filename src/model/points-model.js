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

  get OffersByType() {
    return this.#offersByType;
  }

  get Destinations() {
    return this.#destinations;
  }

  get Offers() {
    return this.#offers;
  }

  get Types() {
    return this.#types;
  }

  get Points() {
    return this.#points;
  }

  get BlankPoint() {
    return this.#blankPoint;
  }
}
