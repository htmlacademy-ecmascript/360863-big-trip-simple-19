import ScheduleView from '../view/schedule-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import EmptyPointsView from '../view/empty-points-view';
import SortingView from '../view/sorting-view';
import PointPresenter from './point-presenter';
import {FILTER_TYPE, SORTING_TYPES, UPDATE_TYPE, USER_ACTION} from '../const';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {FILTER} from '../utils/filter';
import NewPointPresenter from './new-point-presenter';
import LoadingView from '../view/loading-view';
import ServerErrorView from '../view/server-error-view';
dayjs.extend(customParseFormat);
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class SchedulePresenter {
  #scheduleContainer;
  #dataModel;
  #sortingModel;
  #sortingList;
  #noPointComponent = null;
  #scheduleComponent = new ScheduleView();
  #sortComponent;
  #addPointComponent = null;
  #pointPresenter = new Map();
  #currentSortType;
  #filterModel;
  #filterType = FILTER_TYPE.EVERYTHING;
  #newPointPresenter = null;
  #onNewPointDestroy;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #serverErrorComponent = new ServerErrorView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({scheduleContainer, filterModel, DATA_MODEL, SORTING_MODEL, onNewPointDestroy}) {
    this.#scheduleContainer = scheduleContainer;
    this.#dataModel = DATA_MODEL;
    this.#sortingModel = SORTING_MODEL;
    this.#currentSortType = SORTING_TYPES.DEFAULT;
    this.#filterModel = filterModel;
    this.#onNewPointDestroy = onNewPointDestroy;
    this.#sortingList = this.#sortingModel.sortingList;

    this.#dataModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#dataModel.points;
    const filteredPoints = FILTER[this.#filterType](points);

    switch (this.#currentSortType) {
      case SORTING_TYPES.DEFAULT:
        return filteredPoints.sort((a,b) => dayjs(a.dateFrom, 'DD-MM-YYTHH:mm:ss') - dayjs(b.dateFrom, 'DD-MM-YYTHH:mm:ss'));
      case SORTING_TYPES.PRICE:
        return filteredPoints.sort((a,b) => b.basePrice - a.basePrice);
      case SORTING_TYPES.DAY:
        return filteredPoints.sort((a,b) => dayjs(b.dateFrom, 'DD-MM-YYTHH:mm:ss') - dayjs(a.dateFrom, 'DD-MM-YYTHH:mm:ss'));
    }

    return filteredPoints;
  }

  get destinations() {
    return this.#dataModel.destinations;
  }

  get offersByType() {
    return this.#dataModel.offersByType;
  }

  get blankPoint() {
    return this.#dataModel.blankPoint;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {

    this.#newPointPresenter = new NewPointPresenter({
      destinations: this.destinations,
      point: this.blankPoint,
      offersByType: this.offersByType,
      pointListContainer: this.#scheduleComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewPointDestroy,
    });

    this.#currentSortType = SORTING_TYPES.DEFAULT;
    this.#filterModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);
    this.#newPointPresenter.init(this.destinations, this.blankPoint, this.offersByType);
  }

  #renderServerError() {
    render(this.#serverErrorComponent, this.#scheduleComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#scheduleComponent.element, RenderPosition.AFTERBEGIN);
  }

  renderServerError() {
    render(this.#serverErrorComponent, this.#scheduleComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {

    render(this.#scheduleComponent, this.#scheduleContainer);

    if (this.points.length === 0 && !this.#isLoading ) {
      this.#renderNoPoints();
    }

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const destinations = this.destinations;
    const offersByType = this.offersByType;

    this.#renderSort();
    this.#renderPointsList(points, destinations, offersByType);
  }

  #clearBoard(resetSortType = false) {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    if(this.#addPointComponent !== null) {
      remove(this.#addPointComponent);
    }

    if(this.#newPointPresenter !== null) {
      this.#newPointPresenter.destroy();
    }

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if(this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SORTING_TYPES.DEFAULT;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType && this.#currentSortType === SORTING_TYPES.DAY) {
      this.#currentSortType = SORTING_TYPES.DEFAULT;
      this.#clearBoard();
      this.#renderBoard();
      return;
    }

    if(this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      SORTING: this.#sortingList,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#scheduleContainer);
  }

  #renderPoint({point, destinations, offersByType}) {
    const pointPresenter = new PointPresenter({
      scheduleComponent: this.#scheduleComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, destinations, offersByType);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPointsList(points, destinations, offersByType) {
    render(this.#scheduleComponent, this.#scheduleContainer);
    points.forEach((point) => this.#renderPoint({point: point, destinations: destinations, offersByType: offersByType}));
  }

  #renderNoPoints() {
    this.#noPointComponent = new EmptyPointsView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#scheduleComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    if(this.#newPointPresenter !== null) {
      this.#newPointPresenter.destroy();
    }
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#dataModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case USER_ACTION.ADD_POINT:
        this.#newPointPresenter.setSaving();

        try {
          await this.#dataModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case USER_ACTION.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#dataModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.destinations, this.offersByType);
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearBoard(true);
        this.#renderBoard();
        break;
      case UPDATE_TYPE.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };
}
