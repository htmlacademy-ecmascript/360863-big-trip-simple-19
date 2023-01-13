import FilterView from './view/filter-view.js';
import {render} from './framework/render.js';
import SchedulePresenter from './presenter/schedule-presenter.js';
import DataModel from './model/points-model';
import SortingModel from './model/sorting-model';
import {generateFilter} from './mock/filter';

const HEADER = document.querySelector('.page-header');
const MAIN = document.querySelector('.page-main');
const TRIP_CONTROL_ELEMENTS = HEADER.querySelector('.trip-controls__filters');
const TRIP_ELEMENTS = MAIN.querySelector('.trip-events');
const DATA_MODEL = new DataModel();
const SORTING_MODEL = new SortingModel();
const SCHEDULE_PRESENTER = new SchedulePresenter({scheduleContainer: TRIP_ELEMENTS, DATA_MODEL, SORTING_MODEL});
const FILTERS = generateFilter();

render(new FilterView({FILTERS}), TRIP_CONTROL_ELEMENTS);

SCHEDULE_PRESENTER.init();
