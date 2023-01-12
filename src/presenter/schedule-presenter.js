import ScheduleView from '../view/schedule-view.js';
import AddPointView from '../view/add-point-view';
import {render, RenderPosition} from '../framework/render.js';
import EmptyPointsView from '../view/empty-points-view';
import SortingView from '../view/sorting-view';
import BoardView from '../view/board-container';
import PointPresenter from './point-presenter';

export default class SchedulePresenter {
  #scheduleComponent = new ScheduleView();
  #scheduleContainer;
  #dataModel;
  #sortingModel;
  #points;
  #destinations;
  #offersByType;
  #offers;
  #blankPoint;
  #sortingList
  #noPointComponent = new EmptyPointsView();

  constructor({scheduleContainer, DATA_MODEL, SORTING_MODEL}) {
    this.#scheduleContainer = scheduleContainer;
    this.#dataModel = DATA_MODEL;
    this.#sortingModel = SORTING_MODEL;
  }

  init() {
    this.#points = [...this.#dataModel.points];
    this.#destinations = [...this.#dataModel.destinations];
    this.#offersByType = [...this.#dataModel.offersByType];
    this.#offers = [...this.#dataModel.offers];
    this.#blankPoint = [...this.#dataModel.blankPoint];
    this.#sortingList = [...this.#sortingModel.sortingList];

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

  #renderSort() {
    render(new SortingView({SORTING: this.#sortingList}), this.#scheduleContainer)
  }

  #renderAddPoint() {
    render(new AddPointView({offers: this.#offers, destinations: this.#destinations, point: this.#blankPoint[0], offersByType: this.#offersByType}), this.#scheduleComponent.element)
  }

  #renderPoint({point, offers, destinations, offersByType}) {
    const POINT_PRESENTER = new PointPresenter({
      scheduleComponent: this.#scheduleComponent.element,
    })

    POINT_PRESENTER.init(point, offers, destinations, offersByType)
  }

  #renderPointsList() {
    render(this.#scheduleComponent, this.#scheduleContainer);
    this.#points.forEach((point) => this.#renderPoint({point: point, offers: this.#offers, destinations: this.#destinations, offersByType: this.#offersByType}))
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#scheduleComponent.element, RenderPosition.AFTERBEGIN)
  }
}
