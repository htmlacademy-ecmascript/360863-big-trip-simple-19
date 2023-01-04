import {POINT_TYPES} from '../const';
import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

function createTypesTemplate(currentType) {
  return POINT_TYPES.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`).join('');
}

function createOffersTemplate(offersByType, point) {
  const OFFERS = offersByType.find((el) => {if(el.type === point.type){return el.type;}}).offers;

  return OFFERS.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}"
      ${point.offers.filter((el) => el === offer.id).length > 0 ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title}-1">
        <span class="event__offer-title">Add ${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');
}

function createDestinationsTemplate(destinations){
  return destinations.map((el) => `<option value="${el.name}"></option>`);
}

function createPointEditorTemplate(offers, destinations, point, offersByType) {
  const TYPES_TEMPLATE = createTypesTemplate(point.type);
  const DESTINATION = destinations.find((el) => el.id === point.destination);
  const TIME_FROM = dayjs(point.date_from).format('YY/MM/DD HH:mm');
  const TIME_TO = dayjs(point.date_to).format('YY/MM/DD HH:mm');
  const OFFERS_TEMPLATE = createOffersTemplate(offersByType, point);
  const DESTINATIONS_TEMPLATE = createDestinationsTemplate(destinations);

  return (`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${TYPES_TEMPLATE}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${DESTINATION.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${DESTINATIONS_TEMPLATE}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${TIME_FROM}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${TIME_TO}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.base_price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">

            ${OFFERS_TEMPLATE}

          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${DESTINATION.description}</p>
        </section>
      </section>
    </form>
  </li>
  `);
}

export default class EditPointView extends AbstractView {
  #offers;
  #destinations;
  #point;
  #offersByType;

  constructor({offers, destinations, point, offersByType}) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this.#point = point;
    this.#offersByType = offersByType;
  }

  get template() {
    return createPointEditorTemplate(this.#offers, this.#destinations, this.#point, this.#offersByType);
  }
}
