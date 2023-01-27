export default class filterPresenter {

  constructor({filterContainer, DATA_MODEL, SORTING_MODEL}) {
    this.#scheduleContainer = scheduleContainer;
    this.#dataModel = DATA_MODEL;
    this.#sortingModel = SORTING_MODEL;
    this.#defaulSort = this.#sortingModel.sortingList[0];
    this.#currentSortType = this.#defaulSort;

    this.#dataModel.addObserver(this.#handleModelEvent);
  }
}
