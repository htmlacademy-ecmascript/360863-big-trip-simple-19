import FilterView from './view/filter-view.js';
import {render} from './framework/render.js';
import SchedulePresenter from './presenter/schedule-presenter.js';
import DataModel from './model/points-model';
import SortingModel from './model/sorting-model';
import {generateFilter} from './mock/filter';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripControlElements = headerElement.querySelector('.trip-controls__filters');
const tripElements = mainElement.querySelector('.trip-events');
const DATA_MODEL = new DataModel();
const SORTING_MODEL = new SortingModel();
const schedulePresenter = new SchedulePresenter({scheduleContainer: tripElements, DATA_MODEL, SORTING_MODEL});
const FILTERS = generateFilter();

render(new FilterView({FILTERS}), tripControlElements);

schedulePresenter.init();
