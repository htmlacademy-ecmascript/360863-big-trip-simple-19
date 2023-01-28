import {remove, render, RenderPosition} from '../framework/render';
import EditPointView from '../view/edit-point-view';
import {nanoid} from 'nanoid';
import {USER_ACTION, UPDATE_TYPE} from '../const';
import AddPointView from '../view/add-point-view';


export default class NewPointPresenter {
  #pointListContainer;
  #handleDataChange;
  #handleDestroy;
  #point;
  #offers;
  #destinations;
  #offersByType;

  #pointAddComponent = null;

  constructor({offers, destinations, point, offersByType, pointListContainer, onDataChange, onDestroy}) {
    this.#offers = offers;
    this.#destinations = destinations;
    this.#point = point;
    this.#offersByType = offersByType;
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointAddComponent !== null) {
      return;
    }

    this.#pointAddComponent = new AddPointView({
      offers: this.#offers,
      destinations: this.#destinations,
      point: this.#point,
      offersByType: this.#offersByType,
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel: this.#handleDeleteClick
    });

    render(this.#pointAddComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if(this.#pointAddComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointAddComponent);
    this.#pointAddComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      USER_ACTION.ADD_POINT,
      UPDATE_TYPE.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
