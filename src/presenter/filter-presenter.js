import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {FILTER_TYPE, UPDATE_TYPE} from '../const.js';

export default class FilterPresenter {
  #filterContainer;
  #filterModel;
  #dataModel;

  #filterComponent = null;

  constructor({filterContainer, filterModel, DATA_MODEL}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#dataModel = DATA_MODEL;

    this.#dataModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return [
      {
        type: FILTER_TYPE.EVERYTHING,
        name: 'Everything',
      },
      {
        type: FILTER_TYPE.FUTURE,
        name: 'future',
      },
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UPDATE_TYPE.MAJOR, filterType);
  };
}
