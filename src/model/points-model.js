import {POINT_TYPES, POINTS_COUNT} from '../const';
import {
  generateBlankPoint,
  generateDestinations,
  generateOffers,
  generateOffersByType,
  generatePoints,
} from '../mock/points';

export default class DataModel {
  types = POINT_TYPES;
  offersByType = generateOffersByType();
  destinations = generateDestinations(5);
  offers = generateOffers(5);
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
