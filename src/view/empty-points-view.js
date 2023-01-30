import AbstractView from '../framework/view/abstract-view';
import {FILTER_TYPE} from '../const';

const noPointsTextType = {
  [FILTER_TYPE.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPE.FUTURE]: 'There are no future events now',
};

function createEmptyPointsTemplate(filterType) {
  const noPointTextValue = noPointsTextType[filterType];

  return (`<p class="trip-events__msg">${noPointTextValue}</p>`);
}

export default class EmptyPointsView extends AbstractView {
  #filterType;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointsTemplate(this.#filterType);
  }
}
