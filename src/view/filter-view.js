import AbstractView from '../framework/view/abstract-view';

function createFilterItemTemplate(filter, isChecked) {
  const {name} = filter;
  return(
    `<div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? 'checked' : ''}>
  <label class="trip-filters__filter-label" for="filter-everything">${name}</label>
  </div>`
  );
}
/*TODO:разобраться на консультации как передается параметр isChecked */

function createFilterTemplate(filterItems) {
  const filterItemTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
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

  constructor({FILTERS}) {
    super();
    this.#filters = FILTERS;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
