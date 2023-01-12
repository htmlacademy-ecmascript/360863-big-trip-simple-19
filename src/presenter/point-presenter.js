import PointView from '../view/point-view';
import {render, replace} from '../framework/render';
import AddPointView from '../view/add-point-view'; /*TODO: куда-то добавить вывод AddPoint Component*/
import EditPointView from '../view/edit-point-view';

export default class PointPresenter {
  #scheduleComponent;
  #pointComponent;
  #pointAddComponent;
  #pointEditComponent;
  #point;
  #offers;
  #destinations;
  #offersByType;

  constructor({scheduleComponent}) {
    this.#scheduleComponent = scheduleComponent;
  }

  init(point, offers, destinations, offersByType) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#offersByType = offersByType;

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

    render(this.#pointComponent, this.#scheduleComponent);
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent)
    document.addEventListener('keydown', this.#escKeyDownHandler);
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
