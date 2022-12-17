import {createElement} from '../render';

function createEmptyPointsTemplate() {
  return (`<p class="trip-events__msg">Click New Event to create your first point</p>`);
}

export default class EmptyPointsView {
  #element;

  get template() {
    return createEmptyPointsTemplate();
  }

  get element() {
    if(!this.#element){
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
