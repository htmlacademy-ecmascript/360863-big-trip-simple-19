import ScheduleView from '../view/schedule-view.js';
import AddPointView from '../view/add-point-view';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';

import {render} from '../render.js';
import EmptyPointsView from '../view/empty-points-view';

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

  init(TRIP_ELEMENTS) {
    this.#points = [...this.#dataModel.points];
    this.#destinations = [...this.#dataModel.destinations];
    this.#offersByType = [...this.#dataModel.offersByType];
    this.#offers = [...this.#dataModel.offers];
    this.#blankPoint = [...this.#dataModel.blankPoint];

    if (this.#points.length > 0) {
      render(this.#scheduleComponent, this.#scheduleContainer);
      render(new AddPointView({offers: this.#offers, destinations: this.#destinations, point: this.#blankPoint[0], offersByType: this.#offersByType}), this.#scheduleComponent.element);

      for (let i = 1; i < this.#points.length; i++) {
        this.#renderPoint({point: this.#points[i], offers: this.#offers, destinations: this.#destinations, offersByType: this.#offersByType});
      }
    } else {
      render(new EmptyPointsView(), TRIP_ELEMENTS);
    }
  }

  #renderPoint({point, offers, destinations, offersByType}) {
    const POINT_COMPONENT = new PointView({point, offers, destinations});
    const POINT_EDIT_COMPONENT = new EditPointView({offers, destinations, point, offersByType});

    const REPLACE_POINT_TO_FORM = () => {
      this.#scheduleComponent.element.replaceChild(POINT_EDIT_COMPONENT.element, POINT_COMPONENT.element);
    };

    const REPLACE_FORM_TO_CARD = () => {
      this.#scheduleComponent.element.replaceChild(POINT_COMPONENT.element, POINT_EDIT_COMPONENT.element);
    };

    const ESC_KEY_DOWN_HANDLER = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        REPLACE_FORM_TO_CARD();
        document.removeEventListener('keydown', ESC_KEY_DOWN_HANDLER);
      }
    };

    const CLOSE_EDIT_HANDLER = () => {
      REPLACE_FORM_TO_CARD();
      POINT_EDIT_COMPONENT.element.querySelector('.event--edit').removeEventListener('click', CLOSE_EDIT_HANDLER);
    };

    POINT_COMPONENT.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      REPLACE_POINT_TO_FORM();
      document.addEventListener('keydown', ESC_KEY_DOWN_HANDLER);
      POINT_EDIT_COMPONENT.element.querySelector('.event--edit').addEventListener('click', CLOSE_EDIT_HANDLER);
    });

    POINT_EDIT_COMPONENT.element.querySelector('.event--edit').addEventListener('submit', (evt) => {
      evt.preventDefault();
      REPLACE_FORM_TO_CARD();
      document.removeEventListener('keydown', ESC_KEY_DOWN_HANDLER);
    });

    render(POINT_COMPONENT, this.#scheduleComponent.element);
  }
}
