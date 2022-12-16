import {createElement} from '../render';

function createScheduleTemplate() {
  return (`
  <ul class="trip-events__list"></ul>
  `);
}

export default class ScheduleView {
  #element;

  get template() {
    return createScheduleTemplate();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
