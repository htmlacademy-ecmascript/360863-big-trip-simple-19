import {POINT_TYPES} from '../const';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

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
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.replace(/\s+/g, '-').toLowerCase()}-${point.id}" type="checkbox" name="event-offer-${offer.title}"
      ${point.offers.filter((el) => el === offer.id).length > 0 ? 'checked' : ''} data-offer-id="${offer.id}">
      <label class="event__offer-label" for="event-offer-${offer.title.replace(/\s+/g, '-').toLowerCase()}-${point.id}">
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
  const timeFrom = dayjs(point.dateFrom, 'DD-MM-YYTHH:mm:ss').format('DD/MM/YY HH:mm');
  const timeTo = dayjs(point.dateTo, 'DD-MM-YYTHH:mm:ss').format('DD/MM/YY HH:mm');
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
          <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${timeFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${timeTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
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
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick;

  constructor({offers, destinations, point, offersByType, onFormSubmit, onCloseClick, onDeleteClick}) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this._state = point;
    this.#point = Object.assign({}, point);
    this.#offersByType = offersByType;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditorTemplate(this.#offers, this.#destinations, this._state, this.#offersByType);
  }

  reset(point) {
    point = this.#point;
    this.updateElement(point);
  }

  removeElement() {
    super.removeElement();

    if(this.#datepickerFrom){
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if(this.#datepickerTo){
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
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
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteHandler);
    this.#setDatepickers();
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
    this._state.basePrice = evt.target.value;
    this.updateElement({
      basePrice: +this._state.basePrice,
    });
  };

  #startTimeChangeHandler = (evt) => {
    evt.preventDefault();
    const dateValue = `${evt.target.value}`;
    this._state.dateFrom = dayjs(dateValue, 'DD/MM/YY HH:mm').format('DD-MM-YYTHH:mm:ss');
    this.updateElement({
      dateFrom: this._state.dateFrom,
    });
  };

  #endTimeChangeHandler = (evt) => {
    evt.preventDefault();
    const dateValue = `${evt.target.value}`;
    this._state.dateTo = dayjs(dateValue, 'DD/MM/YY HH:mm').format('DD-MM-YYTHH:mm:ss');
    this.updateElement({
      dateTo: this._state.dateTo,
    });
  };

  #offersChangeHandler = () => {
    const offersIdArray = [];
    this.element.querySelectorAll('.event__offer-checkbox:checked').forEach((el) => {offersIdArray.push(+el.dataset.offerId);});
    this._state.offers = offersIdArray;
  };

  #setDatepickers = () => {
    if(this.element.querySelector(`#event-start-time-${this._state.id}`)) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector(`#event-start-time-${this._state.id}`),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.id.dateFrom,
          enableTime: true,
          onChange: this.#dateFromChangeHandler,
        }
      );
    }

    if(this.element.querySelector(`#event-end-time-${this._state.id}`)) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector(`#event-end-time-${this._state.id}`),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.id.dateTo,
          enableTime: true,
          onChange: this.#dateToChangeHandler,
        }
      );
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this.#point);
  }
}
