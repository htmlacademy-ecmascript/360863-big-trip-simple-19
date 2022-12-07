import FilterView from './view/filter.js';
import SortingView from './view/sorting';
import {render} from './render';
import SchedulePresenter from './presenter/schedule-presenter.js';

const header = document.querySelector('.page-header');
const main = document.querySelector('.page-main');
const tripControlElements = header.querySelector('.trip-controls__filters');
const tripElements = main.querySelector('.trip-events');
const schedulePresenter = new SchedulePresenter({scheduleContainer: tripElements});

render(new FilterView(), tripControlElements);
render(new SortingView(), tripElements);

schedulePresenter.init();
