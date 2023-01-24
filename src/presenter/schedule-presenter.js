import ScheduleView from '../view/schedule-view.js';
import AddPointView from '../view/add-point-view';
import {render, RenderPosition, remove} from '../framework/render.js';
import EmptyPointsView from '../view/empty-points-view';
import SortingView from '../view/sorting-view';
import PointPresenter from './point-presenter';
import {SORTING_TYPES, UPDATE_TYPE, USER_ACTION} from '../const';

export default class SchedulePresenter {
  #scheduleContainer;
  #dataModel;
  #sortingModel;
  #destinations;
  #offersByType;
  #offers;
  #blankPoint;
  #sortingList;
  #noPointComponent = new EmptyPointsView();
  #scheduleComponent = new ScheduleView();
  #sortComponent;
  #addPointComponent;
  #pointPresenter = new Map();
  #currentSortType;
  #defaulSort;

  constructor({scheduleContainer, DATA_MODEL, SORTING_MODEL}) {
    this.#scheduleContainer = scheduleContainer;
    this.#dataModel = DATA_MODEL;
    this.#sortingModel = SORTING_MODEL;
    this.#defaulSort = this.#sortingModel.sortingList[0];
    this.#currentSortType = this.#defaulSort;

    this.#dataModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SORTING_TYPES.PRICE:
        return [...this.#dataModel.points].sort((a,b) => b.basePrice - a.basePrice);
      case SORTING_TYPES.DAY:
        return [...this.#dataModel.points].sort((a,b) => new Date(b.dateFrom) - new Date(a.dateFrom));
    }

    return this.#dataModel.points;
  }

  init() {
    this.#destinations = [...this.#dataModel.destinations];
    this.#offersByType = [...this.#dataModel.offersByType];
    this.#offers = [...this.#dataModel.offers];
    this.#blankPoint = [...this.#dataModel.blankPoint];
    this.#sortingList = [...this.#sortingModel.sortingList];

    this.#renderBoard();
  }

  #renderBoard() {
    if (this.points.length === 0) {
      this.#renderNoPoints();
    }

    this.#renderSort();
    this.#renderAddPoint();
    this.#renderPointsList();
  }

  #clearBoard({resetRenderedPointCount = false, resetSortType = false} = {}) {
    const pointCount = this.points.length;

    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noPointComponent);
    remove(this.#addPointComponent);

/*    if (resetRenderedPointCount) {
      this.#renderedPointCount = TASK_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedPointCount = Math.min(pointCount, this.#renderedPointCount);
    }*/

    if (resetSortType) {
      this.#currentSortType = this.#defaulSort;
    }
  }

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      SORTING: this.#sortingList,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#scheduleContainer);
  }

  #renderAddPoint() {
    this.#addPointComponent = new AddPointView({offers: this.#offers, destinations: this.#destinations, point: this.#blankPoint[0], offersByType: this.#offersByType});
    render(this.#addPointComponent, this.#scheduleComponent.element);
  }

  #renderPoint({point, offers, destinations, offersByType}) {
    const pointPresenter = new PointPresenter({
      scheduleComponent: this.#scheduleComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, offers, destinations, offersByType);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPointsList() {
    render(this.#scheduleComponent, this.#scheduleContainer);
    this.points.forEach((point) => this.#renderPoint({point: point, offers: this.#offers, destinations: this.#destinations, offersByType: this.#offersByType}));
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#scheduleComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#dataModel.updatePoint(updateType, update);
        break;
      case USER_ACTION.ADD_POINT:
        this.#dataModel.addPoint(updateType, update);
        break;
      case USER_ACTION.DELETE_POINT:
        this.#dataModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.#offers, this.#destinations, this.#offersByType);
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UPDATE_TYPE.MAJOR:
        break;
    }
  }
}
