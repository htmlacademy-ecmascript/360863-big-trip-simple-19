import AbstractView from '../framework/view/abstract-view';

function createSortingItemTemplate(sorting, isChecked) {
  const {name} = sorting;

  return (`
        <div class="trip-sort__item  trip-sort__item--${name}">
        <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${isChecked ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${name}">${name}</label>
      </div>
  `);
}
/*TODO: немного не понял как передается параметр isChecked*/

function createSortingTemplate(sortingItems) {

  const SORTING_ITEM_TEMPLATE = sortingItems
    .map((sorting, index) => createSortingItemTemplate(sorting, index === 0))
    .join('');

  return (`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${SORTING_ITEM_TEMPLATE}
  </form>
  `);
}

export default class SortingView extends AbstractView {
  #sorting;

  constructor({SORTING}) {
    super();
    this.#sorting = SORTING;
  }

  get template() {
    return createSortingTemplate(this.#sorting);
  }
}
