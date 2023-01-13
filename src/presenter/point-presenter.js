import PointView from '../view/point-view';
import {remove, render, replace} from '../framework/render';
import AddPointView from '../view/add-point-view'; /*TODO: куда-то добавить вывод AddPoint Component*/
import EditPointView from '../view/edit-point-view';

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
}

export default class PointPresenter {
  #scheduleComponent;
  #pointComponent = null;
  #pointEditComponent = null;
  #handleDataChange;
  #handleModeChange;
  #point;
  #offers;
  #destinations;
  #offersByType;
  #mode = MODE.DEFAULT;

  constructor({scheduleComponent, onDataChange, onModeChange}) {
    this.#scheduleComponent = scheduleComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, offers, destinations, offersByType) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#offersByType = offersByType;

    const PREV_POINT_COMPONENT = this.#pointComponent;
    const PREV_EDIT_POINT_COMPONENT = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditClick: this.#editClickHandler,
    });

    this.#pointEditComponent = new EditPointView({
      offers: this.#offers,
      destinations: this.#destinations,
      point: this.#point,
      offersByType: this.#offersByType,
      onFormSubmit: this.#handlerFormSubmit,
      onCloseClick: this.#handlerOnCloseClick,
    })

    if (PREV_POINT_COMPONENT === null || PREV_EDIT_POINT_COMPONENT === null) {
      render(this.#pointComponent, this.#scheduleComponent);
      return;
    }

    if(this.#mode === MODE.DEFAULT) {
      replace(this.#pointComponent, PREV_POINT_COMPONENT);
    }

    if(this.#mode === MODE.EDITING) {
      replace(this.#pointEditComponent, PREV_EDIT_POINT_COMPONENT);
    }

    remove(PREV_POINT_COMPONENT);
    remove(PREV_EDIT_POINT_COMPONENT);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if(this.#mode !== MODE.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = MODE.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent)
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = MODE.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replacePointToForm();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #editClickHandler = () => {
    this.#replacePointToForm();
  }

  #handlerFormSubmit = () => {
    this.#replaceFormToPoint();
  }

  #handlerOnCloseClick = () => {
    this.#replaceFormToPoint();
  }
}
