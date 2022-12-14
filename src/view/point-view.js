import {createElement} from '../render';
import {humanizeDate, humanizeTime} from '../utils';

function getOffersTemplate(point, offers) {

  return offers.filter((offer) => point.offers.includes(offer.id)).map((el) =>
    `<li class="event__offer">
      <span class="event__offer-title">${el.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${el.price}</span>
    </li>`
  ).join('');

}

function getPointTemplate(point, destinations, offers) {
  const DESTINATION = destinations.find((el) => el.id === point.destination);
  const DATE_FROM = humanizeDate(point.date_from);
  const TIME_FROM = humanizeTime(point.date_from);
  const TIME_TO = humanizeTime(point.date_to);
  const OFFERS_LIST = getOffersTemplate(point, offers);

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${DATE_FROM}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type} ${DESTINATION.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${point.date_from}">${TIME_FROM}</time>
            &mdash;
            <time class="event__end-time" datetime="${point.date_to}">${TIME_TO}</time>
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.base_price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${OFFERS_LIST}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
}

export default class PointView {
  constructor({point, destinations, offers}) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return getPointTemplate(this.point, this.destinations, this.offers);
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
