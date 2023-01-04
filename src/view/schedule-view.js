import AbstractView from '../framework/view/abstract-view';

function createScheduleTemplate() {
  return (`
  <ul class="trip-events__list"></ul>
  `);
}

export default class ScheduleView extends AbstractView {
  get template() {
    return createScheduleTemplate();
  }
}
