import AbstractView from '../framework/view/abstract-view';
import {humanizeDate} from '../utils/utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function getOffersTemplate(point, offers) {
  point.offers.forEach((el) => +el);

  return offers.filter((offer) => point.offers.includes(offer.id)).map((el) =>
    `<li class="event__offer">
      <span class="event__offer-title">${el.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${el.price}</span>
    </li>`
  ).join('');
}

function getPointTemplate(point, destinations, offers) {
  const pointDestination = destinations.find((el) => el.id === point.destination);
  const date = dayjs(point.dateFrom, 'DD-MM-YYTHH:mm:ss');
  const dateFrom = humanizeDate(date);
  const timeFrom = dayjs(point.dateFrom, 'DD-MM-YYTHH:mm:ss').format('HH:mm');
  const timeTo = dayjs(point.dateTo, 'DD-MM-YYTHH:mm:ss').format('HH:mm');
  const offersList = getOffersTemplate(point, offers);

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${dateFrom}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type} ${pointDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${point.dateFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${point.dateTo}">${timeTo}</time>
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersList}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
}

export default class PointView extends AbstractView {
  #point;
  #destinations;
  #offers;
  #handleEditClick;

  constructor({point, destinations, offers, onEditClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return getPointTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
