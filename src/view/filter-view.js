import AbstractView from '../framework/view/abstract-view';

function createFilterItemTemplate(filter, currentFilterType) {
  const {type, name} = filter;
  return(
    `<div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''}>
  <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`
  );
}

function createFilterTemplate(filterItems, currentFilterType) {

  const filterItemTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (`
    <form class="trip-filters" action="#" method="get">
      ${filterItemTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
}

export default class FilterView extends AbstractView {
  #filters;
  #currentFilter;
  #handleFilterTypeChange;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    if(evt.target.classList.contains('trip-filters__filter-input')) {
      this.#handleFilterTypeChange(evt.target.value);
    }
  };
}
