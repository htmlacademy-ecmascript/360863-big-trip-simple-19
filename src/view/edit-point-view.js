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
      ${point.offers.filter((el) => el === offer.id).length > 0 ? 'checked' : ''} data-offer-id="${offer.id}">
      <label class="event__offer-label" for="event-offer-${offer.title}-${point.id}">
        <span class="event__offer-title">Add ${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');
}

function createDestinationsTemplate(destinations){
  return destinations.map((el) => `<option value="${el.name}">`).join('');
}

function createPointEditorTemplate(offers, destinations, point, offersByType) {
  const typesTemplate = createTypesTemplate(point.type, point.id);
  const pointDestination = destinations.find((el) => el.id === point.destination);
  const timeFrom = dayjs(point.date_from).format('YY/MM/DD HH:mm');
  const timeTo = dayjs(point.date_to).format('YY/MM/DD HH:mm');
  const offersTemplate = createOffersTemplate(offersByType, point);
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
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeTo}">
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

            ${offersTemplate}

          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination.description}</p>
        </section>
      </section>
    </form>
  </li>
  `);
}

export default class EditPointView extends AbstractStatefulView {
  #offers;
  #destinations;
  #point;
  #offersByType;
  #handleFormSubmit;
  #handleCloseClick;

  constructor({offers, destinations, point, offersByType, onFormSubmit, onCloseClick}) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this._state = point;
    this.#point = Object.assign({}, point);
    this.#offersByType = offersByType;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditorTemplate(this.#offers, this.#destinations, this._state, this.#offersByType);
  }

  reset(point) {
    point = this.#point;
    this.updateElement(point);
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
    this.element.querySelectorAll('.event__type-input').forEach((el) => {el.addEventListener('click', this.#typeChangeHandler);});
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('input[name="event-start-time"]').addEventListener('change', this.#startTimeChangeHandler);
    this.element.querySelector('input[name="event-end-time"]').addEventListener('change', this.#endTimeChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((el) => el.addEventListener('click', this.#offersChangeHandler));
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick(this._state);
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this._state.type = evt.target.value;
    this.updateElement({
      type: this._state.type,
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    if (this.#destinations.find((el) => el.name === evt.target.value)) {
      this._state.destination = this.#destinations.find((el) => el.name === evt.target.value).id;
      this.updateElement({
        destination: this._state.destination,
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._state.base_price = evt.target.value;
    this.updateElement({
      base_price: this._state.base_price,
    });
  };

  #startTimeChangeHandler = (evt) => {
    evt.preventDefault();
    const dateValue = `20${evt.target.value}`; /*TODO:Не смог решить по другому, получилось странно*/
    const data = new Date(dateValue);
    this._state.date_from = dayjs(data).format('YYYY-MM-DDTHH:mm:ss');
    this.updateElement({
      date_from: this._state.date_from,
    });
  };

  #endTimeChangeHandler = (evt) => {
    evt.preventDefault();
    const dateValue = `20${evt.target.value}`; /*TODO:Не смог решить по другому, получилось странно*/
    const data = new Date(dateValue);
    this._state.date_to = dayjs(data).format('YYYY-MM-DDTHH:mm:ss');
    this.updateElement({
      date_to: this._state.date_to,
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offersIdArray = [];
    this.element.querySelectorAll('.event__offer-checkbox:checked').forEach((el) => {offersIdArray.push(el.dataset.offerId);});
    this._state.offers = offersIdArray;
  };

}

/*TODO: как перевести переменные date_to в кэмэл кейс*/
