import FilterView from './view/filter-view.js';
import SortingView from './view/sorting-view';
import {render} from './framework/render.js';
import SchedulePresenter from './presenter/schedule-presenter.js';
import DataModel from './model/points-model';
import {generateFilter} from './mock/filter';
import {generateSorting} from './mock/sorting';

const HEADER = document.querySelector('.page-header');
const MAIN = document.querySelector('.page-main');
const TRIP_CONTROL_ELEMENTS = HEADER.querySelector('.trip-controls__filters');
const TRIP_ELEMENTS = MAIN.querySelector('.trip-events');
const DATA_MODEL = new DataModel();
const SCHEDULE_PRESENTER = new SchedulePresenter({scheduleContainer: TRIP_ELEMENTS, DATA_MODEL});
const FILTERS = generateFilter();
const SORTING = generateSorting();

render(new FilterView({FILTERS}), TRIP_CONTROL_ELEMENTS);
render(new SortingView({SORTING}), TRIP_ELEMENTS);

SCHEDULE_PRESENTER.init(TRIP_ELEMENTS);
