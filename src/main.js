import {render, RenderPosition} from './framework/render.js';
import SchedulePresenter from './presenter/schedule-presenter.js';
import DataModel from './model/points-model';
import SortingModel from './model/sorting-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButtonView from './view/new-point-button-view';


const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripControlElements = headerElement.querySelector('.trip-controls__filters');
const tripElements = mainElement.querySelector('.trip-events');
const DATA_MODEL = new DataModel();
const SORTING_MODEL = new SortingModel();
const filterModel = new FilterModel();
const tripHeaderElement = document.querySelector('.trip-main');

const schedulePresenter = new SchedulePresenter({
  scheduleContainer: tripElements,
  filterModel,
  DATA_MODEL,
  SORTING_MODEL,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter ({
  filterContainer: tripControlElements,
  filterModel,
  DATA_MODEL
});

const newPointButtonComponent = new NewPointButtonView ({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  schedulePresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, tripHeaderElement, RenderPosition.BEFOREEND);

filterPresenter.init();
schedulePresenter.init();
