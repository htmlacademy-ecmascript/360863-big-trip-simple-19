import {POINT_TYPES, POINTS_COUNT} from '../const';
import {
  generateBlankPoint,
  generateDestinations,
  generateOffers,
  generateOffersByType,
  generatePoints,
} from '../mock/points';
import {renameProperty} from '../utils/utils';
import Observable from '../framework/observable';

const OFFERS_COUNT = 5;
const DESTINATIONS_COUNT = 5;

export default class DataModel extends Observable {
  #types = POINT_TYPES;
  #offersByType = generateOffersByType();
  #destinations = generateDestinations(DESTINATIONS_COUNT);
  #offers = generateOffers(OFFERS_COUNT);
  #points = generatePoints(POINTS_COUNT);
  #formatedPoints = this.#formatPointKeys(this.#points);
  #blankPoint = generateBlankPoint();
  #formatedBlankPoints = this.#formatPointKeys(this.#blankPoint);

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
    return this.#formatedPoints;
  }

  get blankPoint() {
    return this.#formatedBlankPoints;
  }

  updatePoint(updateType, update) {
    const index = this.#formatedPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#formatedPoints = [
      ...this.#formatedPoints.slice(0, index),
      update,
      ...this.#formatedPoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#formatedPoints = [
      update,
      ...this.#formatedPoints,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#formatedPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#formatedPoints = [
      ...this.#formatedPoints.slice(0, index),
      ...this.#formatedPoints.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #formatPointKeys(points) {
    points.forEach((point) => {
      renameProperty(point, 'base_price', 'basePrice');
      renameProperty(point, 'date_from', 'dateFrom');
      renameProperty(point, 'date_to', 'dateTo');
    });

    return points;
  }
}
