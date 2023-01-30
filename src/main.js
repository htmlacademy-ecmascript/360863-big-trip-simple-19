import {render, RenderPosition} from './framework/render.js';
import SchedulePresenter from './presenter/schedule-presenter.js';
import DataModel from './model/points-model';
import SortingModel from './model/sorting-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButtonView from './view/new-point-button-view';
import PointsApiService from './points-api-service';
import OffersApiService from './offers-api-service';
import DestinationsApiService from './destinations-api-service';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripControlElements = headerElement.querySelector('.trip-controls__filters');
const tripElements = mainElement.querySelector('.trip-events');
//const DATA_MODEL = new DataModel();
const SORTING_MODEL = new SortingModel();
const filterModel = new FilterModel();
const tripHeaderElement = document.querySelector('.trip-main');
const AUTHORIZATION = 'Basic er883jlhdzb534ds1adfw';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple/';

const dataModel = new DataModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION),
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION),
});

dataModel.init().then(() => {
  const schedulePresenter = new SchedulePresenter({
    scheduleContainer: tripElements,
    filterModel,
    DATA_MODEL: dataModel,
    SORTING_MODEL,
    onNewPointDestroy: handleNewPointFormClose
  });

  const filterPresenter = new FilterPresenter ({
    filterContainer: tripControlElements,
    filterModel,
    DATA_MODEL: dataModel
  });

  const newPointButtonComponent = new NewPointButtonView ({
    onClick: handleNewPointButtonClick
  });

  render(newPointButtonComponent, tripHeaderElement, RenderPosition.BEFOREEND);

  filterPresenter.init();
  schedulePresenter.init();

  function handleNewPointFormClose() {
    newPointButtonComponent.element.disabled = false;
  }

  function handleNewPointButtonClick() {
    schedulePresenter.createPoint();
    newPointButtonComponent.element.disabled = true;
  }
})





