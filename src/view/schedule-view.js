import {createElement} from '../render';

function createScheduleTemplate() {
  return (`
  <ul class="trip-events__list"></ul>
  `);
}

export default class ScheduleView {

  get Template() {
    return createScheduleTemplate();
  }

  get Element() {
    if(!this.element) {
      this.element = createElement(this.Template);
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }

}
