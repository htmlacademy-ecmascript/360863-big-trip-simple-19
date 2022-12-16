import ScheduleView from '../view/schedule-view.js';
import AddPointView from '../view/add-point-view';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';

import {render} from '../render.js';

export default class SchedulePresenter {
  #scheduleComponent = new ScheduleView();
  #scheduleContainer;
  #dataModel;
  #points;
  #destinations;
  #offersByType;
  #offers;
  #blankPoint;

  constructor({scheduleContainer, DATA_MODEL}) {
    this.#scheduleContainer = scheduleContainer;
    this.#dataModel = DATA_MODEL;
  }

  init() {
    this.#points = [...this.#dataModel.Points];
    this.#destinations = [...this.#dataModel.Destinations];
    this.#offersByType = [...this.#dataModel.OffersByType];
    this.#offers = [...this.#dataModel.Offers];
    this.#blankPoint = [...this.#dataModel.BlankPoint];

    render(this.#scheduleComponent, this.#scheduleContainer);
    render(new EditPointView({offers: this.#offers, destinations: this.#destinations, point: this.#blankPoint[0], offersByType: this.#offersByType}), this.#scheduleComponent.Element);
    render(new AddPointView({offers: this.#offers, destinations: this.#destinations, point: this.#blankPoint[0], offersByType: this.#offersByType}), this.#scheduleComponent.Element);

    for (let i = 1; i < this.#points.length; i++) {
      render(new PointView({point: this.#points[i], destinations: this.#destinations, offers: this.#offers}), this.#scheduleComponent.Element);
    }
  }
}
