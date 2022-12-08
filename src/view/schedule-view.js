import {createElement} from '../render';

function createScheduleTemplate() {
  return (`
  <ul class="trip-events__list"></ul>
  `);
}

export default class ScheduleView {

  getTemplate() {
    return createScheduleTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }

}
