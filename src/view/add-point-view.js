import {POINT_TYPES} from '../const';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createTypesTemplate(currentType, pointId) {
  return POINT_TYPES.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${pointId}">${type}</label>
    </div>`).join('');
}

function createOffersTemplate(offersByType, point) {
  const offers = offersByType.find((el) => {if(el.type === point.type){return el.type;}}).offers;

  return offers.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${point.id}" type="checkbox" name="event-offer-${offer.title}"
      ${point.offers.filter((el) => el === offer.id).length > 0 ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title}-${point.id}">
        <span class="event__offer-title">Add ${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');
}

function createPhotosTemplate(destinations, point) {
  const images = destinations.find((el) => el.id === point.destination).pictures;

  return images.map((el) =>
    `<img class="event__photo" src="${el.src}" alt="${el.description}">`
  ).join('');
}

function createDestinationsTemplate(destinations){
  return destinations.map((el) => `<option value="${el.name}"></option>`);
}

function getAddPointTemplate(offers, destinations, point, offersByType) {
  const typesTemplate = createTypesTemplate(point.type, point.id);
  const pointDestination = destinations.find((el) => el.id === point.destination);
  const timeFrom = dayjs(point.date_from).format('YY/MM/DD HH:mm');
  const timeTo = dayjs(point.date_to).format('YY/MM/DD HH:mm');
  const offersTemplate = createOffersTemplate(offersByType, point);
  const photosTemplate = createPhotosTemplate(destinations, point);
  const destinationsTemplate = createDestinationsTemplate(destinations);


  return (`
    <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${typesTemplate}
            </fieldset>
          </div>

        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${point.id}">
            ${point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-${point.id}">
          <datalist id="destination-list-${point.id}">
            ${destinationsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${timeFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${timeTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${point.id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="${point.base_price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">

          ${offersTemplate}

          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photosTemplate}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>
  `);
}

export default class AddPointView extends AbstractStatefulView {
  #offers;
  #destinations;
  #offersByType;
  #point;

  constructor({offers, destinations, point, offersByType}) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this._state = point;
    this.#point = Object.assign({}, point);
    this.#offersByType = offersByType;

    this._restoreHandlers();
  }

  get template() {
    return getAddPointTemplate(this.#offers, this.#destinations, this._state, this.#offersByType);
  }

  _restoreHandlers() {
    this.element.querySelectorAll('.event__type-input').forEach((el) => {el.addEventListener('click', this.#typeChangeHandler);});
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('input[name="event-start-time"]').addEventListener('change', this.#startTimeChangeHandler);
    this.element.querySelector('input[name="event-end-time"]').addEventListener('change', this.#endTimeChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((el) => el.addEventListener('click', this.#offersChangeHandler));
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#reset)
  }

  #reset = () => {
    this._state = this.#point;
    this.updateElement(this._state);
  }

  #typeChangeHandler = (evt) => {
    this._state.type = evt.target.value;
    this.updateElement({
      type: this._state.type,
    });
  };

  #destinationChangeHandler = (evt) => {
    if(this.#destinations.find((el) => el.name === evt.target.value)) {
      this._state.destination = this.#destinations.find((el) => el.name === evt.target.value).id;
      this.updateElement({
        destination: this._state.destination,
      });
    }
  };

  #priceChangeHandler = (evt) => {
    this._state.base_price = evt.target.value;
    this.updateElement({
      base_price: this._state.base_price,
    });
  };

  #startTimeChangeHandler = (evt) => {
    const dateValue = `20${evt.target.value}`; /*TODO:Не смог решить по другому, получилось странно*/
    const data = new Date(dateValue);
    this._state.date_from = dayjs(data).format('YYYY-MM-DDTHH:mm:ss');
    this.updateElement({
      date_from: this._state.date_from,
    });
  };

  #endTimeChangeHandler = (evt) => {
    const dateValue = `20${evt.target.value}`; /*TODO:Не смог решить по другому, получилось странно*/
    const data = new Date(dateValue);
    this._state.date_to = dayjs(data).format('YYYY-MM-DDTHH:mm:ss');
    this.updateElement({
      date_to: this._state.date_to,
    });
  };

  #offersChangeHandler = () => {
    const offersIdArray = [];
    this.element.querySelectorAll('.event__offer-checkbox:checked').forEach((el) => {offersIdArray.push(el.dataset.offerId);});
    this._state.offers = offersIdArray;
  };
}
