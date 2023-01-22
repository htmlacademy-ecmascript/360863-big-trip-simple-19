import ScheduleView from '../view/schedule-view.js';
import AddPointView from '../view/add-point-view';
import {render, RenderPosition} from '../framework/render.js';
import EmptyPointsView from '../view/empty-points-view';
import SortingView from '../view/sorting-view';
import PointPresenter from './point-presenter';
import {updateItem} from '../utils/utils';
import {SORTING_TYPES} from '../const';

export default class SchedulePresenter {
  #scheduleContainer;
  #dataModel;
  #sortingModel;
  #points;
  #destinations;
  #offersByType;
  #offers;
  #blankPoint;
  #sortingList;
  #noPointComponent = new EmptyPointsView();
  #scheduleComponent = new ScheduleView();
  #sortComponent;
  #pointPresenter = new Map();
  #sourcedSchedulePoints = [];
  #currentSortType;

  constructor({scheduleContainer, DATA_MODEL, SORTING_MODEL}) {
    this.#scheduleContainer = scheduleContainer;
    this.#dataModel = DATA_MODEL;
    this.#sortingModel = SORTING_MODEL;
    this.#currentSortType = this.#sortingModel.sortingList[0];
  }

  init() {
    this.#points = [...this.#dataModel.points];
    this.#destinations = [...this.#dataModel.destinations];
    this.#offersByType = [...this.#dataModel.offersByType];
    this.#offers = [...this.#dataModel.offers];
    this.#blankPoint = [...this.#dataModel.blankPoint];
    this.#sortingList = [...this.#sortingModel.sortingList];
    this.#sourcedSchedulePoints = [...this.#dataModel.points];

    this.renderBoard();
  }

  renderBoard() {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
    }

    this.#renderSort();
    this.#renderAddPoint();
    this.#renderPointsList();
  }

  #handleSortTypeChange = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPoinList();
    this.#renderPointsList();
  };

  #sortPoints(sortType) {

    if (sortType === SORTING_TYPES.DAY && this.#currentSortType === SORTING_TYPES.DAY) {
      sortType = '';
    }

    switch (sortType) {
      case SORTING_TYPES.PRICE:
        if (this.#currentSortType !== SORTING_TYPES.PRICE) {
          this.#points.sort((a,b) => b.basePrice - a.basePrice);
        }
        break;
      case SORTING_TYPES.DAY:
        this.#points.sort((a,b) => new Date(b.dateFrom) - new Date(a.dateFrom));
        break;
      default:
        this.#points = [...this.#sourcedSchedulePoints];
    }

    this.#currentSortType = sortType;
  }

  #renderSort() {
    this.#sortComponent = new SortingView({
      SORTING: this.#sortingList,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#scheduleContainer);
  }

  #renderAddPoint() {
    render(new AddPointView({offers: this.#offers, destinations: this.#destinations, point: this.#blankPoint[0], offersByType: this.#offersByType}), this.#scheduleComponent.element);
  }

  #renderPoint({point, offers, destinations, offersByType}) {
    const pointPresenter = new PointPresenter({
      scheduleComponent: this.#scheduleComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, offers, destinations, offersByType);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPointsList() {
    render(this.#scheduleComponent, this.#scheduleContainer);
    this.#points.forEach((point) => this.#renderPoint({point: point, offers: this.#offers, destinations: this.#destinations, offersByType: this.#offersByType}));
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#scheduleComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedSchedulePoints = updateItem(this.#sourcedSchedulePoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations, this.#offersByType);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPoinList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }
}
