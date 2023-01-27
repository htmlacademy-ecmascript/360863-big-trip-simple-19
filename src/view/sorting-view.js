import AbstractView from '../framework/view/abstract-view';

function createSortingItemTemplate(sorting, currentSortType) {
  const {name} = sorting;

  return (`
        <div class="trip-sort__item  trip-sort__item--${name}">
        <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" data-sort-type="${name}" name="trip-sort" value="sort-${name}" ${name === currentSortType ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${name}">${name}</label>
      </div>
  `);
}

function createSortingTemplate(sortingItems, currentSortType) {

  const sortingItemTemplate = sortingItems
    .map((sorting, index) => createSortingItemTemplate(sorting, currentSortType, index === 0))
    .join('');

  return (`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortingItemTemplate}
  </form>
  `);
}

export default class SortingView extends AbstractView {
  #sorting;
  #handleSortTypeChange;
  #currentSortType = null;

  constructor({SORTING, currentSortType, onSortTypeChange}) {
    super();
    this.#sorting = SORTING;
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#sorting, this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.classList.contains('trip-sort__input')) {
      this.#handleSortTypeChange(evt.target.dataset.sortType);
    }
  };
}
