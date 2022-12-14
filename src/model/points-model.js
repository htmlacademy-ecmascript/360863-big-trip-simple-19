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
  types = POINT_TYPES;
  offersByType = generateOffersByType();
  destinations = generateDestinations(DESTINATIONS_COUNT);
  offers = generateOffers(OFFERS_COUNT);
  points = generatePoints(POINTS_COUNT);
  blankPoint = generateBlankPoint();

  getOffersByType() {
    return this.offersByType;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getTypes() {
    return this.types;
  }

  getPoints() {
    return this.points;
  }

  getBlankPoint() {
    return this.blankPoint;
  }
}
