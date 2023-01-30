import {POINT_TYPES, POINTS_COUNT} from '../const';
import {generateBlankPoint, generateOffers, generateOffersByType, generatePoints,} from '../mock/points';
import {renameProperty} from '../utils/utils';
import Observable from '../framework/observable';
import ApiService from '../framework/api-service';

const OFFERS_COUNT = 5;

export default class DataModel extends Observable {
  #pointsApiService = null;
  #offersApiService = null;
  #destinationsApiService = null;
  #types = POINT_TYPES;
  #destinations = [];
  #points = [];
  #offersByType = [];
  #offers = generateOffers(OFFERS_COUNT);
  #blankPoint;
  //#formatedBlankPoints = this.#formatPointKeys(this.#blankPoint);

  constructor({pointsApiService, offersApiService, destinationsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#offersApiService = offersApiService;
    this.#destinationsApiService = destinationsApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient)
      this.#offersByType = await this.#offersApiService.offers;
      this.#blankPoint = this.#points[0];
    } catch(err) {
      this.#destinations = null;
      this.#points = null;
    }
  }

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

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

/*  #formatPointKeys(points) {
    points.forEach((point) => {
      renameProperty(point, 'base_price', 'basePrice');
      renameProperty(point, 'date_from', 'dateFrom');
      renameProperty(point, 'date_to', 'dateTo');
    });

    return points;
  }*/

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  }
}
